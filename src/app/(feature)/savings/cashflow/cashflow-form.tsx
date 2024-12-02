"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { TransactionUserSavingAccountSchema } from "@/schema/saving";
import { transactionUserSavingAccount } from "@/server/actions/saving";
import {
  ThermalPrintButton,
  useThermalPrint,
} from "@/components/print-thermal";
import { printContent, type PrintProps } from "./print";

type FormValues = z.infer<typeof TransactionUserSavingAccountSchema>;

export function SavingCashflowForm({
  createdBy,
  userId,
  type,
  name,
}: {
  createdBy: string;
  userId: string;
  type: "credit" | "debit";
  name: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [lastTransaction, setLastTransaction] = useState<PrintProps | null>(
    null,
  );
  const { printThermal } = useThermalPrint();
  const defaultValues: Partial<FormValues> = {
    createdBy,
    userId,
    amount: "",
    type, // Changed to debit for withdrawal
    name,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(TransactionUserSavingAccountSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    // Prevent multiple submissions
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const req = await transactionUserSavingAccount(data);

      if (req.success) {
        toast.success(`${name} berhasil`);

        // Refresh the page to update the balance
        router.refresh();
        setLastTransaction(req.data as PrintProps);
        printThermal(printContent(req.data as PrintProps));

        // Reset form after successful submission
        form.reset(defaultValues);
      } else {
        // Display specific error message
        toast.error(req.error?.message ?? `Gagal melakukan ${name}`);
      }
    } catch (error) {
      // Handle potential errors
      console.error("Submission error:", error);

      // More detailed error handling
      if (error instanceof Error) {
        toast.error(error.message ?? "Terjadi kesalahan pada sistem");
      } else {
        toast.error("Terjadi kesalahan tidak terduga");
      }
    } finally {
      // Ensure submitting status is reset
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Masukkan Jumlah"
                    // Convert input to number
                    onChange={(e) => {
                      // Parse the input value to ensure it's a valid number
                      const value = e.target.value.trim();
                      field.onChange(value === "" ? "" : value);
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || form.watch("amount") === ""}
          >
            {isSubmitting ? "Memproses..." : name}
          </Button>
        </form>
      </Form>
      {lastTransaction && (
        <ThermalPrintButton data={printContent(lastTransaction)} />
      )}
    </>
  );
}
