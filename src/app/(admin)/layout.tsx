import { auth } from "@/lib/auth";
import Navbar from "./_components/navbar";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function PublicFolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Suspense>
        <DynamicContent />
      </Suspense>
      <main className="">{children}</main>
    </div>
  );
}

async function DynamicContent() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session?.user) {
    return;
  }
  return <Navbar />;
}
