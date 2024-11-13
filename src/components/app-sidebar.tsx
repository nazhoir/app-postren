"use client";

import * as React from "react";
import {
  LifeBuoy,
  Send,
  Settings2,
  LayoutDashboard,
  School2,
  Users2,
  GraduationCap,
  BriefcaseBusiness,
  Banknote,
  IdCard,
  Landmark,
  ShieldEllipsis,
  Building2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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
import { Icons } from "./icons";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Kelembagaan",
      url: "/institutions",
      icon: School2,
    },
    {
      title: "Sarana Prasarana",
      url: "/assets",
      icon: Building2,
      items: [
        {
          title: "Aset Tetap",
          url: "/fixed-assets",
        },
        {
          title: "Aset Lancar",
          url: "/current-assets",
        },
        {
          title: "Perpustakaan",
          url: "/library",
        },
        {
          title: "Asrama",
          url: "/hostel",
        },
      ],
    },
  ],

  member: [
    {
      title: "Anggota",
      url: "/users",
      icon: Users2,
    },
    {
      title: "Peserta didik",
      url: "/students",
      icon: GraduationCap,
      items: [
        {
          title: "Tambah",
          url: "/students/add",
        },
        {
          title: "Mutasi",
          url: "/students/mutation",
        },
        {
          title: "Alumni",
          url: "/students/alumni",
        },
        {
          title: "Akun",
          url: "/students/account",
        },
      ],
    },
    {
      title: "Guru dan Tendik",
      url: "/gtk",
      icon: BriefcaseBusiness,
      items: [
        {
          title: "Tambah",
          url: "/gtk/add",
        },
        {
          title: "Mutasi",
          url: "/gtk/mutation",
        },
        {
          title: "Akun",
          url: "/gtk/account",
        },
      ],
    },
  ],
  feature: [
    {
      title: "Keuangan",
      url: "/finance",
      icon: Banknote,
      items: [
        {
          title: "Pembayaran",
          url: "/finance/payment",
        },
        {
          title: "Penagihan",
          url: "/finance/billing",
        },
        {
          title: "Penggajian",
          url: "/finance/payroll",
        },
      ],
    },
    {
      title: "Tabungan",
      url: "/savings",
      icon: Landmark,
    },
    {
      title: "Perizinan",
      url: "/permission",
      icon: ShieldEllipsis,
    },
    {
      title: "Absensi",
      url: "/attendances",
      icon: IdCard,
    },
  ],
  other: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

interface AppSidebar extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    image: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebar) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-700 text-sidebar-primary-foreground">
                <Icons.logo/>
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
        <NavMain items={data.navMain} />
        <NavSecondary label="Keanggotaan" items={data.member} />
        <NavSecondary label="Fitur" items={data.feature} />
        <NavSecondary label="Lainnya" items={data.other} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
