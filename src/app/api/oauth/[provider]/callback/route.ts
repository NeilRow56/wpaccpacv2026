import { db } from "@/db";
import { connections } from "@/db/schema";
import { auth } from "@/lib/auth";
import { providers } from "@/lib/oauth/providers";

import { encrypt } from "@/utils/encrypt";
import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PROVIDERS_CONFIGS = {
  gmail: {
    endpoint: "https://www.googleapis.com/oauth2/v2/userinfo",
    headers: (token: string) => ({ Authorization: `Bearer ${token}` }),
    extractAccountName: (data: any) => data.email ?? "Google Account",
    extractUserInfo: (data: any) => data,
  },
  sheets: {
    endpoint: "https://www.googleapis.com/oauth2/v2/userinfo",
    headers: (token: string) => ({ Authorization: `Bearer ${token}` }),
    extractAccountName: (data: any) => data.email ?? "Google Account",
    extractUserInfo: (data: any) => data,
  },
  slack: {
    endpoint: "https://slack.com/api/users.identity",
    headers: (token: string) => ({}),
    extractAccountName: (data: any) => data.user?.email ?? "Slack Workspace",
    extractUserInfo: (data: any) => data,
    useTokenInUrl: true,
  },
  notion: {
    endpoint: "https://api.notion.com/v1/users/me",
    headers: (token: string) => ({
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    }),
    extractAccountName: (data: any) =>
      data.person?.email ?? data.name ?? "Notion User",

    extractUserInfo: (data: any) => data,
  },

  discord: {
    endpoint: "https://discord.com/api/users/@me",
    headers: (token: string) => ({ Authorization: `Bearer ${token}` }),
    extractAccountName: (data: any) =>
      data.username
        ? `${data.username}#${data.discriminator || "0000"}`
        : "Discord User",
    extractUserInfo: (data: any) => data,
  },
  stripe: {
    // Stripe is special - account info comes from the OAuth token response
    isSpecial: true,
    extractAccountName: (tokens: any) =>
      tokens.stripe_user_id ?? "Stripe Account",
    extractUserInfo: (tokens: any) => ({
      stripe_iser_id: tokens.stripe_user_id,
    }),
  },
} as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  // const session = getServerSession();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { provider } = await params;

  const providerKey = provider as keyof typeof providers;

  const cfg = providers[providerKey];
  if (!cfg) {
    return NextResponse.json({ error: "Unknown Provider" }, { status: 404 });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  let returnUrl = null;

  if (state) {
    try {
      const stateData = JSON.parse(atob(state));
      returnUrl = stateData.returnUrl;
    } catch (error) {
      console.error("Error parsing state", error);
    }
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const tokenRes = await fetch(cfg.access_url, {
      method: "POST",
      headers: { "Content-Type": "application/z-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: cfg.key,
        client_secret: cfg.secret,
        redirect_uri: appUrl + cfg.callback,
      }),
    });

    if (!tokenRes.ok) {
      console.log("Token exchange failed", await tokenRes.text());
      return NextResponse.json(
        { error: "Token exchange failed" },
        { status: 400 }
      );
    }

    const tokens = await tokenRes.json();
    console.log("Received tokens:", tokens);

    if (!tokens.access_token) {
      console.log("No access token in the response:", tokens);

      return NextResponse.json(
        { error: "No access token received" },
        { status: 400 }
      );
    }

    const { accountName, userInfo } = await deriveAccountName(provider, tokens);

    const encryptedAccessToken = encrypt(tokens.access_token);
    const encryptedRefreshToken = tokens.refresh_token
      ? encrypt(tokens.refresh_token)
      : null;
    const iv = Buffer.from(encryptedAccessToken.split(":")[0], "hex");

    const existingConnection = await db
      .select()
      .from(connections)
      .where(
        and(
          eq(connections.user_id, session?.user.id),
          eq(connections.platform, provider),
          eq(connections.account_name, accountName) // check for same account
        )
      );

    if (existingConnection.length > 0) {
      const updateData: any = {
        access_token_enc: Buffer.from(encryptedAccessToken, "utf8"),
        iv,
        metadata: { raw: tokens, ...userInfo },
        updated_at: sql`now()`,
      };

      if (encryptedRefreshToken) {
        updateData.refresh_token_enc = Buffer.from(
          encryptedRefreshToken,
          "utf8"
        );
      }
      await db
        .update(connections)
        .set(updateData)
        .where(eq(connections.id, existingConnection[0].id));
    } else {
      await db.insert(connections).values({
        id: crypto.randomUUID(),
        user_id: session?.user.id,
        platform: provider,
        account_name: accountName,
        access_token_enc: Buffer.from(encryptedAccessToken, "utf8"),
        refresh_token_enc: encryptedRefreshToken
          ? Buffer.from(encryptedRefreshToken, "utf8")
          : null,
        iv,
        metadata: { raw: tokens, ...userInfo },
      });
    }

    const redirectUrl = returnUrl || `${appUrl}/dashboard`;

    return NextResponse.redirect(
      `${redirectUrl}${
        redirectUrl.includes("?") ? "&" : "?"
      }connected=${provider}`
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function deriveAccountName(provider: string, tokens: any) {
  try {
    const config: any =
      PROVIDERS_CONFIGS[provider as keyof typeof PROVIDERS_CONFIGS];

    if (!config) {
      console.warn(`No configuration found for provider: ${provider}`);
      return { accountName: "ConnectedAccount", userInfo: null };
    }
    if (config.isSpecial && provider === "stripe") {
      return {
        accountName: config.extractAccountName(tokens),
        userInfo: config.extractUserInfo(tokens),
      };
    }

    if (!config.isSpecial) {
      const endpoint = config.useTokenInUrl
        ? `${config.endpoint}?token=${tokens.access_token}`
        : config.endpoint;
      const response = await fetch(endpoint, {
        headers: config.headers(tokens.access_token),
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch iser info from ${provider}`,
          await response.text()
        );
        return { accountName: "Connected Account", userInfo: null };
      }

      const userData = await response.json();

      return {
        accountName: config.extractAccountName(userData),
        userInfo: config.extractUserInfo(userData),
      };
    }
  } catch (error) {
    console.error(`Error deriving account name for ${provider}`);
  }

  return { accountName: "Connected Account", userInfo: null };
}
