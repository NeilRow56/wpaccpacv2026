import { db } from "@/db";
import { connections } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(connections)
    .where(eq(connections.user_id, session?.user.id));

  // Don't expose raw tokens to client

  const safe = rows.map(
    ({ access_token_enc, refresh_token_enc, ...rest }) => rest
  );
  return NextResponse.json({ connections: safe });
}
