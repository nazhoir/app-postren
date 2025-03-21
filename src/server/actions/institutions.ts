"use server";

import type { z } from "zod";
import { createInstitutionSchema } from "@/schema/institution";
import { db } from "../db";
import { institutions } from "../db/schema";
import { eq } from "drizzle-orm";
import { getOrgsIdByUserId } from "./organizations";

class OrganizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationError";
  }
}

export const createInstitution = async (
  values: z.infer<typeof createInstitutionSchema>,
) => {
  const validatedFields = createInstitutionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const data = validatedFields.data;
  try {
    const getOrgId = await getOrgsIdByUserId(data.userId);

    if (!getOrgId) {
      throw new OrganizationError("Organization not found");
    }

    await db.insert(institutions).values({ ...data, organizationId: getOrgId });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
};

export const getInstitutionsByOrgID = async (userId: string) => {
  const getOrgId = await getOrgsIdByUserId(userId);

  if (!getOrgId) {
    throw new OrganizationError("Organization not found");
  }

  const data = await db.query.institutions.findMany({
    where: eq(institutions.organizationId, getOrgId),
  });

  return data;
};

export const getInstitutionDetailByID = async (
  userId: string,
  institutionId: string,
) => {
  const getOrgId = await getOrgsIdByUserId(userId);

  if (!getOrgId) {
    throw new OrganizationError("Organization not found");
  }

  const data = await db.query.institutions.findFirst({
    where: eq(institutions.id, institutionId),
  });

  return data;
};
