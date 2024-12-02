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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getBillItemDetail } from "@/server/actions/finances";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/format-currency";
import SearchUser from "./search-user-bill";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const req = await getBillItemDetail(id);

  if (!req.data) notFound();

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
                <BreadcrumbLink asChild>
                  <Link href="/finance/billings">Tagihan</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem className="line-clamp-1 max-w-52">
                <BreadcrumbPage>{req.data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button className="ml-auto mr-4" asChild size={"sm"}>
          <Link href={"/finance/add"}>
            <Plus className="h-4 w-4" />
            <span className="ml-1">Penerima</span>
          </Link>
        </Button>
      </header>
      <main className="flex h-[88vh] flex-1 flex-col gap-4 overflow-auto rounded-b-lg border-t px-4 py-6 lg:h-[85vh]">
        <h2>{req.data.name}</h2>
        <p>{formatCurrency(Number(req.data.amount))}</p>

        <div>
          <SearchUser billId={id} />
        </div>
        <div>
          {/* {req.data.users.map((user, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription className="flex">
                  <span className="w-32">Tanggungan</span>
                  <span className="mr-2">:</span>
                  <span>
                    {formatCurrency(
                      Number(req.data.amount) * user.duplicateCount!,
                    )}{" "}
                    ({formatCurrency(Number(req.data.amount))} x{" "}
                    {user.duplicateCount})
                  </span>
                </CardDescription>
                <CardDescription className="flex">
                  <span className="w-32">Total Potongan</span>
                  <span className="mr-2">:</span>
                  <span>{formatCurrency(Number(user.discount))}</span>
                </CardDescription>
                <CardDescription className="flex">
                  <span className="w-32">Total Tanggungan</span>
                  <span className="mr-2">:</span>
                  <span>
                    {" "}
                    {formatCurrency(
                      Number(req.data.amount) * user.duplicateCount! -
                        Number(user.discount),
                    )}
                  </span>
                </CardDescription>
                <CardDescription className="flex">
                  <span className="w-32">Sisa Tanggungan</span>
                  <span className="mr-2">:</span>
                  <span>{formatCurrency(Number(user.remainingAmount))}</span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))} */}
        </div>
      </main>
    </div>
  );
}
