"use server";

import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "../db";
import {
  familyRelationType,
  organizationBillingItems,
  organizationUsers,
  userBill,
  userFamily,
  userFamilyRelations,
  users,
} from "../db/schema";
import { createUserFamilyRelationSchema, EditUserSchema } from "@/schema/user";
import { z } from "zod";
import { addresses } from "../db/schema/address/address";
import { auth } from "../auth";

// Error Messages Constant
const ERROR_MESSAGES = {
  USER_NOT_FOUND: "Pengguna tidak ditemukan",
  SEARCH_FAILED: "Gagal mencari pengguna",
  UNAUTHENTICATED: "Tidak terautentikasi",
  VALIDATION_FAILED: "Validasi gagal",
  NO_UPDATE_VALUES: "Tidak ada nilai yang diperbarui",
  UNEXPECTED_ERROR: "Terjadi kesalahan yang tidak terduga",
};

// Type Definitions
type User = typeof users.$inferSelect;
type Address = Omit<
  typeof addresses.$inferSelect,
  "createdAt" | "updatedAt" | "deletedAt"
>;
type UserFamily = typeof userFamily.$inferSelect;

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
  | "domicileSameAsAddress"
> & {
  gender?: "L" | "P" | null;
};

// Interfaces for extended types
export interface UserProfile extends BaseUser {
  nisn?: string | null;
  address?: Address | null;
  domicile?: Address | null;
  familyRelations?: UserFamily[] | null;
}

interface SearchUserResult {
  id: string;
  name: string;
  email: string;
  nik: string;
  registrationNumber: string;
  username: string;
}

interface UserBillData {
  id: string;
  name: string;
  bills: Array<
    typeof userBill.$inferSelect & {
      item: typeof organizationBillingItems.$inferSelect;
    }
  >;
}

/**
 * Retrieve user profile within an organization
 * @param userID - User identifier
 * @param orgID - Organization identifier
 * @returns User profile or undefined
 */
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

            gender: true,
            domicileSameAsAddress: true,
          },
          with: {
            familyRelations: {
              with: {
                relatedUser: true,
                user: true,
              },
            },
            familyRelationsUser: {
              with: {
                relatedUser: true,
                user: true,
              },
            },
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

    const { student, address, domicile, familyRelations, ...userBase } =
      data.user;

    const userProfile: UserProfile = {
      ...userBase,
      nisn: student?.nisn ?? null,
      address: address ?? null,
      domicile: domicile ?? null,
      familyRelations: familyRelations ?? null,
    };

    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return undefined;
  }
};

/**
 * Update user profile with validation and transaction support
 * @param values - User profile update data
 * @returns Update result or error details
 */
export const updateUserProfile = async (
  values: z.infer<typeof EditUserSchema>,
) => {
  const validatedFields = EditUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: ERROR_MESSAGES.VALIDATION_FAILED,
      details: validatedFields.error,
    };
  }

  try {
    return await db.transaction(async (tx) => {
      const { address, domicile, ...userData } = validatedFields.data;

      // Handle address update or creation
      const addressId = await (async () => {
        if (!address) return undefined;

        const { id: existingAddressId, ...addressData } = address;

        // Ensure we have actual data to update/insert
        if (Object.keys(addressData).length === 0) {
          return existingAddressId ?? undefined;
        }

        if (existingAddressId) {
          // Update existing address
          const [updatedAddress] = await tx
            .update(addresses)
            .set(addressData)
            .where(eq(addresses.id, existingAddressId))
            .returning({ id: addresses.id });
          return updatedAddress?.id;
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

        // Ensure we have actual data to update/insert
        if (Object.keys(domicileData).length === 0) {
          return existingDomicileId ?? undefined;
        }

        if (existingDomicileId) {
          // Update existing domicile
          const [updatedDomicile] = await tx
            .update(addresses)
            .set(domicileData)
            .where(eq(addresses.id, existingDomicileId))
            .returning({ id: addresses.id });
          return updatedDomicile?.id;
        }

        // Create new domicile
        const [newDomicile] = await tx
          .insert(addresses)
          .values(domicileData)
          .returning({ id: addresses.id });
        return newDomicile?.id;
      })();

      // Prepare user update data
      const userUpdateData = {
        ...userData,
        ...(addressId !== undefined && { addressId }),
        ...(domicileId !== undefined && { domicileId }),
      };

      // Check if there are actual values to update
      if (Object.keys(userUpdateData).length === 0) {
        throw new Error(ERROR_MESSAGES.NO_UPDATE_VALUES);
      }

      // Update user data including address and domicile references
      const [updatedUser] = await tx
        .update(users)
        .set(userUpdateData)
        .where(eq(users.id, userData.id))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          addressId: users.addressId,
          domicileId: users.domicileId,
        });

      if (!updatedUser) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      return { success: true, data: updatedUser };
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    return {
      error: ERROR_MESSAGES.UNEXPECTED_ERROR,
      details: error,
    };
  }
};

/**
 * Retrieve user profile by ID
 * @param id - User identifier
 * @returns User profile or undefined
 */
export const getUserProfile = async (id: string) => {
  try {
    if (!id || id.trim() === "") {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const req = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: false,
        deletedAt: false,
      },
    });

    return req;
  } catch (error) {
    console.error(`Error fetching user profile for ID: ${id}`, error);

    throw new Error("Failed to retrieve user information");
  }
};

/**
 * Add a user to a bill
 * @param userId - User identifier
 * @param billId - Bill identifier
 * @returns Bill insertion result
 */
export const addUserToBill = async (userId: string, billId: string) => {
  const session = await auth();

  if (!session) throw new Error(ERROR_MESSAGES.UNAUTHENTICATED);

  try {
    const bill = await db.query.organizationBillingItems.findFirst({
      where: eq(organizationBillingItems.id, billId),
      columns: {
        amount: true,
      },
    });

    if (!bill) throw new Error("Bill with Id not found");

    const req = await db.insert(userBill).values({
      userId,
      billId,
      createdBy: session.user.id,
      amount: bill.amount,
    });

    return req;
  } catch (error) {
    console.error(
      `Error adding user to bill - User: ${userId}, Bill: ${billId}`,
      error,
    );

    if (error instanceof Error) {
      return { error: error.message };
    }

    return {
      error: ERROR_MESSAGES.UNEXPECTED_ERROR,
      details: error,
    };
  }
};

/**
 * Search users by name
 * @param name - Name to search
 * @returns User matching the name or null
 */
export const searchUserByName = async (name: string) => {
  if (!name || name.trim() === "") {
    return null;
  }

  try {
    const req = await db.query.users.findFirst({
      where: ilike(users.name, `%${name}%`),
      columns: {
        password: false,
      },
    });

    return req ?? null;
  } catch (error) {
    console.error(`Error searching user by name: ${name}`, error);
    return null;
  }
};

/**
 * Search user by identity (ID, NIK, or Registration Number)
 * @param searchTerm - Search term (ID, NIK, or Registration Number)
 * @returns User matching the search term or null
 */
export async function searchUserByIdentity(searchTerm: string) {
  if (!searchTerm || searchTerm.trim() === "") {
    return null;
  }

  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        nik: users.nik,
        registrationNumber: users.registrationNumber,
        username: users.username,
      })
      .from(users)
      .where(
        or(
          eq(users.id, searchTerm),
          eq(users.nik, searchTerm),
          eq(users.registrationNumber, searchTerm),
        ),
      )
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error searching user with term: ${searchTerm}`, error);
    return null;
  }
}

/**
 * Get user bills
 * @param id - User identifier
 * @returns User bill data or undefined
 */
export const getUserBill = async (
  id: string,
): Promise<UserBillData | undefined> => {
  try {
    if (!id || id.trim() === "") {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const getUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!getUser) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    const req = await db.query.userBill.findMany({
      where: eq(userBill.userId, id),
      with: {
        item: true,
      },
    });

    if (!req || req.length === 0) return undefined;

    const data: UserBillData = {
      id: getUser.id,
      name: getUser.name,
      bills: req,
    };

    return data;
  } catch (error) {
    console.error(`Error fetching user bills for ID: ${id}`, error);
    throw new Error(ERROR_MESSAGES.SEARCH_FAILED);
  }
};

export const createUserFamilyRelation = async (
  values: z.infer<typeof createUserFamilyRelationSchema>,
) => {
  const validatedFields = createUserFamilyRelationSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      error: ERROR_MESSAGES.VALIDATION_FAILED,
      details: validatedFields.error.format(),
    };
  }

  const { userId, relatedUserId, relationType } = validatedFields.data;
  try {
    await db.transaction(async (tx) => {
      // Masukkan relasi keluarga utama
      await tx.insert(userFamily).values({
        userId,
        relatedUserId,
        relationType,
      });

      // Tambahkan relasi timbal balik untuk tipe keluarga tertentu
      const parentalTypes = ["father", "mother", "guardian"];
      if (parentalTypes.includes(relationType)) {
        // Tambahkan relasi anak untuk orang tua/wali
        await tx.insert(userFamily).values({
          userId: relatedUserId,
          relatedUserId: userId,
          relationType: "child",
        });
      } else if (relationType === "sibling") {
        // Untuk saudara, tambahkan relasi timbal balik
        await tx.insert(userFamily).values({
          userId: relatedUserId,
          relatedUserId: userId,
          relationType: "sibling",
        });
      } else if (relationType === "spouse") {
        // Tambahan: untuk pasangan, bisa ditambahkan logika khusus jika diperlukan
        await tx.insert(userFamily).values({
          userId: relatedUserId,
          relatedUserId: userId,
          relationType: "spouse",
        });
      }
    });

    return {
      success: true,
      message: "Relasi keluarga berhasil ditambahkan",
    };
  } catch (error) {
    console.error("Gagal menambahkan relasi keluarga:", error);
    
    return {
      success: false,
      error: "ERROR_MESSAGES.TRANSACTION_FAILED",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
};