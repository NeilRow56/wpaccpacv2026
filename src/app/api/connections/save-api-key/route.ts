import { db } from "@/db";
import { connections } from "@/db/schema";
import { auth } from "@/lib/auth";
import { encrypt } from "@/utils/encrypt";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

function maskKey(key: string) {
  if (!key) return "API Key";
  const last4 = key.slice(-4);
  return `API key ...${last4}`;
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { platform, apiKey, apiEndpoint } = body || {};

  const allowed = ["openai", "gemini", "claude"];

  if (!platform || !allowed.includes(String(platform).toLowerCase())) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }

  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json({ error: "Missing API key" }, { status: 400 });
  }

  try {
    const encryptedApiKey = encrypt(apiKey);
    const ivHex = encryptedApiKey.split(":")[0];
    const iv = Buffer.from(ivHex, "hex");

    const accountName = `${platform.toUpperCase()} ${maskKey(apiKey)}`;

    const existing = await db
      .select()
      .from(connections)
      .where(
        and(
          eq(connections.user_id, session.user.id),
          eq(connections.platform, platform),
          eq(connections.account_name, accountName) // check for same account
        )
      )
      .limit(1);

    let saved;

    if (existing.length > 0) {
      saved = await db
        .update(connections)
        .set({
          access_token_enc: Buffer.from(encryptedApiKey, "utf8"),
          refresh_token_enc: null,
          iv,
          metadata: { type: "api-key", endpoint: apiEndpoint || null },
          updated_at: sql`now()`,
        })
        .where(eq(connections.id, existing[0].id))
        .returning();
    } else {
      const id = crypto.randomUUID();
      saved = await db
        .insert(connections)
        .values({
          id,
          user_id: session.user.id,
          platform,
          account_name: accountName,
          access_token_enc: Buffer.from(encryptedApiKey, "utf8"),
          refresh_token_enc: null,
          iv,
          metadata: { type: "api-key", endpoint: apiEndpoint || null },
        })
        .returning();
    }

    const { access_token_enc, refresh_token_enc, ...safe } = saved[0];

    return NextResponse.json({ connection: safe }, { status: 200 });
  } catch (error) {
    console.error("Save API key error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
