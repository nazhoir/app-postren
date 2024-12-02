import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { getUserBill } from "@/server/actions/users";
import React from "react";

export async function PaymentProcess({ userId }: { userId: string }) {
  const userBill = await getUserBill(userId);

  if (!userBill) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{userBill.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>Tagihan:</CardDescription>
        {userBill.bills.map((bill, idx) => (
          <div key={bill.id} className="flex space-x-2">
            <div>
              <CardDescription className="font-bold text-card-foreground">
                #{idx + 1}
              </CardDescription>
            </div>
            <div>
              <CardDescription className="font-bold text-card-foreground">
                {bill.item.name}
              </CardDescription>
              <CardDescription className="flex">
                <span className="w-32">Jumlah</span>
                <span>:</span>
                <span className="ml-2">{bill.amountPaid ?? "-"}</span>
              </CardDescription>
              <CardDescription className="flex">
                <span className="w-32">Potongan</span>
                <span>:</span>
                <span className="ml-2">{bill.discount ?? "-"}</span>
              </CardDescription>
              <CardDescription className="flex">
                <span className="w-32">Sisa tagihan </span>
                <span>:</span>
                {/* <span className="ml-2">
                  {formatCurrency(Number(bill.remainingAmount))}
                </span> */}
              </CardDescription>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
