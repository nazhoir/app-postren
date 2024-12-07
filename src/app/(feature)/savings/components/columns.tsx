"use client";

import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { formatCurrency } from "@/lib/format-currency";
import { RealtimeDistance } from "@/components/realtime-distance";
import { Badge } from "@/components/ui/badge";

// Type guard to check if a value is a string
const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

// Type-safe filter function for string arrays
const safeArrayFilter = (
  row: Row<Task>,
  id: string,
  value: string[],
): boolean => {
  const cellValue = row.getValue(id);
  if (!isString(cellValue)) return false;
  return value.includes(cellValue);
};

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Waktu" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <RealtimeDistance
            className="max-w-[500px] truncate font-medium"
            date={row.getValue("createdAt")}
          />
        </div>
      );
    },
    filterFn: (row: Row<Task>, id, value: unknown) => {
      if (!Array.isArray(value) || !value.every(isString)) return false;
      return safeArrayFilter(row, id, value);
    },
  },

  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pengguna" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("user")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-36 truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
    filterFn: (row: Row<Task>, id, value: unknown) => {
      if (!Array.isArray(value) || !value.every(isString)) return false;
      return safeArrayFilter(row, id, value);
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge className="capitalize">{row.getValue("type")}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pembayaran" />
    ),
    cell: ({ row }) => {
      const paymentMethod = row.getValue("paymentMethod");

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {paymentMethod === "cash"
              ? "Tunai"
              : paymentMethod === "bank_transfer"
                ? "Bank"
                : "Not set"}
          </span>
        </div>
      );
    },
    filterFn: (row: Row<Task>, id, value: unknown) => {
      if (!Array.isArray(value) || !value.every(isString)) return false;
      return safeArrayFilter(row, id, value);
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatCurrency(row.getValue("amount"))}
          </span>
        </div>
      );
    },
    filterFn: (row: Row<Task>, id, value: unknown) => {
      if (!Array.isArray(value) || !value.every(isString)) return false;
      return safeArrayFilter(row, id, value);
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
