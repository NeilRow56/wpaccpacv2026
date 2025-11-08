"use client";

import { BookOpen, CreditCard, Menu, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useState } from "react";

const navItems = [
  { name: "Features", href: "#features", icon: Zap },
  { name: "Templates", href: "#templates", icon: BookOpen },
  { name: "Pricing", href: "#pricing", icon: CreditCard },
  { name: "Community", href: "#community", icon: Users },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/10">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex  items-center gap-2 animate-fade-in">
              <Image src="/logo.svg" alt="" width={48} height={48} />
            </div>
          </Link>
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8 ">
            {navItems.map((item) => (
              <Link
                className="items-center font-medium gap-2 text-sm text-muted-foreground hover:text-primary transition-colors animate-fade-in"
                style={{ animationDelay: `{index * 0.1}s` }}
                href={item.href}
                key={item.name}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>
          {/* Destop auth buttons */}
          <div className="hidden md:flex items-center gap-3 animate-fade-in">
            <Button
              className="hover:text-white!"
              variant="ghost"
              size="sm"
              //  onClick={() => setIsAuthOpen(true)}
            >
              Sign In
            </Button>
            <Button
              variant="hero"
              size="sm"
              //  onClick={() => setIsAuthOpen(true)}
            >
              Get Started For Free
            </Button>
          </div>
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button className="p-2" variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-background/95 backdrop-blur-xl border-primary/20"
            >
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <div className="flex items-center justify-between px-2">
                <Link href={"/"}>
                  <div className="flex items-center gap-2 animate-fade-in">
                    <Image src="/logo.svg" alt="" width={48} height={48} />
                  </div>
                </Link>
              </div>
              <nav className="space-y-4 mb-8  px-2  ">
                {navItems.map((item) => (
                  <Link
                    className="items-center flex font-medium gap-3 text-sm text-muted-foreground hover:text-primary transition-colors animate-fade-in p-3 rounded-lg hover:bg-secondary/50"
                    style={{ animationDelay: `{index * 0.1}s` }}
                    href={item.href}
                    key={item.name}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
