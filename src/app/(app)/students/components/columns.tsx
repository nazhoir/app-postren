"use client";

import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="min-w-44 max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kelamin" />
    ),
    cell: ({ row }) => {
      const gender = row.getValue("gender");

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {gender === "L"
              ? "Laki-laki"
              : gender === "P"
                ? "Perempuan"
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
    accessorKey: "nisn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NISN" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("nisn")}
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
    accessorKey: "nik",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIK" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("nik")}
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
    accessorKey: "nkk",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NKK" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("nkk")}
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
    accessorKey: "birthPlace",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tempat lahir" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("birthPlace")}
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
    accessorKey: "birthDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal lahir" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("birthDate")}
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
