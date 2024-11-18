"use server";

import { type z } from "zod";
import { db } from "../db";
import {
  institutions,
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
      where: eq(organizationUsers.userId, data.createdBy),
    });

    if (!getOrgId) {
      throw new Error("Organization not found");
    }

    const { id, institutionId, nisn, createdBy } = data;

    await db.transaction(async (tx) => {
      const [createUser] = await tx
        .insert(students)
        .values({
          userId: id,
          organizationId: getOrgId.organizationId,
          nisn,
          createdBy,
        })
        .returning({ userId: students.userId });
      if (!createUser) throw new Error("failed");
      await tx.insert(institutionStudents).values({
        studentId: id,
        institutionId,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// Definisikan tipe untuk setiap bagian data
type UserData = typeof users.$inferSelect;
type StudentData = typeof students.$inferSelect;
type InstitutionData = typeof institutions.$inferSelect;

interface InstitutionWithRelation {
  nisLocal: string | null;
  institution: InstitutionData | null;
}

export interface StudentWithRelations extends StudentData {
  user: UserData | null;
  institutions: InstitutionWithRelation[];
}

export async function getStudentsByOrgId(
  organizationId: string,
): Promise<StudentWithRelations[]> {
  try {
    const studentResults = await db
      .select({
        // Student fields
        userId: students.userId,
        organizationId: students.organizationId,
        nisn: students.nisn,
        createdBy: students.createdBy,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        deletedAt: students.deletedAt,
        // User fields
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          username: users.username,
          nationality: users.nationality,
          country: users.country,
          nik: users.nik,
          nkk: users.nkk,
          passport: users.passport,
          birthPlace: users.birthPlace,
          birthDate: users.birthDate,
          gender: users.gender,
          image: users.image,
          emailVerified: users.emailVerified,
          password: users.password,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          deletedAt: users.deletedAt,
        },
      })
      .from(students)
      .leftJoin(users, eq(users.id, students.userId))
      .where(
        and(
          eq(students.organizationId, organizationId),
          isNull(students.deletedAt),
        ),
      );

    const studentsWithInstitutions: StudentWithRelations[] = await Promise.all(
      studentResults.map(async (student) => {
        const institutionRelations = await db
          .select({
            nisLocal: institutionStudents.nisLocal,
            institution: {
              id: institutions.id,
              name: institutions.name,
              shortname: institutions.shortname,
              type: institutions.type,
              image: institutions.image,
              organizationId: institutions.organizationId,
              statistic: institutions.statistic,
              statisticType: institutions.statisticType,
              createdAt: institutions.createdAt,
              updatedAt: institutions.updatedAt,
              deletedAt: institutions.deletedAt,
            },
          })
          .from(institutionStudents)
          .leftJoin(
            institutions,
            eq(institutions.id, institutionStudents.institutionId),
          )
          .where(
            and(
              eq(institutionStudents.studentId, student.userId),
              isNull(institutionStudents.deletedAt),
              isNull(institutions.deletedAt),
            ),
          );

        return {
          userId: student.userId,
          organizationId: student.organizationId,
          nisn: student.nisn,
          createdBy: student.createdBy,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
          deletedAt: student.deletedAt,
          user: student.user,
          institutions: institutionRelations,
        };
      }),
    );

    return studentsWithInstitutions;
  } catch (error) {
    console.error("Error in getStudentsByOrgId:", error);
    throw new Error("Failed to fetch students data");
  }
}
