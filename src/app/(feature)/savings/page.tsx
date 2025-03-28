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
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { getOrgsIdByUserId } from "@/server/actions/organizations";
import { getOrgSavingCashflowReport } from "@/server/actions/saving";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default async function Page() {
  const session = await auth();

  if (!session) redirect("/auth/login");

  const orgID = await getOrgsIdByUserId(session.user.id);

  if (!orgID) return <div>Organisasi Tidak Ditemukan</div>;

  const data = await getOrgSavingCashflowReport(orgID);

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
                  <Link href="/savings">Tabungan</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Registrasi</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex h-[88vh] flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t px-4 py-6 lg:h-[85vh]">
        {!data || data.length === 0 ? (
          <div className="text-center font-semibold text-muted-foreground">
            Data Belum Tersedia
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={data.map((dt) => ({
                id: dt.id,
                name: dt.name,
                type: dt.type,
                amount: Number(dt.amount),
                createdAt: dt.createdAt,
                paymentMethod: dt.paymentMethod,
                user: dt.user.name,
              }))}
            />
          </>
        )}
      </main>
    </div>
  );
}
