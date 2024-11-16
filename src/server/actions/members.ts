"use server";

import { CreateMemberSchema, GetUserByNIKSchema } from "@/schema/members";
import { type z } from "zod";
import { db } from "../db";
import {
  organizations,
  students,
  users,
  usersToOrganizations,
} from "../db/schema";
import { eq } from "drizzle-orm";

export const createMemberAction = async (
  values: z.infer<typeof CreateMemberSchema>,
) => {
  const validatedFields = CreateMemberSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const data = validatedFields.data;
  try {
    const getOrgId = await db.query.usersToOrganizations.findFirst({
      where: eq(usersToOrganizations.userId, data.createdBy),
    });

    if (!getOrgId) {
      throw new Error("Organization not found");
    }

    const {
      name,
      birthDate,
      birthPlace,
      nik,
      nkk,
      address,
      createdBy,
      gender,
      role,
      nisn,
    } = data;

    await db.transaction(async (tx) => {
      const [createUser] = await tx
        .insert(users)
        .values({
          name,
          birthDate,
          birthPlace,
          nik,
          nkk,
          gender,
        })
        .returning({ id: users.id });
      if (!createUser) throw new Error("failed");
      // Create user-organization relationship
      await tx.insert(usersToOrganizations).values({
        userId: createUser.id,
        organizationId: getOrgId.organizationId,
        createdBy,
      });

      if (role === "student") {
        await tx.insert(students).values({
          userId: createUser.id,
          organizationId: getOrgId.organizationId,
          nisn: nisn,
          createdBy,
        });
      }
    });
  } catch (error) {
    console.log(error);
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
    .innerJoin(usersToOrganizations, eq(usersToOrganizations.userId, users.id))
    .innerJoin(
      organizations,
      eq(organizations.id, usersToOrganizations.organizationId),
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
