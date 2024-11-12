"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function LayoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useSelectedLayoutSegment();

  const links = [
    {
      title: "Guru",
      value: "teachers",
    },
    {
      title: "Tenaga Kependidikan",
      value: "staff",
    },
  ];
  return (
    <div className="h-fit overflow-auto">
      <div className="h-fit overflow-auto">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Guru dan Tenaga Kependidikan</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex h-[88vh] flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t px-4 py-6 lg:h-[85vh]">
          <Tabs value={params!} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              {links.map(({ value, title }) => (
                <TabsTrigger key={value} value={value} asChild>
                  <Link href={`/gtk/${value}`}>{title}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {children}
        </main>
      </div>
    </div>
  );
}
