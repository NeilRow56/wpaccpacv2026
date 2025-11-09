import { Book, FileText, MessageCircle, Shield, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

export function Footer() {
  return (
    <footer className="py-16 px-6 bg-linear-to-t from secondary/30 to-background border-t border-primary/10">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/">
                <div className="flex  items-center gap-2 animate-fade-in">
                  <Image src="/logo.svg" alt="" width={48} height={48} />
                </div>
              </Link>
            </div>
            <p className="text-muted-foreground mt-[50px] text-sm mb-6 leading relaxed">
              The next-generation workflow automation platform with AI
              superpowers. Build, deploy and scale your automations efforlessly.
            </p>
          </div>
          {/* Resources */}
          <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <h4 className="font-semibold">Resources</h4>
            <div className="space-y-3 flex flex-col">
              <a
                href="#"
                className="inline-flex gap-2 items-center  text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Book className="w-3 h-3" />
                Features
              </a>
              <a
                href="#"
                className="inline-flex text-sm text-muted-foreground hover:text-primary items-center gap-2 transition-colors"
              >
                <Book className="w-3 h-3" />
                Documentation
              </a>
              <a
                href="#"
                className="inline-flex gap-2 items-center  text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText className="w-3 h-3" />
                Blog
              </a>
              <a
                href="#"
                className="inline-flex gap-2 items-center  text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                Discord Community
              </a>
              <a
                href="#"
                className="inline-flex gap-2 items-center  text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Book className="w-3 h-3" />
                Features
              </a>
            </div>
          </div>
          {/* Product */}
          <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <h4 className="font-semibold">Product</h4>
            <div className="space-y-3">
              <a
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Integrations
              </a>
              <a
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Templates
              </a>
              <a
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                API Reference
              </a>
            </div>
          </div>
          {/* Legals */}
          <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <h4 className="font-semibold">Legal</h4>
            <div className="space-y-3 flex flex-col">
              <a
                href="#"
                className="inline-flex gap-2 items-center  text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Shield className="w-3 h-3" />
                Privacy Policy
              </a>
              <a
                href="#"
                className="inline-flex text-sm text-muted-foreground hover:text-primary items-center gap-2 transition-colors"
              >
                <UserCheck className="w-3 h-3" />
                Terms of Service
              </a>
              <a
                href="#"
                className="inline-flex gap-2 items-center  text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Security
              </a>
              <a
                href="#"
                className="inline-flex gap-2 items-center  text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                GDPR
              </a>
            </div>
          </div>
          {/* Bottom Bar */}
        </div>
        <div className="pt-8 border-t border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              &copy;{" "}
              <Suspense>
                <DynamicFooterDate />
              </Suspense>{" "}
              FlowX. All rights reserved
            </div>
            <div className="flex flex-col items-center gap-6 text-sm text-muted-foreground">
              <span>Made with ❤️ for developers</span>
              <div className="flex  items-center gap-2 ">
                <div className=" w-2 h-2 bg-primary rounded-full ainimate-glow-pulse"></div>
                <span>SystemStaus: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

async function DynamicFooterDate() {
  await connection();
  const currentYear = new Date().getFullYear();

  return currentYear;
}
