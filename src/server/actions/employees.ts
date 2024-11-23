import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db";
import { employees, users } from "../db/schema";

interface getEmployeesByOrgIdResult {
  id: string;
  registrationNumber?: string | null;
  name?: string | null;
  gender?: string | null;
  nik?: string | null;
  nkk?: string | null;
  birthPlace?: string | null;
  birthDate?: string | null;
  npk?: string | null;
  nuptk?: string | null;
  nip?: string | null;
  status?: "PNS" | "PPPK" | "NON-ASN" | null | undefined;
}

export async function getEmployeesByOrgId(
  organizationId: string,
): Promise<getEmployeesByOrgIdResult[]> {
  try {
    const employeeResults = await db
      .select({
        id: employees.id,
        npk: employees.npk,
        nuptk: employees.nuptk,
        nip: employees.nip,
        status: employees.status,
        user: {
          id: users.id,
          name: users.name,
          nik: users.nik,
          nkk: users.nkk,
          passport: users.passport,
          birthPlace: users.birthPlace,
          birthDate: users.birthDate,
          gender: users.gender,
          registrationNumber: users.registrationNumber,
        },
      })
      .from(employees)
      .leftJoin(users, eq(users.id, employees.id))
      .where(
        and(
          eq(employees.organizationId, organizationId),
          isNull(employees.deletedAt),
        ),
      );
    const data: getEmployeesByOrgIdResult[] = employeeResults.map(
      ({ user, npk, nuptk, nip, status, id }) => ({
        id,
        npk,
        nuptk,
        nip,
        status,
        ...user,
      }),
    );

    return data;
  } catch (error) {
    console.error("Error in getEmployeesByOrgId:", error);
    throw new Error("Failed to fetch employees data");
  }
}
