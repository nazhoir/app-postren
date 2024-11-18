"use server";

import { CreateMemberSchema, GetUserByNIKSchema } from "@/schema/members";
import { type z } from "zod";
import { db } from "../db";
import {
  organizations,
  students,
  users,
  organizationUsers,
} from "../db/schema";
import { eq } from "drizzle-orm";

export const createMemberAction = async (
  values: z.infer<typeof CreateMemberSchema>,
) => {
  // Validasi input menggunakan schema
  const validatedFields = CreateMemberSchema.safeParse(values);

  console.log(validatedFields.error);
  if (!validatedFields.success) {
    return { error: "Invalid fields", details: validatedFields.error };
  }

  const data = validatedFields.data;

  try {
    // Ambil organisasi berdasarkan `createdBy`
    const getOrgId = await db.query.organizationUsers.findFirst({
      where: eq(organizationUsers.userId, data.createdBy),
    });

    if (!getOrgId) {
      return { error: "Organization not found" };
    }

    const {
      name,
      birthDate,
      birthPlace,
      identity,
      // address,
      createdBy,
      gender,
      role,
      nisn,
    } = data;
    const { nationality, country, nik, nkk, passport } = identity;
    // Lakukan transaksi database
    await db.transaction(async (tx) => {
      // Tambah data pengguna ke tabel `users`
      const [createUser] = await tx
        .insert(users)
        .values({
          name,
          birthDate,
          birthPlace,
          nationality,
          country,
          passport: passport!.length > 1 ? passport : undefined,
          nik: nik.length > 1 ? nik : undefined,
          nkk: nkk.length > 1 ? nkk : undefined,
          gender,
        })
        .returning({ id: users.id });

      if (!createUser) throw new Error("Failed to create user");

      // Tambah relasi pengguna-organisasi ke tabel `organizationUsers`
      await tx.insert(organizationUsers).values({
        userId: createUser.id,
        organizationId: getOrgId.organizationId,
        createdBy,
      });

      // Jika role adalah siswa, tambahkan data ke tabel `students`
      if (role === "student") {
        await tx.insert(students).values({
          userId: createUser.id,
          organizationId: getOrgId.organizationId,
          nisn: nisn,
          createdBy,
        });
      }
    });

    return { success: true };
  } catch (error) {
    // Tangkap error dan kembalikan pesan yang relevan
    console.error(error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    // Jika error bukan instance dari `Error`, kembalikan error generik
    return { error: "An unexpected error occurred", details: error };
  }
};

export const getOrgsMemberByOrgID = async (organizationId: string) => {
  const data = await db
    .select({
      users: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
        birthDate: users.birthDate,
        birthPlace: users.birthPlace,
        gender: users.gender,
        nik: users.nik,
        nkk: users.nkk,
      },
    })
    .from(users)
    .innerJoin(organizationUsers, eq(organizationUsers.userId, users.id))
    .innerJoin(
      organizations,
      eq(organizations.id, organizationUsers.organizationId),
    )
    .where(eq(organizations.id, organizationId));

  return data.map(({ users }) => ({
    id: users.id,
    name: users.name,
    username: users.username,
    image: users.image,
    birthDate: users.birthDate,
    birthPlace: users.birthPlace,
    gender: users.gender,
    nik: users.nik,
    nkk: users.nkk,
  }));
};

export const getUserByNIK = async (
  values: z.infer<typeof GetUserByNIKSchema>,
) => {
  const validatedFields = GetUserByNIKSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const data = validatedFields.data;

  const req = await db.query.users.findFirst({
    where: eq(users.nik, data.nik),
  });

  return {
    data: req,
    error: undefined,
  };
};
