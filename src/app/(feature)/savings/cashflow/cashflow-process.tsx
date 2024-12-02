import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { getUserSavingAccountInfo } from "@/server/actions/saving";
import React from "react";
import { Separator } from "@/components/ui/separator";
import SavingCashflowDialog from "./cashflow-dialog";
import { Button } from "@/components/ui/button";
import { Banknote, ChevronLeft, Plus } from "lucide-react";
import { CashflowData } from "./cashflow-data";
import Link from "next/link";

export async function CashflowProcess(props: {
  userId: string;
  createdBy: string;
}) {
  // const userBill = await getUserBill(userId);

  const user = await getUserSavingAccountInfo(props.userId);

  if (!user) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{user.user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-2xl text-card-foreground">
            Saldo: {formatCurrency(Number(user.balance))}
          </CardDescription>

          <CardDescription>
            Maksimal pengeluaran per-hari:{" "}
            {formatCurrency(Number(user.maxCreditPerDay))}
          </CardDescription>

          <Separator className="my-2" />
          <CardDescription>
            Pengeluaran hari ini:{" "}
            {formatCurrency(Number(user.todayCashflow.today.credit))}
          </CardDescription>
          <CardDescription>
            Pemasukan hari ini:{" "}
            {formatCurrency(Number(user.todayCashflow.today.debit))}
          </CardDescription>
        </CardContent>

        <CardFooter className="grid grid-cols-2 gap-2 md:flex">
          <SavingCashflowDialog {...props} type="debit" name="Isi ulang">
            <Button>
              <Plus />
              <span>Isi Ulang</span>
            </Button>
          </SavingCashflowDialog>

          <SavingCashflowDialog {...props} type="credit" name="Tarik Tunai">
            <Button className="ml-2">
              <Banknote />
              <span>Tarik Tunai</span>
            </Button>
          </SavingCashflowDialog>

          <Button
            className="col-span-2 lg:ml-auto"
            variant={"destructive"}
            asChild
          >
            <Link href={"/savings/cashflow"}>
              <ChevronLeft />
              <span>Kembali</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <CashflowData data={user.cashflow} />
    </>
  );
}
