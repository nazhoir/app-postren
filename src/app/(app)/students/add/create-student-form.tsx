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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const studentFormSchema = z.object({
  nama: z.string().min(2, {
    message: "Nama harus diisi minimal 2 karakter.",
  }),
  nik: z.string().length(16, {
    message: "NIK harus 16 digit.",
  }),
  nisn: z.string().length(10, {
    message: "NISN harus 10 digit.",
  }),
  tempatLahir: z.string().min(1, {
    message: "Tempat lahir harus diisi.",
  }),
  tanggalLahir: z.string().min(1, {
    message: "Tanggal lahir harus diisi.",
  }),
  jenisKelamin: z.enum(["L", "P"], {
    required_error: "Jenis kelamin harus dipilih.",
  }),
  alamat: z.string().min(10, {
    message: "Alamat harus diisi minimal 10 karakter.",
  }),
  tanggalDiterima: z.string().min(1, {
    message: "Tanggal diterima harus diisi.",
  }),
});

type FormValues = z.infer<typeof studentFormSchema>;

const defaultValues: Partial<FormValues> = {
  nama: "",
  nik: "",
  nisn: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: undefined,
  alamat: "",
  tanggalDiterima: "",
};

export function CreateStudentForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    toast("Created");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="nik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIK</FormLabel>
                <FormControl>
                  <Input placeholder="16 digit NIK" maxLength={16} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nisn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NISN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="10 digit NISN"
                    maxLength={10}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="tempatLahir"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat Lahir</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan tempat lahir" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tanggalLahir"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Lahir</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="jenisKelamin"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Jenis Kelamin</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="L" />
                    </FormControl>
                    <FormLabel className="font-normal">Laki-laki</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="P" />
                    </FormControl>
                    <FormLabel className="font-normal">Perempuan</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan alamat lengkap"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tanggalDiterima"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Diterima</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
