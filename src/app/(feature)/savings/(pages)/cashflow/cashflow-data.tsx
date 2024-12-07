import { RealtimeDistance } from "@/components/realtime-distance";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import React from "react";

interface Data {
  id: string;
  name: string;
  createdBy: string;
  savingId: string;
  type: "credit" | "debit";
  amount: string;
  createdAt: Date;
}
export function CashflowData({ data }: { data?: Data[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Transaksi</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {data?.map(({ id, name, type, amount, createdAt }, idx) => (
          <CardDescription
            key={id}
            className="flex border-b pb-1 last:border-b-0"
          >
            <span className="w-7">#{idx + 1}</span>{" "}
            <Badge
              variant={type === "credit" ? "default" : "outline"}
              className="mr-3 hidden md:block"
            >
              {type}
            </Badge>{" "}
            <RealtimeDistance className="w-24" date={createdAt} />
            <span>{name}</span>{" "}
            <span className="ml-auto">{formatCurrency(Number(amount))}</span>
          </CardDescription>
        ))}
      </CardContent>
    </Card>
  );
}
