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
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateInstitution } from "./create-institution-dialog";
import { auth } from "@/server/auth";
import { getInstitutionsByOrgID } from "@/server/actions/institutions";
import Link from "next/link";

export default async function Page() {
  const session = await auth();

  if (!session) return null;

  const data = await getInstitutionsByOrgID(session.user.id);
  return (
    <div className="h-fit overflow-auto">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Lembaga</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <CreateInstitution userId={session.user.id} />
      </header>
      <main className="flex h-[88vh] flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t px-4 py-6 lg:h-[85vh]">
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((institution) => (
            <Link
              key={institution.id}
              href={`/institutions/detail/${institution.id}`}
            >
              <Card>
                <CardHeader>
                  <CardTitle
                    className="line-clamp-1 uppercase"
                    title={`${institution.type?.toUpperCase()} ${institution.name}`}
                  >
                    {institution.type} {institution.name}
                  </CardTitle>
                  <CardDescription>
                    {institution.statisticType}: {institution.statistic}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
