"use client";

import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { createInstitutionSchema } from "@/schema/institution";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInstitution } from "@/server/actions/institutions";

export function CreateInstitutionForm({ userId }: { userId: string }) {
  type FormValues = z.infer<typeof createInstitutionSchema>;
  const defaultValues: Partial<FormValues> = {
    userId,
    name: "",
    shortname: "",
    type: "",
    statistic: "",
    statisticType: undefined,
  };
  const form = useForm<FormValues>({
    resolver: zodResolver(createInstitutionSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    await createInstitution(data);
    toast("Created");
  }

  const typeInstituitons = [
    {
      name: "Pondok Pesantren",
    },
    {
      name: "Madrasah Tsanawiyah",
    },
    {
      name: "Madrasah Aliyah",
    },
    {
      name: "Madrasah Diniyah Takmiliyah Awaliyah",
    },
    {
      name: "Madrasah Diniyah Takmiliyah Wustha",
    },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-[70vh] space-y-6 overflow-y-scroll pb-4"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe Lembaga</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {typeInstituitons.map((type) => (
                    <SelectItem value={type.name} key={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shortname</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="statistic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Statistik</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="statisticType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe Statistik</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="NSPP">
                    Nomor Statistik Pondok Pesantren
                  </SelectItem>
                  <SelectItem value="NSM">Nomor Statistik Madrasah</SelectItem>
                  <SelectItem value="NSS">Nomor Statistik Sekolah</SelectItem>
                </SelectContent>
              </Select>
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
