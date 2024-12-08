"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadFileToS3 } from "@/server/s3/handle";
import { toast } from "sonner"; // Menggunakan toast untuk notifikasi yang lebih modern
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/server/actions/users";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export function EditUserPicture({
  data,
}: {
  data: { image: string | null; name: string; id: string };
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validasi tipe file
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error(
          "Hanya file gambar yang diperbolehkan (JPEG, PNG, GIF, WebP)",
        );
        return;
      }

      // Validasi ukuran file (misalnya maks 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSizeInBytes) {
        toast.error("Ukuran file melebihi batas maks 5MB");
        return;
      }

      setFile(selectedFile);

      // Buat preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setUploading(true);
    try {
      const uploadedImageUrl = await uploadFileToS3(file);

      const update = await updateUserProfile({
        id: data.id,
        image: uploadedImageUrl,
      });

      if (update) {
        toast.success("Foto profil berhasil diperbarui!");
        router.refresh();
        // Reset state setelah upload berhasil
        setFile(null);
        setPreviewUrl(null);
        setEdit(false);
      }
    } catch (error) {
      console.error("Error upload:", error);
      toast.error("Gagal mengunggah gambar. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  // Fungsi untuk mendapatkan inisial nama
  const getInitials = () => {
    const nameParts = data.name.split(" ");
    return nameParts.length > 1
      ? `${nameParts[0]![0]}${nameParts[1]![0]}`.toUpperCase()
      : (nameParts[0]![0]?.toUpperCase() ?? "");
  };

  return (
    <div className="mb-4 flex space-x-4">
      {/* Avatar Preview */}
      <div className="group relative">
        <Avatar className="h-32 w-32 rounded-lg border">
          <AvatarImage
            src={previewUrl ?? data.image ?? undefined}
            alt={data.name}
            className="object-cover"
          />
          <AvatarFallback className="rounded-lg">
            {getInitials()}
          </AvatarFallback>
        </Avatar>

        <div className="absolute top-0 flex h-full w-full items-center justify-center rounded-lg border bg-white opacity-0 group-hover:opacity-100">
          <Button variant={"outline"} onClick={() => setEdit(true)}>
            Edit
          </Button>
        </div>
      </div>
      {/* Form Upload */}

      {edit && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="border-dashed shadow-none"
            />
          </div>
          <Button
            type="button"
            size={"sm"}
            variant={"destructive"}
            className="me-2"
            onClick={() => {
              setEdit(false);
            }}
          >
            Batal
          </Button>
          <Button type="submit" size={"sm"} disabled={uploading || !file}>
            {uploading ? "Sedang Mengunggah..." : "Unggah Gambar"}
          </Button>
        </form>
      )}
    </div>
  );
}
