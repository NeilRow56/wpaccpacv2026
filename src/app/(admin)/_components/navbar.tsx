import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth");
  }

  const user = session?.user;

  return (
    <div className="space-y-6 text-center">
      {user == null ? (
        <>
          <h1 className="text-3xl font-bold">Welcome to Our App</h1>
          <Button asChild size="lg">
            <Link href="/auth">Sign In / Sign Up</Link>
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold">Welcome {user?.name}!</h1>
          <div className="flex justify-center gap-4">
            <Button asChild size="default">
              <Link href="/profile">Profile</Link>
            </Button>

            <SignOutButton />
          </div>
        </>
      )}
    </div>
  );
}
