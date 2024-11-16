"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}
// types/index.ts
interface ViewOption {
  id: string;
  title: string;
}
const viewOptions: ViewOption[] = [
  {
    id: "name",
    title: "Nama",
  },
  {
    id: "gender",
    title: "Kelamin",
  },
  {
    id: "nik",
    title: "NIK",
  },
  {
    id: "nkk",
    title: "NKK",
  },

  {
    id: "birthPlace",
    title: "Tempat lahir",
  },
  {
    id: "birthDate",
    title: "Tanggal lahir",
  },
];

export const getViewOptionById = (id: string): ViewOption | undefined => {
  return viewOptions.find((option) => option.id === id);
};

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {getViewOptionById(column.id)?.title}
                {/* {column.id} */}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
