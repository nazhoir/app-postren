import { AddOrganizationStudentSchema } from "@/schema/student";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AddOrganizationStudent } from "@/server/actions/students";

export default function AddStudentForm({
  userId,
  institutions,
  createdBy,
}: {
  userId: string;
  createdBy: string;
  institutions: {
    id: string;
    name: string;
    type: string | null;
  }[];
}) {
  type FormValues = z.infer<typeof AddOrganizationStudentSchema>;
  const defaultValues: Partial<FormValues> = {
    id: userId,
    createdBy,
    institutionId: "",
    nisn: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(AddOrganizationStudentSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    await AddOrganizationStudent(data);
    toast("Created");
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-[70vh] space-y-6 overflow-y-scroll pb-4"
      >
        <FormField
          control={form.control}
          name="nisn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NISN</FormLabel>
              <FormControl>
                <Input placeholder="NISN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="institutionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lembaga</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lembaga" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {institutions.map((institution) => (
                    <SelectItem value={institution.id} key={institution.id}>
                      {institution.type?.toUpperCase()} {institution.name}
                    </SelectItem>
                  ))}
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
