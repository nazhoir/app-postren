import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SavingCashflowForm } from "./cashflow-form";

type SavingCashflowDialogProps = React.ComponentProps<
  typeof SavingCashflowForm
> & {
  children?: React.ReactNode;
};
export default function SavingCashflowDialog(props: SavingCashflowDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.name}</DialogTitle>
        </DialogHeader>

        <SavingCashflowForm {...props} />
      </DialogContent>
    </Dialog>
  );
}
