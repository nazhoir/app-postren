import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateMember } from "./create-member-dialog";
export default function NavAdd() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          <span className="ml-1">Tambah</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuItem>
          <CreateMember userId={""} />
        </DropdownMenuItem>
        <DropdownMenuItem>Masal</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Tarik dari PPDB</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
