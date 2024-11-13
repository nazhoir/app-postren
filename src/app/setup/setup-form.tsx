"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { setupAction } from "./setup-action";

const studentFormSchema = z.object({
  nameOrganization: z.string().min(2, {
    message: "Nama harus diisi minimal 2 karakter.",
  }),
  nameAdmin: z.string().min(2, {
    message: "Nama harus diisi minimal 2 karakter.",
  }),
  email: z.string().email(),
  password: z.string().min(12, {
    message: "Password minimal terdiri dari 12 karakter",
  }),
});

type FormValues = z.infer<typeof studentFormSchema>;

const defaultValues: Partial<FormValues> = {
  nameOrganization: "",
  nameAdmin: "",
  email: "",
  password: "",
};

export function SetupForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    await setupAction(data);

    toast("Created");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nameOrganization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Organisasi</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama Organisasi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nameAdmin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Admin</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama admin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="n@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="*******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Simpan Data
        </Button>
      </form>
    </Form>
  );
}
