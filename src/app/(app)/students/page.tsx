import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/server/auth";
import { getOrgsIdByUserId } from "@/server/actions/organizations";
import { getStudentsByOrgId } from "@/server/actions/students";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default async function Page() {
  const session = await auth();

  if (!session) return null;

  const orgId = await getOrgsIdByUserId(session.user.id);

  if (!orgId) return null;

  const data = await getStudentsByOrgId(orgId);

  if (!data) return null;

  return (
    <div className="h-fit overflow-auto">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Peserta Didik</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button className="ml-auto mr-4" asChild>
          <Link href={"/students/add"}>
            <Plus className="h-4 w-4" />
            <span className="ml-1">Tambah</span>
          </Link>
        </Button>
      </header>
      <main className="flex h-[88vh] flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t px-4 py-6 lg:h-[85vh]">
        <DataTable data={data} columns={columns} />
      </main>
    </div>
  );
}
