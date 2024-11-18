"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { organizationUsers } from "../db/schema";

export const getOrgsIdByUserId = async (userId: string) => {
  const getOrgId = await db.query.organizationUsers.findFirst({
    where: eq(organizationUsers.userId, userId),
  });

  if (!getOrgId) return undefined;
  return getOrgId.organizationId;
};
