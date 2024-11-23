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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserProfile, type UserProfile } from "@/server/actions/users";
import { EditUserSchema } from "@/schema/user";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCallback, useEffect, useMemo, useState } from "react";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
type FormValues = z.infer<typeof EditUserSchema>;

interface EditUserFormProps {
  data: UserProfile;
}

export default function EditUserForm({ data }: EditUserFormProps) {
  const [isFormChanged, setIsFormChanged] = useState(false);

  // Create a memoized initial values object
  const initialValues = useMemo(
    () => ({
      id: data.id,
      name: data.name,
      gender: data.gender ?? undefined,
      nationality: data.nationality ?? undefined,
      country: data.country ?? "indonesia",
      nik: data.nik ?? undefined,
      nkk: data.nkk ?? undefined,
      nisn: data.nisn ?? undefined,
      birthDate: data.birthDate ?? undefined,
      birthPlace: data.birthPlace ?? undefined,
      registrationNumber: data.registrationNumber ?? undefined,
      email: data.email ?? undefined,
      domicileSameAsAddress: data.domicileSameAsAddress ?? false,
      address: {
        id: data.address?.id ?? undefined,
        fullAddress: data.address?.fullAddress ?? undefined,
        rt: data.address?.rt ?? undefined,
        rw: data.address?.rw ?? undefined,
        village: data.address?.village ?? undefined,
        district: data.address?.district ?? undefined,
        regency: data.address?.regency ?? undefined,
        province: data.address?.province ?? undefined,
        country: data.address?.country ?? undefined,
        postalCode: data.address?.postalCode ?? undefined,
      },
      domicile: {
        id: data.domicile?.id ?? undefined,
        fullAddress: data.domicile?.fullAddress ?? undefined,
        rt: data.domicile?.rt ?? undefined,
        rw: data.domicile?.rw ?? undefined,
        village: data.domicile?.village ?? undefined,
        district: data.domicile?.district ?? undefined,
        regency: data.domicile?.regency ?? undefined,
        province: data.domicile?.province ?? undefined,
        country: data.domicile?.country ?? undefined,
        postalCode: data.domicile?.postalCode ?? undefined,
      },
    }),
    [data],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: cloneDeep(initialValues),
  });

  // Normalized value comparison function
  const normalizeFormValues = useCallback((values: FormValues) => {
    const normalized = cloneDeep(values);

    // Normalize empty strings to undefined
    Object.keys(normalized).forEach((key) => {
      if (normalized[key as keyof FormValues] === "") {
        normalized[key as keyof FormValues] = undefined as never;
      }
    });

    // Normalize nested address and domicile objects
    ["address", "domicile"].forEach((key) => {
      const nestedObject = normalized[key as keyof FormValues] as Record<
        string,
        unknown
      >;
      if (nestedObject) {
        Object.keys(nestedObject).forEach((subKey) => {
          if (nestedObject[subKey] === "") {
            nestedObject[subKey] = undefined;
          }
        });
      }
    });

    return normalized;
  }, []);

  // Enhanced change detection
  const checkFormChanges = useCallback(
    (currentValues: FormValues) => {
      const normalizedCurrent = normalizeFormValues(currentValues);
      const normalizedInitial = normalizeFormValues(initialValues);

      const hasChanges = !isEqual(normalizedCurrent, normalizedInitial);
      setIsFormChanged(hasChanges);
    },
    [initialValues, normalizeFormValues],
  );

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      checkFormChanges(value as FormValues);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, checkFormChanges, form]);

  const handleSubmit = async (formData: FormValues) => {
    try {
      const submissionData: FormValues = {
        ...formData,
        domicile: formData.domicileSameAsAddress
          ? {
              ...formData.address,
              id: formData.domicile?.id,
            }
          : formData.domicile,
      };

      await updateUserProfile(submissionData);
      form.reset(submissionData); // Reset form with new values
      setIsFormChanged(false);
      toast.success("Data berhasil disimpan");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleNationalityChange = async (value: "WNI" | "WNA") => {
    form.setValue("nationality", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (value === "WNA") {
      form.setValue("nik", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("nkk", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("country", "", { shouldValidate: true, shouldDirty: true });
    } else {
      form.setValue("nik", initialValues.nik, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("nkk", initialValues.nkk, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("country", "indonesia", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    // Trigger form validation and change detection
    await form.trigger();
  };

  const nationality = form.watch("nationality");

  // Reset form to initial values
  const handleReset = useCallback(async () => {
    if (window.confirm("Anda yakin ingin mengembalikan semua perubahan?")) {
      form.reset(cloneDeep(initialValues));

      await form.trigger();
      setIsFormChanged(false);
    }
  }, [form, initialValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="lg: gap-4 space-y-4 lg:grid lg:grid-cols-4 lg:space-y-0">
          <h2 className="text-lg font-bold lg:col-span-4">Data Pribadi</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="lg:col-span-2">
                <FormLabel>Nama lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem className="lg:col-start-1">
                <FormLabel>Nomor induk</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan Nomor induk" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  <Input
                    placeholder="Masukkan tempat lahir"
                    {...field}
                    value={field.value ?? ""}
                  />
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
                  <Input type="date" {...field} value={field.value ?? ""} />
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
                    type="number"
                    placeholder="Masukkan NISN"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kewarganegaraan</FormLabel>
                <Select
                  onValueChange={handleNationalityChange}
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

          {nationality === "WNI" && (
            <>
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="16 digit NIK"
                        type="number"
                        maxLength={16}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nkk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor KK</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="16 digit Nomor KK"
                        maxLength={16}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {nationality === "WNA" && (
            <>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Negara</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama negara"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="passport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Paspor</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Masukkan nomor paspor"
                    maxLength={50}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-2 col-start-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Masukkan email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="lg: gap-4 space-y-4 lg:grid lg:grid-cols-4 lg:space-y-0">
          <h2 className="col-span-4 text-lg font-bold">
            Data Alamat Sesuai KK
          </h2>
          <FormField
            control={form.control}
            name="address.fullAddress"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Alamat lengkap</FormLabel>
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
            name="address.rt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RT</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Masukkan Nomor induk"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.rw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RW</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Masukkan Nomor induk"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.village"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desa/Keluruhan</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan Nomor induk" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kecamatan</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan Nomor induk" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.regency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kabupaten/Kota</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan Nomor induk" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provinsi</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan Nomor induk" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Pos</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan Nomor induk" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="domicileSameAsAddress"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  Alamat Domisili{" "}
                  {form.watch("domicileSameAsAddress").valueOf() === true
                    ? "Sama dengan KK"
                    : "Tidak sama dengan KK"}
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("domicileSameAsAddress").valueOf() === false ? (
          <div className="lg: gap-4 space-y-4 lg:grid lg:grid-cols-4 lg:space-y-0">
            <h2 className="col-span-4 text-lg font-bold">
              Data Alamat Domisili
            </h2>
            <FormField
              control={form.control}
              name="domicile.fullAddress"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Alamat lengkap</FormLabel>
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
              name="domicile.rt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan Nomor induk"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domicile.rw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RW</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan Nomor induk"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domicile.village"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desa/Keluruhan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Nomor induk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domicile.district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Nomor induk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domicile.regency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kabupaten/Kota</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Nomor induk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domicile.province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Nomor induk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domicile.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Pos</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Nomor induk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : null}
        <div className="flex gap-4">
          <Button type="submit" className="w-full" disabled={!isFormChanged}>
            {isFormChanged ? "Simpan Perubahan" : "Tidak Ada Perubahan"}
          </Button>

          {isFormChanged && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="w-40"
            >
              Reset
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
