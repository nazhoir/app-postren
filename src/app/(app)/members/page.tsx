import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateMember } from "./create-member-dialog";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { getOrgsMemberByOrgID } from "@/server/actions/members";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { getOrgsIdByUserId } from "@/server/actions/organizations";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import Link from "next/link";

export default async function Page() {
  const sesssion = await auth();
  if (!sesssion) redirect("/auth/login");
  const orgId = await getOrgsIdByUserId(sesssion.user.id);
  if (!orgId) return null;
  const data = await getOrgsMemberByOrgID(orgId);

  return (
    <div className="h-fit overflow-auto">
      <header className="flex h-16 w-screen shrink-0 items-center gap-2 md:w-full">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Anggota</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="ml-auto mr-4 flex space-x-2">
          <CreateMember userId={sesssion.user.id} />
          <Button size={"sm"} variant={"outline"} asChild>
            <Link href={"/members/create-bulk"}>
              <Plus className="h-4 w-4" />
              <span className="ml-1">Tambah Masal</span>
            </Link>
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className="hidden md:flex"
            disabled
          >
            <RefreshCw className="h-4 w-4" />
            <span className="ml-1">Singkron PPDB</span>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t px-4 pb-6 lg:h-[85vh]">
        <div className="w-screen overflow-x-auto pt-6 lg:w-full">
          <DataTable columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
}
