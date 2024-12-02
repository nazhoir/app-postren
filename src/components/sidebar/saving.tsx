"use client";

import * as React from "react";
import {
  ArrowRightLeft,
  type LucideIcon,
  ChartSpline,
  User2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Icons } from "../icons";

interface Item {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
}

type NavItem = {
  title?: string;
  items: Item[];
};

const navItems: NavItem[] = [
  {
    items: [
      {
        title: "Ringkasan",
        url: "/savings",
        icon: ChartSpline,
      },
      {
        title: "Transaksi",
        url: "/savings/cashflow",
        icon: ArrowRightLeft,
      },
      {
        title: "Registrasi Pengguna",
        url: "/savings/users",
        icon: User2,
      },
    ],
  },
];

interface SavingSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    image: string;
  };
}

export function SavingSidebar({ user, ...props }: SavingSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-700 text-sidebar-primary-foreground">
                  <Icons.logo />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Postren</span>
                  <span className="truncate text-xs">Edisi Gratis</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navItems.map((nav, idx) => (
          <NavMain key={idx} label={nav.title} items={nav.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
