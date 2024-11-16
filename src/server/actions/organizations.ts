"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersToOrganizations } from "../db/schema";

export const getOrgsIdByUserId = async (userId: string) => {
  const getOrgId = await db.query.usersToOrganizations.findFirst({
    where: eq(usersToOrganizations.userId, userId),
  });

  if (!getOrgId) return undefined;
  return getOrgId.organizationId;
};
