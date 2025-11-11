"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { NavButtonMenu } from "./nav-button-menu";
import { Command, Plus, Search, UsersRound } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { Input } from "../ui/input";
import { useState } from "react";

export function SiteHeader() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) container mx-auto">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="font-bold">
          <span className="text-xl text-yellow-600 md:text-2xl">Flow</span>
          <span className="text-xl md:text-2xl">X</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search workflows..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 bg-[#1E293B] border-[#334155] text-gray-200 placeholde:text-gray-500 focus:border-green-500 focus:ring-green-500/20"
            />
            <div className="absolute right-5 top-1/3 transform -translate-y-1/2 text-gray-400 w-4 h-4">
              <kbd className="px-2 py-1 text-xs text-gray-500 bg-[#334155] rounded">
                <Command className="w-3 h-3 inline mr-1" />
              </kbd>
            </div>
          </div>
          <NavButtonMenu
            icon={Plus}
            label="Workflow Menu"
            choices={[
              // { title: "Search Clients", href: "/admin/clients/search" },
              { title: "New Workflow", href: "/admin/clients/form" },
            ]}
          />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
