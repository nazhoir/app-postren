"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

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

import { RegistrationUserSavingSchema } from "@/schema/saving";
import { registrationUserSavingAccount } from "@/server/actions/saving";

type FormValues = z.infer<typeof RegistrationUserSavingSchema>;

export function RegistrationUserSavingForm({
  createdBy,
}: {
  createdBy: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<FormValues> = {
    createdBy,
    nik: "",
    balance: undefined,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(RegistrationUserSavingSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    // Hindari multiple submit
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const req = await registrationUserSavingAccount(data);

      if (req.success) {
        toast.success("Akun tabungan berhasil dibuat");
        // Reset form setelah submit berhasil
        form.reset();
      } else {
        // Tampilkan pesan error spesifik jika ada
        toast.error("Gagal membuat akun tabungan");
      }
    } catch (error) {
      // Tangani error yang mungkin terjadi
      console.error("Submission error:", error);
      toast.error("Terjadi kesalahan pada sistem");
    } finally {
      // Pastikan status submitting dikembalikan
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nik"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIK</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  maxLength={16}
                  placeholder="Masukkan NIK"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo Awal</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Masukkan Saldo Awal"
                  // Konversi input ke number
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Data"}
        </Button>
      </form>
    </Form>
  );
}
