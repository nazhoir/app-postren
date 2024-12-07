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

const navItems = [
  {
    items: [
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
  },

  {
    title: "Keanggotaan",
    items: [
      {
        title: "Anggota",
        url: "/members",
        icon: Users2,
        items: [
          {
            title: "Kartu ID",
            url: "/members/card",
          },
          {
            title: "Akun",
            url: "/members/account",
          },
        ],
      },
      {
        title: "Peserta didik",
        url: "/students",
        icon: GraduationCap,
        items: [
          
          {
            title: "Mutasi",
            url: "/students/mutation",
          },
          {
            title: "Alumni",
            url: "/students/alumni",
          },
        ],
      },
      {
        title: "Pegawai",
        url: "/employees",
        icon: BriefcaseBusiness,
        items: [
          
          {
            title: "Mutasi",
            url: "/gtk/mutation",
          },
        ],
      },
    ],
  },
  {
    title: "Fitur",
    items: [
      {
        title: "Keuangan",
        url: "/finance",
        icon: Banknote,
        items: [
          {
            title: "Pengaturan",
            url: "/finance/settings",
          },
          {
            title: "Arus Kas",
            url: "/finance/payment",
          },
          {
            title: "Tagihan",
            url: "/finance/billings",
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
  },
  {
    title: "Lainnya",
    items: [
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
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    image: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
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
