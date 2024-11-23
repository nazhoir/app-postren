"use server";

import { hashingPassword } from "@/lib/hashing";
import { db } from "@/server/db";
import {
  organizationAdmins,
  organizations,
  users,
  organizationUsers,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

export type SetupActionInput = {
  nameAdmin: string;
  email: string;
  password: string;
  nameOrganization: string;
};

export type SetupActionResult = {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    organizationId: string;
  };
};

export const setupAction = async (
  data: SetupActionInput,
): Promise<SetupActionResult> => {
  try {
    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    // Check if organization name already exists
    const existingOrg = await db.query.organizations.findFirst({
      where: eq(organizations.name, data.nameOrganization),
    });

    if (existingOrg) {
      return {
        success: false,
        message: "Organization name already exists",
      };
    }

    // Hash password
    const hashedPassword = await hashingPassword(data.password);

    const result = await db.transaction(async (tx) => {
      // Create user
      const [user] = await tx
        .insert(users)
        .values({
          name: data.nameAdmin,
          email: data.email,
          password: hashedPassword,
        })
        .returning({ id: users.id });

      if (!user) throw new Error("Failed to create user");

      // Create organization
      const [organization] = await tx
        .insert(organizations)
        .values({
          name: data.nameOrganization,
          type: "yayasan",
        })
        .returning({ id: organizations.id });

      if (!organization) throw new Error("Failed to create organization");

      // Create user-organization relationship
      await tx.insert(organizationUsers).values({
        userId: user.id,
        organizationId: organization.id,
      });

      await tx.insert(organizationAdmins).values({
        userId: user.id,
        organizationId: organization.id,
        role: "superadmin",
      });
      return {
        userId: user.id,
        organizationId: organization.id,
      };
    });

    return {
      success: true,
      message: "Setup completed successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to complete setup",
    };
  }
};

export const countOrganization = async () => {
  const data = await db.$count(organizations);

  return data;
};
