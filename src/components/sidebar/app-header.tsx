"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getPageTitle } from "@/utils/utils";

export const AppHeader = () => {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="flex items-center gap-3 px-4 border-b border-border/50 h-18 shrink-0 bg-background/80 backdrop-blur-sm">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="text-sm font-medium tracking-tight text-foreground">
        {pageTitle}
      </h1>
    </header>
  );
};
