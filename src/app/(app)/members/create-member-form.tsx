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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CreateMemberSchema } from "@/schema/members";
import { createMemberAction } from "@/server/actions/members";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormValues = z.infer<typeof CreateMemberSchema>;

export function CreateMemberForm({ userId }: { userId: string }) {
  const defaultValues: Partial<FormValues> = {
    name: "",
    birthPlace: "",
    birthDate: "",
    gender: undefined,
    address: "",
    createdBy: userId,
    role: undefined,
    nisn: "",
    identity: {
      // nationality:undefined,
      nik: "",
      nkk: "",
      passport: "",
      nationality: "WNI",
      country: "",
    },
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateMemberSchema),
    defaultValues,
  });

  // Watch the role field to conditionally render NISN
  const selectedRole = form.watch("role");

  async function onSubmit(data: FormValues) {
    await createMemberAction(data);
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
          name="name"
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
            name="identity.nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kewarganegaraan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kewarganegaraan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="WNI">Indonesia</SelectItem>
                    <SelectItem value="WNA">Warga Asing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch().identity.nationality === "WNI" ? (
            <>
              <FormField
                control={form.control}
                name="identity.nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="16 digit NIK"
                        type="text"
                        maxLength={16}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identity.nkk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor KK</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="16 digit NIK"
                        maxLength={16}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : form.watch().identity.nationality === "WNA" ? (
            <>
              <FormField
                control={form.control}
                name="identity.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Negara</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama negara" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identity.passport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Passpor</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="16 digit NIK"
                        maxLength={50}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}

          <FormField
            control={form.control}
            name="gender"
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
            name="birthPlace"
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
            name="birthDate"
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

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Peserta didik</SelectItem>
                    <SelectItem value="employee">Pegawai</SelectItem>
                    <SelectItem value="guardian">Orangtua/wali</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Only show NISN field when role is "student" */}
          {selectedRole === "student" && (
            <FormField
              control={form.control}
              name="nisn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NISN</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan NISN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="address"
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

        <Button type="submit" className="w-full">
          Simpan Data
        </Button>
      </form>
    </Form>
  );
}
