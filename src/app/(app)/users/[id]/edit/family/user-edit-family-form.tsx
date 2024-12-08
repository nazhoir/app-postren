"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUserFamilyRelation,
  searchUserByIdentity,
} from "@/server/actions/users";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { type familyRelationType } from "@/server/db/schema";

// Definisi tipe yang lebih ketat
type FamilyRelationType = (typeof familyRelationType.enumValues)[number];

interface User {
  id: string;
  name: string;
  nik: string;
}

export default function UserEditFamilyForm({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [nik, setNik] = useState<string>("");
  const [familyType, setFamilyType] = useState<FamilyRelationType>();

  const familyTypes = [
    { name: "Ayah", value: "father" },
    { name: "Ibu", value: "mother" },
    { name: "Saudara", value: "sibling" },
    { name: "Pasangan", value: "spouse" },
    { name: "Anak", value: "child" },
    { name: "Wali", value: "guardian" },
  ];

  const validateNik = (nikValue: string): boolean => {
    // Contoh validasi NIK: harus 16 digit angka
    return /^\d{16}$/.test(nikValue);
  };

  const searchUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validasi NIK sebelum pencarian
      if (!validateNik(nik)) {
        toast.error("NIK harus berupa 16 digit angka");
        return;
      }

      setIsLoading(true);
      try {
        const req = await searchUserByIdentity(nik.trim());

        if (req) {
          toast.success("Pengguna ditemukan");
          setUser({
            id: req.id,
            name: req.name,
            nik,
          });
        } else {
          toast.error("Pengguna tidak ditemukan");
        }
      } catch (error) {
        console.error("Pencarian pengguna gagal:", error);
        toast.error("Terjadi kesalahan dalam pencarian pengguna");
      } finally {
        setIsLoading(false);
      }
    },
    [nik],
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validasi kelengkapan data
      if (!user || !familyType) {
        toast.error("Silakan lengkapi data terlebih dahulu");
        return;
      }

      setIsLoading(true);
      try {
        await createUserFamilyRelation({
          userId: user.id,
          relatedUserId: userId,
          relationType: familyType,
        });

        toast.success(`Berhasil menambah relasi keluarga`);

        // Reset form setelah berhasil
        setUser(undefined);
        setFamilyType(undefined);
        setNik("");
      } catch (error) {
        console.error("Gagal menambah relasi keluarga:", error);
        toast.error("Gagal menambah relasi keluarga");
      } finally {
        setIsLoading(false);
      }
    },
    [userId, user, familyType],
  );

  return (
    <div>
      {user ? (
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-4 items-end gap-3">
            <div>
              <Label htmlFor="nik">NIK</Label>
              <Input
                id="nik"
                name="nik"
                defaultValue={user.nik}
                disabled
                aria-label="NIK Pengguna"
              />
            </div>
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                disabled
                aria-label="Nama Pengguna"
              />
            </div>
            <div>
              <Label htmlFor="type">Jenis Keluarga</Label>
              <Select
                onValueChange={(value) =>
                  setFamilyType(value as FamilyRelationType)
                }
                value={familyType}
              >
                <SelectTrigger aria-label="Pilih Jenis Keluarga">
                  <SelectValue placeholder="Jenis Keluarga" />
                </SelectTrigger>
                <SelectContent id="type">
                  {familyTypes.map(({ value, name }) => (
                    <SelectItem key={value} value={value}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={!familyType || isLoading}
              aria-label="Simpan Data Keluarga"
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 animate-spin" />
                  <span>Mohon tunggu ...</span>
                </>
              ) : (
                "Simpan Data"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={searchUser}>
          <div className="flex w-full items-end space-x-3">
            <div>
              <Label htmlFor="nik">NIK</Label>
              <Input
                id="nik"
                name="nik"
                type="text" // Ubah dari number ke text untuk validasi manual
                placeholder="Masukkan NIK"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                aria-label="Masukkan NIK untuk dicari"
                maxLength={16}
              />
            </div>

            <Button
              type="submit"
              className="w-44"
              disabled={nik.length !== 16 || isLoading}
              aria-label="Cari Data Pengguna"
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 animate-spin" />
                  <span>Mohon tunggu ...</span>
                </>
              ) : (
                "Cari Data"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
