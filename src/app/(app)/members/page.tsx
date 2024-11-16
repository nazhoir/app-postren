import { Card, CardDescription, CardHeader } from "@/components/ui/card";
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
import { Plus, RefreshCw, Search } from "lucide-react";
import { getOrgsIdByUserId } from "@/server/actions/organizations";
import { Input } from "@/components/ui/input";
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
          <div className="hidden space-x-1 md:flex">
            <Input className="h-8 w-96" placeholder="Nama atau NIK/NKK" />
            <Button size={"sm"} variant={"outline"}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
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
        {/* <div className="sticky top-0 bg-card px-4 pb-2 pt-6">
          <Card className="border-none bg-primary shadow-none">
            <CardHeader className="flex-row items-center space-x-4 space-y-0 py-4">
              <CardDescription className="w-2 shrink-0 font-bold leading-none text-primary-foreground">
                #
              </CardDescription>
              <CardDescription className="w-40 shrink-0 font-bold leading-none text-primary-foreground">
                Nama
              </CardDescription>
              <CardDescription className="w-20 shrink-0 font-bold leading-none text-primary-foreground">
                Kelamin
              </CardDescription>
              <CardDescription className="w-36 shrink-0 font-bold leading-none text-primary-foreground">
                NIK
              </CardDescription>
              <CardDescription className="w-36 shrink-0 font-bold leading-none text-primary-foreground">
                NKK
              </CardDescription>
              <CardDescription className="w-20 shrink-0 font-bold leading-none text-primary-foreground">
                Tempat Lahir
              </CardDescription>
              <CardDescription className="w-20 shrink-0 font-bold leading-none text-primary-foreground">
                Tanggal Lahir
              </CardDescription>
              <CardDescription className="w-20 shrink-0 font-bold leading-none text-primary-foreground">
                Status
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-2 px-4">
          {data.map(({ users }, idx) => (
            <Card key={idx} className="shadow-none dark:bg-sidebar">
              <CardHeader className="flex-row items-center space-x-4 space-y-0 px-4 py-2">
                <CardDescription className="w-2 shrink-0 font-bold text-card-foreground">
                  {idx + 1}.
                </CardDescription>
                <CardDescription className="w-40 shrink-0 font-bold leading-none text-card-foreground">
                  {users.name}
                </CardDescription>
                <CardDescription className="w-20 shrink-0">
                  {users.gender != null
                    ? users.gender == "L"
                      ? "Laki-laki"
                      : "Perempuan"
                    : "Not Set"}
                </CardDescription>
                <CardDescription className="w-36 shrink-0">
                  {users.nik}
                </CardDescription>
                <CardDescription className="w-36 shrink-0">
                  {users.nkk}
                </CardDescription>
                <CardDescription className="w-20 shrink-0">
                  {users.birthPlace}
                </CardDescription>
                <CardDescription className="w-20 shrink-0">
                  {users.birthDate}
                </CardDescription>
                <CardDescription className="flex w-32 shrink-0 items-center rounded-md bg-green-200 p-2 dark:bg-green-900">
                  <Check className="h-4 w-4 stroke-green-600" />
                  <span className="ml-2 text-xs text-card-foreground">
                    {" "}
                    Aktif
                  </span>
                </CardDescription>
                <MoreAction />
              </CardHeader>
            </Card>
          ))}
        </div> */}
        <div className="w-screen overflow-x-auto pt-6 lg:w-full">
          <DataTable columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
}
