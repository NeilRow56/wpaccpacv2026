// app/dashboard/page.tsx

import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getServerSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth");
  }

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <Suspense fallback={<div>Loading public info…</div>}>
        <pre>{JSON.stringify(session, null, 2)}</pre>;
      </Suspense>
    </div>
  );
}
