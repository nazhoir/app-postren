import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Link from "next/link";

export default function Page() {
  const data = [
    {
      id: "ansdkasdnkaj-nasdakls-klwjlwk",
      type: "Pondok Pesantren",
      name: "Nurul Jadid Sejati",
      shortname: "ppnjs",
      statistc: "13534423234",
      statistcType: "NSPP",
    },
    {
      id: "ansdkasdnkaj-nasdakls-kfwjlwk",
      type: "Madrasah Aliyah",
      name: "Nurul Jadid Sejati",
      shortname: "manjs",
      statistc: "13534423234",
      statistcType: "NSM",
    },
    {
      id: "ansdkasdqkaj-nasdakls-kfwjlwk",
      type: "Madrasah Diniyah Takmiliyah Awaliyah",
      name: "Nurul Jadid Sejati",
      shortname: "mdtanjs",
      statistc: "13534423234",
      statistcType: "NSM",
    },
    {
      id: "ansdkasdqkaj-nasdakls-kfwjllk",
      type: "Madrasah Diniyah Takmiliyah Wustha",
      name: "Nurul Jadid Sejati",
      shortname: "mdtwnjs",
      statistc: "13534423234",
      statistcType: "NSM",
    },
  ];
  return (
    <div className="h-fit overflow-auto">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/gtk/teachers">Guru dan Tendik</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Akun</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex h-[88vh] flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t px-4 py-6 lg:h-[85vh]">
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((institution) => (
            <Card key={institution.id}>
              <CardHeader>
                <CardTitle>
                  {institution.type} {institution.name}
                </CardTitle>
                <CardDescription>
                  {institution.statistcType}: {institution.statistc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
