import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowLeftIcon, Key, Trash2, User } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProfileUpdateForm } from "./_components/profile-update-form";

import { ChangePasswordForm } from "./_components/change-password-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SessionManagement } from "./_components/session-management";
import { AccountDeletion } from "./_components/account-deletion";
import { getServerSession } from "@/lib/session";
import { LoadingSuspense } from "@/components/shared/loading-suspense";

export default async function ProfilePage() {
  return (
    <div className="mx-auto my-6 max-w-md px-4">
      <Suspense>
        <ProfileComponent />
      </Suspense>
    </div>
  );
}

async function ProfileComponent() {
  const session = await getServerSession();
  if (session == null) return redirect("/auth");

  return (
    <div className="mx-auto my-12 w-[350px] px-4 md:w-[500px]">
      <div className="mb-16">
        <Link href="/" className="mt-12 mb-6 inline-flex items-center">
          <ArrowLeftIcon suppressHydrationWarning className="mr-2 size-4" />
          Back to Home
        </Link>
        <div className="mt-12 flex items-center space-x-4">
          <div className="bg-muted flex size-16 items-center justify-center overflow-hidden rounded-full">
            {session.user.image ? (
              <Image
                width={64}
                height={64}
                src={session.user.image}
                alt="User Avatar"
                className="object-cover"
              />
            ) : (
              <User className="text-muted-foreground size-8" />
            )}
          </div>
          <div className="flex-1 items-center">
            <div className="flex items-center justify-between gap-1">
              <h1 className="text-3xl font-bold">
                {session.user.name || "User Profile"}
              </h1>

              <Badge className="bg-teal-600">{session.user.role}</Badge>
            </div>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>
      {/*  */}
      <Tabs className="space-y-2" defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="px-2">
            <User />
            <span className="max-sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="px-2">
            <User />
            <span className="max-sm:hidden">Security</span>
          </TabsTrigger>

          <TabsTrigger value="sessions" className="px-2">
            <Key />
            <span className="max-sm:hidden">Sessions</span>
          </TabsTrigger>

          <TabsTrigger value="danger" className="px-2">
            <Trash2 />
            <span className="max-sm:hidden">Danger</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileUpdateForm user={session.user} />
        </TabsContent>

        <TabsContent value="security">
          <LoadingSuspense>
            <SecurityTab />
          </LoadingSuspense>
        </TabsContent>
        <TabsContent value="sessions">
          <LoadingSuspense>
            <SessionsTab currentSessionToken={session.session.token} />
          </LoadingSuspense>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-destructive border">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              No accounts can be deleted other by WpAccPac. Users not able to
              access the system will have a "Ban" imposed to prevent using the
              application. The ban can be removed by WpAccPac if circumstances
              change.
              {session.user.email === "admin@wpaccpac.org" && (
                <AccountDeletion />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function SecurityTab() {
  return <ChangePasswordForm />;
}

async function SessionsTab({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) {
  const sessions = await auth.api.listSessions({ headers: await headers() });

  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  );
}
