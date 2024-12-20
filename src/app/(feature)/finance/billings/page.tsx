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
import { CreateBillItem } from "./create-bill-item-dialog";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { getOrgBillItems } from "@/server/actions/finances";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default async function Page() {
  const sesssion = await auth();
  if (!sesssion) redirect("/auth/login");
  const data = await getOrgBillItems(sesssion.user.id);
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
                  <Link href="/finance">Keuangan</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tagihan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto mr-4 flex space-x-2">
          <CreateBillItem userId={sesssion.user.id} />
        </div>
      </header>
      <main className="flex h-[88vh] flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t px-4 py-6 lg:h-[85vh]">
        <DataTable columns={columns} data={data} />
      </main>
    </div>
  );
}
