"use client";
import {
  CreateEducationHistorySchema,
  type CreateEducationHistory,
} from "@/schema/education";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  educationDegreePositions,
  educationTypes,
  formalEducationLevels,
  schoolTypes,
  trainingTypes,
} from "@/server/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type FormValues = CreateEducationHistory;
export function CreateEducationHistoryForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(CreateEducationHistorySchema),
    defaultValues: {
      educationType: undefined,
    },
  });

  const handleSubmit = async (formData: FormValues) => {
    try {
      console.log("Submitted data:", formData);
      toast.success("Data berhasil disimpan!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Gagal menyimpan data.");
    }
  };
  return (
    <Form {...form}>
      <ScrollArea className="h-[90vh] p-4 pt-0">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-4 space-y-4"
        >
          <FormField
            control={form.control}
            name="educationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Pendidikan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Jenis Pendidikan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {educationTypes.enumValues.map((value, idx) => (
                      <SelectItem key={idx} value={value}>
                        {value.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("educationType") === "FORMAL" ? (
            <>
              <FormField
                control={form.control}
                name="formalEducationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenjang Pendidikan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenjang Pendidikan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formalEducationLevels.enumValues.map((value, idx) => (
                          <SelectItem key={idx} value={value}>
                            {value.replaceAll("_", " ")}
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
                name="schoolName"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Nama Sekolah/Lembaga</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama Sekolah/Lembaga"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Jurusan / Program Studi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan Jurusan / Program Studi"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Masukkan sesuai dengan Ijazah
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Sekolah</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis Sekolah" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schoolTypes.enumValues.map((value, idx) => (
                          <SelectItem key={idx} value={value}>
                            {value.replaceAll("_", " ")}
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
                name="schoolAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Sekolah</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Alamat Sekolah"
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
                name="entryYear"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Tahun Masuk</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        placeholder="Masukkan Tahun Masuk"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="graduationYear"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Tahun Lulus</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        placeholder="Masukkan Tahun Lulus"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="averageValue"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Indeks Prestasi Kumulatif/Nilai Rata-rata</FormLabel>
                    <FormControl>
                      <Input
                      type="number"
                      step="0.01"
                      min={0} 
                      max={100}
                      defaultValue={"0,0"}
                      pattern="^\d+(?:\.\d{1,2})?$" 
                        placeholder="0,00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diplomaDate"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Tanggal Ijazah</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Masukkan Tanggal Ijazah"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diplomaNumber"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Nomor Ijazah</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan Nomor Ijazah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

<FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Gelar</FormLabel>
                    <FormControl>
                      <Input max={100} placeholder="Sarjana Pendidikan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

<FormField
                control={form.control}
                name="degreeCode"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Singkatan Gelar</FormLabel>
                    <FormControl>
                      <Input max={10} placeholder="S.Pd." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

<FormField
                control={form.control}
                name="degreePosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi Gelar</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Lokasi Gelar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {educationDegreePositions.enumValues.map((value, idx) => (
                          <SelectItem key={idx} value={value}>
                            {value.replaceAll("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
{/* degreePosition
degree
degreeCode */}
            </>
          ) : form.watch("educationType") === "NON_FORMAL" ? (
            <>
              <FormField
                control={form.control}
                name="trainingName"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Nama Pelatihan</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan Nama Pelatihan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trainingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Pelatihan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis Pelatihan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trainingTypes.enumValues.map((value, idx) => (
                          <SelectItem key={idx} value={value}>
                            {value.replaceAll("_", " ")}
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
                name="organizer"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Nama Penyelenggara</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan Nama Penyelenggara"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trainingLocation"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Lokasi Pelatihan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan Lokasi Pelatihan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Jika pelatihan berupa daring cukup tuliskan{" "}
                      <strong>Daring</strong>
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Tanggal Mulai Pelatihan</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Tanggal Selesai Pelatihan</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Durasi Pelatihan</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Masukkan Durasi Pelatihan"/>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                     Tuliskan jika pelatihan lebih dari 1 hari. Masukkan dalam bentuk menit.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="certificateNumber"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Nomor Sertifikat</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Masukkan Nomor Sertifikat" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificateDate"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Tanggal Sertifikat</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}

          {form.watch("educationType") === "FORMAL" ||
          form.watch("educationType") === "NON_FORMAL" ? (
            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel>
                    {form.watch("educationType") === "FORMAL"
                      ? "Ijazah"
                      : "Sertifikat"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,image/jpeg,image/png,image/gif,image/webp"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <Button type="submit" className="w-full">
            Simpan
          </Button>
        </form>
      </ScrollArea>
    </Form>
  );
}
