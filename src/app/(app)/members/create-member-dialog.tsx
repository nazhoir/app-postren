import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateMemberForm } from "./create-member-form";

export function CreateMember({ userId }: { userId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"}>
          <Plus className="h-4 w-4" />
          <span className="ml-1">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Anggota</DialogTitle>
        </DialogHeader>
        <CreateMemberForm userId={userId} />
      </DialogContent>
    </Dialog>
  );
}
