"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const chartData = [
  { date: "2024-04-01", credit: 222, debit: 150 },
  { date: "2024-04-02", credit: 97, debit: 180 },
  { date: "2024-04-03", credit: 167, debit: 120 },
  { date: "2024-04-04", credit: 242, debit: 260 },
  { date: "2024-04-05", credit: 373, debit: 290 },
  { date: "2024-04-06", credit: 301, debit: 340 },
  { date: "2024-04-07", credit: 245, debit: 180 },
  { date: "2024-04-08", credit: 409, debit: 320 },
  { date: "2024-04-09", credit: 59, debit: 110 },
  { date: "2024-04-10", credit: 261, debit: 190 },
  { date: "2024-04-11", credit: 327, debit: 350 },
  { date: "2024-04-12", credit: 292, debit: 210 },
  { date: "2024-04-13", credit: 342, debit: 380 },
  { date: "2024-04-14", credit: 137, debit: 220 },
  { date: "2024-04-15", credit: 120, debit: 170 },
  { date: "2024-04-16", credit: 138, debit: 190 },
  { date: "2024-04-17", credit: 446, debit: 360 },
  { date: "2024-04-18", credit: 364, debit: 410 },
  { date: "2024-04-19", credit: 243, debit: 180 },
  { date: "2024-04-20", credit: 89, debit: 150 },
  { date: "2024-04-21", credit: 137, debit: 200 },
  { date: "2024-04-22", credit: 224, debit: 170 },
  { date: "2024-04-23", credit: 138, debit: 230 },
  { date: "2024-04-24", credit: 387, debit: 290 },
  { date: "2024-04-25", credit: 215, debit: 250 },
  { date: "2024-04-26", credit: 75, debit: 130 },
  { date: "2024-04-27", credit: 383, debit: 420 },
  { date: "2024-04-28", credit: 122, debit: 180 },
  { date: "2024-04-29", credit: 315, debit: 240 },
  { date: "2024-04-30", credit: 454, debit: 380 },
  { date: "2024-05-01", credit: 165, debit: 220 },
  { date: "2024-05-02", credit: 293, debit: 310 },
  { date: "2024-05-03", credit: 247, debit: 190 },
  { date: "2024-05-04", credit: 385, debit: 420 },
  { date: "2024-05-05", credit: 481, debit: 390 },
  { date: "2024-05-06", credit: 498, debit: 520 },
  { date: "2024-05-07", credit: 388, debit: 300 },
  { date: "2024-05-08", credit: 149, debit: 210 },
  { date: "2024-05-09", credit: 227, debit: 180 },
  { date: "2024-05-10", credit: 293, debit: 330 },
  { date: "2024-05-11", credit: 335, debit: 270 },
  { date: "2024-05-12", credit: 197, debit: 240 },
  { date: "2024-05-13", credit: 197, debit: 160 },
  { date: "2024-05-14", credit: 448, debit: 490 },
  { date: "2024-05-15", credit: 473, debit: 380 },
  { date: "2024-05-16", credit: 338, debit: 400 },
  { date: "2024-05-17", credit: 499, debit: 420 },
  { date: "2024-05-18", credit: 315, debit: 350 },
  { date: "2024-05-19", credit: 235, debit: 180 },
  { date: "2024-05-20", credit: 177, debit: 230 },
  { date: "2024-05-21", credit: 82, debit: 140 },
  { date: "2024-05-22", credit: 81, debit: 120 },
  { date: "2024-05-23", credit: 252, debit: 290 },
  { date: "2024-05-24", credit: 294, debit: 220 },
  { date: "2024-05-25", credit: 201, debit: 250 },
  { date: "2024-05-26", credit: 213, debit: 170 },
  { date: "2024-05-27", credit: 420, debit: 460 },
  { date: "2024-05-28", credit: 233, debit: 190 },
  { date: "2024-05-29", credit: 78, debit: 130 },
  { date: "2024-05-30", credit: 340, debit: 280 },
  { date: "2024-05-31", credit: 178, debit: 230 },
  { date: "2024-06-01", credit: 178, debit: 200 },
  { date: "2024-06-02", credit: 470, debit: 410 },
  { date: "2024-06-03", credit: 103, debit: 160 },
  { date: "2024-06-04", credit: 439, debit: 380 },
  { date: "2024-06-05", credit: 88, debit: 140 },
  { date: "2024-06-06", credit: 294, debit: 250 },
  { date: "2024-06-07", credit: 323, debit: 370 },
  { date: "2024-06-08", credit: 385, debit: 320 },
  { date: "2024-06-09", credit: 438, debit: 480 },
  { date: "2024-06-10", credit: 155, debit: 200 },
  { date: "2024-06-11", credit: 92, debit: 150 },
  { date: "2024-06-12", credit: 492, debit: 420 },
  { date: "2024-06-13", credit: 81, debit: 130 },
  { date: "2024-06-14", credit: 426, debit: 380 },
  { date: "2024-06-15", credit: 307, debit: 350 },
  { date: "2024-06-16", credit: 371, debit: 310 },
  { date: "2024-06-17", credit: 475, debit: 520 },
  { date: "2024-06-18", credit: 107, debit: 170 },
  { date: "2024-06-19", credit: 341, debit: 290 },
  { date: "2024-06-20", credit: 408, debit: 450 },
  { date: "2024-06-21", credit: 169, debit: 210 },
  { date: "2024-06-22", credit: 317, debit: 270 },
  { date: "2024-06-23", credit: 480, debit: 530 },
  { date: "2024-06-24", credit: 132, debit: 180 },
  { date: "2024-06-25", credit: 141, debit: 190 },
  { date: "2024-06-26", credit: 434, debit: 380 },
  { date: "2024-06-27", credit: 448, debit: 490 },
  { date: "2024-06-28", credit: 149, debit: 200 },
  { date: "2024-06-29", credit: 103, debit: 160 },
  { date: "2024-06-30", credit: 446, debit: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  credit: {
    label: "Credit",
    color: "hsl(var(--chart-1))",
  },
  debit: {
    label: "Debit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function MonthlyReport() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Laporan Arus Kas</CardTitle>
          <CardDescription>
            Menampilkan laporan 3 bulan terakhir
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillIn" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-credit)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-credit)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOut" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-debit)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-debit)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                const date = new Date(value);
                return date.toLocaleDateString("id", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    return new Date(value).toLocaleDateString("id", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="debit"
              type="natural"
              fill="url(#fillOut)"
              stroke="var(--color-debit)"
              stackId="a"
            />
            <Area
              dataKey="credit"
              type="natural"
              fill="url(#fillIn)"
              stroke="var(--color-credit)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
