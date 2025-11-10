import { auth } from "./auth";
import { headers } from "next/headers";

export async function getServerSession() {
  const hdrs = await headers();
  const session = await auth.api.getSession({
    headers: hdrs,
  });
  return session;
}
