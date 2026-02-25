"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  SparklesIcon,
} from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useHasActiveSubscription } from "@/hooks/subscriptions/use-subscription";

const menuItems = [
  {
    title: "Main",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-16 px-4 gap-x-2.5"
              asChild
            >
              <Link
                href="/"
                prefetch
                className="flex items-center justify-center"
              >
                <Image
                  src="/logos/logo.svg"
                  alt="Nexus"
                  width={48}
                  height={48}
                  className="shrink-0 transition-all duration-200 group-data-[collapsible=icon]:size-6! group-data-[collapsible=icon]:transition-none group-data-[collapsible=icon]:duration-0 group-data-[collapsible=icon]:ease-in-out group-data-[collapsible=icon]:pl-2"
                />
                <span className="text-xl pt-2 font-bold tracking-tight leading-none">
                  Nexus
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }
                      className="w-full h-9 px-3 gap-x-3 text-[13px] font-medium"
                      asChild
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className="size-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className="h-9 px-3 gap-x-3 text-[13px] font-medium bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary transition-colors duration-200"
                onClick={() => authClient.checkout({ slug: "pro" })}
              >
                <SparklesIcon className="size-4 shrink-0" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Billing Portal"
              className="h-9 px-3 gap-x-3 text-[13px] font-medium"
              onClick={() => authClient.customer.portal({})}
            >
              <CreditCardIcon className="size-4 shrink-0" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              className="h-9 px-3 gap-x-3 text-[13px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/auth/signin");
                    },
                  },
                })
              }
            >
              <LogOutIcon className="size-4 shrink-0" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
