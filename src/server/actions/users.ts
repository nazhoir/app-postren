"use server";

import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { organizationUsers, users } from "../db/schema";
import { EditUserSchema } from "@/schema/user";
import { type z } from "zod";
import { addresses } from "../db/schema/address/address";

type User = typeof users.$inferSelect;
type Address = Omit<
  typeof addresses.$inferSelect,
  "createdAt" | "updatedAt" | "deletedAt"
>;

// Simplified type definitions
type BaseUser = Pick<
  User,
  | "id"
  | "name"
  | "registrationNumber"
  | "nik"
  | "nkk"
  | "birthPlace"
  | "birthDate"
  | "nationality"
  | "country"
  | "emailVerified"
  | "username"
  | "email"
  | "passport"
  | "image"
  | "guardianType"
  | "fatherId"
  | "motherId"
  | "guardianId"
  | "domicileSameAsAddress"
> & {
  gender?: "L" | "P" | null;
};

export interface UserProfile extends BaseUser {
  nisn?: string | null;
  address?: Address | null;
  domicile?: Address | null;
}

export const getOrgUserProfile = async (
  userID: string,
  orgID: string,
): Promise<UserProfile | undefined> => {
  try {
    const data = await db.query.organizationUsers.findFirst({
      where: and(
        eq(organizationUsers.userId, userID),
        eq(organizationUsers.organizationId, orgID),
      ),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            registrationNumber: true,
            nik: true,
            nkk: true,
            birthPlace: true,
            birthDate: true,
            nationality: true,
            country: true,
            emailVerified: true,
            username: true,
            email: true,
            passport: true,
            image: true,
            guardianType: true,
            fatherId: true,
            motherId: true,
            guardianId: true,
            gender: true,
            domicileSameAsAddress: true,
          },
          with: {
            student: {
              columns: {
                nisn: true,
              },
            },
            address: {
              columns: {
                id: true,
                fullAddress: true,
                rt: true,
                rw: true,
                village: true,
                district: true,
                regency: true,
                province: true,
                country: true,
                postalCode: true,
              },
            },
            domicile: {
              columns: {
                id: true,
                fullAddress: true,
                rt: true,
                rw: true,
                village: true,
                district: true,
                regency: true,
                province: true,
                country: true,
                postalCode: true,
              },
            },
          },
        },
      },
    });

    if (!data?.user) return undefined;

    const { student, address, domicile, ...userBase } = data.user;

    const userProfile: UserProfile = {
      ...userBase,
      nisn: student?.nisn ?? null,
      address: address ?? null,
      domicile: domicile ?? null,
    };
    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return undefined;
  }
};

export const updateUserProfile = async (
  values: z.infer<typeof EditUserSchema>,
) => {
  const validatedFields = EditUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Validation failed", details: validatedFields.error };
  }

  try {
    return await db.transaction(async (tx) => {
      const { address, domicile, ...userData } = validatedFields.data;

      // Handle address update or creation
      const addressId = await (async () => {
        if (!address) return undefined;

        const { id: existingAddressId, ...addressData } = address;

        if (existingAddressId) {
          // Update existing address
          await tx
            .update(addresses)
            .set(addressData)
            .where(eq(addresses.id, existingAddressId));
          return existingAddressId;
        }

        // Create new address
        const [newAddress] = await tx
          .insert(addresses)
          .values(addressData)
          .returning({ id: addresses.id });
        return newAddress?.id;
      })();

      // Handle domicile update or creation
      const domicileId = await (async () => {
        if (!domicile) return undefined;

        const { id: existingDomicileId, ...domicileData } = domicile;

        if (existingDomicileId) {
          // Update existing domicile
          await tx
            .update(addresses)
            .set(domicileData)
            .where(eq(addresses.id, existingDomicileId));
          return existingDomicileId;
        }

        // Create new domicile
        const [newDomicile] = await tx
          .insert(addresses)
          .values(domicileData)
          .returning({ id: addresses.id });
        return newDomicile?.id;
      })();

      // Update user data including address and domicile references
      const [updatedUser] = await tx
        .update(users)
        .set({
          ...userData,
          ...(addressId && { addressId }),
          ...(domicileId && { domicileId }),
        })
        .where(eq(users.id, userData.id))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          addressId: users.addressId,
          domicileId: users.domicileId,
        });

      return { success: true, data: updatedUser };
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred", details: error };
  }
};
