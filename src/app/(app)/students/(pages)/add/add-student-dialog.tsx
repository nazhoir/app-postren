import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddStudentForm from "./add-student-form";

// If you need to add additional props specific to the dialog:
interface AddStudentDialogProps
  extends React.ComponentProps<typeof AddStudentForm> {
  // Add any additional props specific to the dialog here
  dialogTitle?: string;
  dialogDescription?: string;
}

export default function AddStudentDialog({
  dialogTitle = "Tambah Siswa Baru",
  dialogDescription = "Masukkan data siswa baru pada form di bawah ini.",
  ...formProps
}: AddStudentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto mr-4" size="sm">
          <Plus className="h-4 w-4" />
          <span className="ml-1">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <AddStudentForm {...formProps} />
      </DialogContent>
    </Dialog>
  );
}
