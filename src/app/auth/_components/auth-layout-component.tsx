"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

import { getSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Playwrite_CA } from "next/font/google";

function AuthLayoutComponent() {
  const [activeTab, setActiveTab] = useState("login");
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session.data !== null) router.push("/dashboard");
    });
  }, [router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="bg-card w-full min-w-[625px] max-w-4xl rounded-lg border p-5 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Left side - Branding & Features */}
          <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-hero relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center gap-2 animate-fade-in">
                <Image src="/logo.svg" alt="" width={48} height={48} />
              </div>
              <div className="space-y-4 -mt[70px]">
                <h2 className="text-3xl font-bold leading-tight">
                  Automate Everting <br />
                  <span className="text-primary">Smarter</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join hundreds of developers building the future of workflow
                  automation with AI superpowers
                </p>
              </div>
            </div>
          </div>
          {/* <h1 className="text-2xl font-bold text-center mb-6">Welcome!</h1> */}
          {/* Right side form */}
          <div className="w-full">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  value="register"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayoutComponent;
