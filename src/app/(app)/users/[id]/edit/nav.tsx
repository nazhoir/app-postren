"use client";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

export default function NavEdit({ userId }: { userId: string }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const navItems = [
    {
      name: "Data Pribadi",
      href: "/edit",
    },
    {
      name: "Data Keluarga",
      href: "/edit/family",
    },
    {
      name: "Riwayat Pendidikan",
      href: "/edit/education",
    },
  ];
  return isMobile ? (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
       <Ellipsis/>
       <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[90vw]">
        {navItems.map(({ name, href }, idx) => {
          const link = `/users/${userId}${href}`;

          return (
            <DropdownMenuItem key={idx} asChild>
              <Link href={link}>{name}</Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex">
      {navItems.map(({ name, href }, idx) => {
        const link = `/users/${userId}${href}`;

        return (
          <Button
            key={idx}
            variant={pathname === link ? "default" : "outline"}
            size={"sm"}
            className="mr-2 shadow-none"
            asChild
          >
            <Link href={link}>{name}</Link>
          </Button>
        );
      })}
    </div>
  );
}
