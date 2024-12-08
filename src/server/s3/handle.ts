/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";
import { nanoid } from "@/lib/generate-id";
import {
  S3Client,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
// Fungsi untuk membuat konfigurasi S3 yang aman
function createS3Client() {
  // Ambil variabel environment dengan pengecekan
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const region = process.env.S3_REGION;
  const endpoint = process.env.S3_ENDPOINT;

  // Validasi kredensial
  if (!accessKeyId) {
    throw new Error(
      "S3_ACCESS_KEY_ID tidak ditemukan di environment variables",
    );
  }
  if (!secretAccessKey) {
    throw new Error(
      "S3_SECRET_ACCESS_KEY tidak ditemukan di environment variables",
    );
  }
  if (!region) {
    throw new Error("S3_REGION tidak ditemukan di environment variables");
  }
  if (!endpoint) {
    throw new Error("S3_ENDPOINT tidak ditemukan di environment variables");
  }

  // Konfigurasi S3 Client
  return new S3Client({
    endpoint: endpoint,
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
    // Untuk penyedia S3 selain AWS
    forcePathStyle: true,
  });
}

// Fungsi upload file ke S3 dengan kontrol akses spesifik
export async function uploadFileToS3(
  file: File,
  makePublic = true,
): Promise<string> {
  // Ambil bucket name dari environment variable
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("S3_BUCKET_NAME tidak ditemukan di environment variables");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${nanoid()}-${file.name}`;

  // Opsi untuk membuat file publik atau privat
  const params: PutObjectCommandInput = {
    Bucket: bucketName, // Pastikan bucket name ada
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    // Tambahkan ACL hanya jika ingin membuat publik
    ...(makePublic ? { ACL: "public-read" } : {}),
    ContentDisposition: "inline",
  };

  try {
    // Buat S3 client
    const s3Client = createS3Client();

    // Kirim file ke S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Konstruksi URL
    // Sesuaikan format URL dengan penyedia S3 Anda
    const publicUrl = `${process.env.S3_PUBLIC_URL}/${fileName}`;

    return publicUrl;
  } catch (error) {
    console.error("Error mengunggah file ke S3:", error);
    throw error;
  }
}
