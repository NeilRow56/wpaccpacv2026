import { providers } from "@/lib/oauth/providers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  const providerKey = provider as keyof typeof providers;

  const cfg = providers[providerKey];
  if (!cfg)
    return NextResponse.json({ error: "Unknown Provider" }, { status: 404 });

  const url = new URL(req.url);

  const returnUrl = url.searchParams.get("returnUrl");

  const stateData = {
    id: crypto.randomUUID(),
    returnUrl: returnUrl || null,
  };

  const state = btoa(JSON.stringify(stateData));

  const authUrl = new URL(cfg.authorize_url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  authUrl.searchParams.set("client_id", cfg.key);
  authUrl.searchParams.set("redirect_uri", appUrl + cfg.callback);
  authUrl.searchParams.set("response_type", "code");

  if ("scope" in cfg && cfg.scope) {
    const scopeString = Array.isArray(cfg.scope)
      ? cfg.scope.join(" ")
      : (cfg.scope as unknown as string);
    authUrl.searchParams.set("scope", scopeString);
  }

  if (provider === "gmail" || provider === "sheets") {
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("include_granted_scopes", "true");
  }

  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl.toString());
}
