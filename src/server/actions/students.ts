"use server";

import { CreateMemberSchema, GetUserByNIKSchema } from "@/schema/members";
import { type z } from "zod";
import { db } from "../db";
import {
  institutions,
  organizations,
  students,
  studentsToInstitutions,
  users,
  usersToOrganizations,
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
    const getOrgId = await db.query.usersToOrganizations.findFirst({
      where: eq(usersToOrganizations.userId, data.createdBy),
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
      // Create user-organization relationship
      await tx.insert(studentsToInstitutions).values({
        studentId: id,
        institutionId,
        // nisLocal: "41414645",
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
type StudentToInstitutionData = typeof studentsToInstitutions.$inferSelect;

// Tipe untuk institusi dengan data relasinya
interface InstitutionWithRelation {
  nisLocal: string | null;
  institution: InstitutionData | null;
}

// Tipe lengkap untuk student dengan semua relasinya
export interface StudentWithRelations extends StudentData {
  user: UserData | null;
  institutions: InstitutionWithRelation[];
}

/**
 * Mengambil data students berdasarkan organization ID beserta relasinya
 * @param organizationId - ID dari organization
 * @returns Array of students dengan relasi institutions dan user data
 */
export async function getStudentsByOrgId(
  organizationId: string,
): Promise<StudentWithRelations[]> {
  try {
    // Mengambil semua students dari organization tersebut
    const studentResults = await db
      .select({
        // Student fields - mengambil semua field dari students
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
          nik: users.nik,
          nkk: users.nkk,
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

    // Untuk setiap student, ambil data institutions
    const studentsWithInstitutions: StudentWithRelations[] = await Promise.all(
      studentResults.map(async (student) => {
        const institutionRelations = await db
          .select({
            nisLocal: studentsToInstitutions.nisLocal,
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
          .from(studentsToInstitutions)
          .leftJoin(
            institutions,
            eq(institutions.id, studentsToInstitutions.institutionId),
          )
          .where(
            and(
              eq(studentsToInstitutions.studentId, student.userId),
              isNull(studentsToInstitutions.deletedAt),
              isNull(institutions.deletedAt),
            ),
          );

        // Mengembalikan student dengan format yang sesuai dengan StudentWithRelations
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
