"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavEdit({ userId }: { userId: string }) {
  const pathname = usePathname();

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
  return (
    <div className="mb-4 flex space-x-2 border-b p-4">
      {navItems.map(({ name, href }, idx) => {
        const link = `/users/${userId}${href}`;

        return (
          <Button
            key={idx}
            variant={pathname === link ? "default" : "outline"}
            size={"sm"}
            asChild
          >
            <Link href={link}>{name}</Link>
          </Button>
        );
      })}
    </div>
  );
}
