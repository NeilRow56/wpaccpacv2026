"use server";

import { db } from "@/db";
import { connections } from "@/db/schema";
import { decrypt, encrypt } from "@/utils/encrypt";
import { eq, sql } from "drizzle-orm";
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";

type EmailSummary = {
  id: string;
  subject: string | null;
  from: string | null;
  snippet: string | null;
};

function getHeader(
  headers: Array<{ name: string; value: string }> | undefined,
  name: string
): string | null {
  if (!headers) return null;
  const h = headers.find((x) => x.name?.toLowerCase() === name.toLowerCase());
  return h?.value ?? null;
}

async function listUnreadMessagesIds(accessToken: string): Promise<string[]> {
  const url =
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread%20newer_than:3d&labelIds=INBOX";

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.status === 401) {
    const err = new Error("Unauthorized");
    //Tag error fo upstream handling
    (err as any).code = 401;

    throw err;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gmail list error: ${res.status} ${text}`);
  }

  const json = (await res.json()) as { messages?: Array<{ id: string }> };
  return (json.messages ?? []).map((m) => m.id);
}

async function getMessageSummary(accessToken: string, id: string) {
  const url =
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(id)}` +
    `?format=metadata&metadataHeaders=Subject&metadataHeaders=From`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gmail get error (${id} : ${res.status} ${text}`);
  }

  const json = await res.json();
  const headers = json?.payload?.headers as
    | Array<{ name: string; value: string }>
    | undefined;

  return {
    id: json?.id ?? id,
    subject: getHeader(headers, "Subject"),
    from: getHeader(headers, "From"),
    snippet: json?.snippet ?? null,
  };
}

async function refreshGoogleAccessToken(refreshToken: string): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Token refresh failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  const newAccessToken = json?.access_token;
  if (!newAccessToken || typeof newAccessToken !== "string") {
    throw new Error("Token refresh response missing access_token");
  }
  return newAccessToken;
}

async function markMessageRead(
  accessToken: string,
  ids: string[]
): Promise<void> {
  if (!ids.length) return;

  const res = await fetch(
    "https://gmail.gooleapis.com/gmail/v1/users/me/messages/batchModify",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids,
        removeLabelIds: ["UNREAD"],
      }),
    }
  );
}

export async function getUnseenEmailsForConnection(
  connectionId: string
): Promise<EmailSummary[]> {
  const rows = await db
    .select()
    .from(connections)
    .where(eq(connections.id, connectionId))
    .limit(1);
  const row = rows[0];
  if (!row) throw new Error("Connection not found");
  if (row.platform !== "gmail")
    throw new Error("Connection platform must be 'gmail");

  if (!row.access_token_enc) throw new Error("Missing Gmail access token");
  const accessTokenEnc = row.access_token_enc.toString("utf8");
  let accessToken = decrypt(accessTokenEnc);

  let ids: string[];
  try {
    ids = await listUnreadMessagesIds(accessToken);
  } catch (err: any) {
    if (err?.code === 401) {
      console.log(err, "err");
      if (!row.refresh_token_enc) {
        throw new Error("Access expired and no refresh token available");
      }

      const refreshTokenEnc = row.refresh_token_enc.toString("utf8");
      const refreshToken = decrypt(refreshTokenEnc);

      const newAccessToken = await refreshGoogleAccessToken(refreshToken);

      const encrypted = encrypt(newAccessToken);
      const ivHex = encrypted.split(":")[0];
      await db
        .update(connections)
        .set({
          access_token_enc: Buffer.from(encrypted, "utf8"),
          iv: Buffer.from(ivHex, "hex"),
          updated_at: sql`now()`,
        })
        .where(eq(connections.id, connectionId));

      accessToken = newAccessToken;
      ids = await listUnreadMessagesIds(accessToken);
    } else {
      throw err;
    }
  }

  if (!ids.length) return [];

  const summaries = await Promise.all(
    ids.map((id) => getMessageSummary(accessToken, id))
  );

  return summaries;
}
