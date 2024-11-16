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
import { getUserByNIK } from "@/server/actions/members";
import { useState } from "react";
import { users } from "@/server/db/schema";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import AddStudentDialog from "./add-student-dialog";

const studentFormSchema = z.object({
  nik: z.string().length(16, {
    message: "NIK harus 16 digit.",
  }),
});

type FormValues = z.infer<typeof studentFormSchema>;

const defaultValues: Partial<FormValues> = {
  nik: "",
};

export function CreateStudentForm({
  institutions,
  createdBy,
}: {
  createdBy: string;
  institutions: { id: string; name: string; type: string | null }[];
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  interface User {
    id: string;
    nik: string | null;
    name: string | null;
    username: string | null;
    email: string | null;
    nkk: string | null;
    birthPlace: string | null;
    birthDate: string | null;
    gender: string | null;
  }
  const [user, setUser] = useState<User | undefined | null>();

  async function onSubmit(data: FormValues) {
    const req = await getUserByNIK(data);

    setUser(req.data);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          <Button type="submit" className="w-full">
            Cari Data
          </Button>
        </form>
      </Form>

      {user ? (
        <Card>
          <CardHeader className="flex-row justify-between">
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>NIK: {user.nik}</CardDescription>
            </div>
            <AddStudentDialog
              userId={user.id}
              institutions={institutions}
              createdBy={createdBy}
            />
          </CardHeader>
        </Card>
      ) : null}
    </>
  );
}
