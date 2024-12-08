"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { toast } from "sonner";

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

import { createOrgBillItemSchema } from "@/schema/finance";
import { createOrgBillItem } from "@/server/actions/finances";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof createOrgBillItemSchema>;

export function CreateBillItemForm({ userId }: { userId: string }) {
  const router = useRouter();
  const defaultValues: Partial<FormValues> = {
    name: "",
    createdBy: userId,
    amount: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(createOrgBillItemSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    await createOrgBillItem(data);
    toast("Created");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Masukkan nama" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Masukkan harga" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 lg:grid-cols-2"></div>

        <Button type="submit" className="w-full">
          Simpan Data
        </Button>
      </form>
    </Form>
  );
}
