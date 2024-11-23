"use server";

import { type z } from "zod";
import { db } from "../db";
import {
  students,
  institutionStudents,
  users,
  organizationUsers,
} from "../db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { AddOrganizationStudentSchema } from "@/schema/student";

export const AddOrganizationStudent = async (
  values: z.infer<typeof AddOrganizationStudentSchema>,
) => {
  const validatedFields = AddOrganizationStudentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const data = validatedFields.data;
  try {
    const getOrgId = await db.query.organizationUsers.findFirst({
      where: eq(organizationUsers.userId, data.invitedBy),
    });

    if (!getOrgId) {
      throw new Error("Organization not found");
    }

    const { id, institutionId, nisn, invitedBy } = data;

    await db.transaction(async (tx) => {
      const [createUser] = await tx
        .insert(students)
        .values({
          id: id,
          organizationId: getOrgId.organizationId,
          nisn,
          invitedBy,
        })
        .returning({ id: students.id });
      if (!createUser) throw new Error("failed");
      await tx.insert(institutionStudents).values({
        studentId: id,
        institutionId,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

interface GetStudentsByOrgIdResult {
  id: string;
  name: string | null | undefined;
  gender: string | null | undefined;
  nisn: string;
  nik: string | null | undefined;
  nkk: string | null | undefined;
  birthPlace: string | null | undefined;
  birthDate: string | null | undefined;
}
export async function getStudentsByOrgId(
  organizationId: string,
): Promise<GetStudentsByOrgIdResult[]> {
  try {
    const studentResults = await db
      .select({
        // Student fields
        id: students.id,
        nisn: students.nisn,
        joiningDate: students.joiningDate,
        // User fields
        user: {
          name: users.name,
          nik: users.nik,
          nkk: users.nkk,
          passport: users.passport,
          birthPlace: users.birthPlace,
          birthDate: users.birthDate,
          gender: users.gender,
          image: users.image,
          registrationNumber: users.registrationNumber,
        },
      })
      .from(students)
      .leftJoin(users, eq(users.id, students.id))
      .where(
        and(
          eq(students.organizationId, organizationId),
          isNull(students.deletedAt),
        ),
      );

    const data: GetStudentsByOrgIdResult[] = studentResults.map(
      ({ nisn, user, id }) => ({
        id,
        name: user?.name,
        gender: user?.gender,
        nisn,
        nik: user?.nik,
        nkk: user?.nkk,
        birthPlace: user?.birthPlace,
        birthDate: user?.birthDate,
      }),
    );

    return data;

    // return studentsWithInstitutions;
  } catch (error) {
    console.error("Error in getStudentsByOrgId:", error);
    throw new Error("Failed to fetch students data");
  }
}
