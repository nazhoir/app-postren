"use server";

import type { z } from "zod";
import { db } from "../db";
import { organizationBillingItems, userBill } from "../db/schema";
import { eq } from "drizzle-orm";
import { getOrgsIdByUserId } from "./organizations";
import {
  createOrgBillItemSchema,
  createUserBillSchema,
} from "@/schema/finance";

class OrganizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationError";
  }
}

export const createOrgBillItem = async (
  values: z.infer<typeof createOrgBillItemSchema>,
) => {
  const validatedFields = createOrgBillItemSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const data = validatedFields.data;
  try {
    const getOrgId = await getOrgsIdByUserId(data.createdBy);

    if (!getOrgId) {
      throw new OrganizationError("Organization not found");
    }

    await db.insert(organizationBillingItems).values({
      ...data,
      organizationId: getOrgId,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
};

export const getOrgBillItems = async (userId: string) => {
  const getOrgId = await getOrgsIdByUserId(userId);

  if (!getOrgId) {
    throw new OrganizationError("Organization not found");
  }

  const data = await db.query.organizationBillingItems.findMany({
    where: eq(organizationBillingItems.organizationId, getOrgId),
  });

  return data;
};

export const createUserBill = async (
  values: z.infer<typeof createUserBillSchema>,
) => {
  const validatedFields = createUserBillSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const data = validatedFields.data;
  try {
    await db.insert(userBill).values({
      ...data,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
};

interface User {
  id: string;
  name: string;
  remainingAmount: string | null;
  discount: string | null;
  duplicateCount?: number; // Menambahkan properti untuk menghitung duplikasi
}

function mergeUsersByID(users: User[]): User[] {
  // Objek untuk menyimpan jumlah duplikasi per ID
  const duplicateCountMap: Record<string, number> = {};

  // Gabungkan users dengan menghapus duplikat berdasarkan ID
  const mergedUsers = users.reduce((acc: User[], currentUser) => {
    // Hitung jumlah duplikasi
    duplicateCountMap[currentUser.id] =
      (duplicateCountMap[currentUser.id] ?? 0) + 1;

    // Cek apakah user dengan ID ini sudah ada di accumulator
    const existingUserIndex = acc.findIndex(
      (user) => user.id === currentUser.id,
    );

    if (existingUserIndex === -1) {
      // Jika user belum ada, tambahkan ke accumulator
      const newUser: User = {
        ...currentUser,
        duplicateCount: duplicateCountMap[currentUser.id],
      };
      acc.push(newUser);
    } else {
      // Jika user sudah ada, tambahkan remainingAmount
      const existingUser = acc[existingUserIndex];

      // Tambahkan remainingAmount (sebagai string)
      const totalRemaining = (
        parseFloat(existingUser!.remainingAmount!) +
        parseFloat(currentUser.remainingAmount!)
      ).toFixed(2);
      existingUser!.remainingAmount = totalRemaining;

      // Gabungkan discount
      if (existingUser!.discount === null && currentUser.discount !== null) {
        existingUser!.discount = currentUser.discount;
      } else if (
        existingUser!.discount !== null &&
        currentUser.discount !== null
      ) {
        const totalDiscount = (
          parseFloat(existingUser!.discount) + parseFloat(currentUser.discount)
        ).toFixed(2);
        existingUser!.discount = totalDiscount;
      }

      // Update duplicate count
      existingUser!.duplicateCount = duplicateCountMap[currentUser.id];
    }

    return acc;
  }, []);

  return mergedUsers;
}

export const getBillItemDetail = async (id: string) => {
  try {
    const req = await db.query.organizationBillingItems.findFirst({
      where: eq(organizationBillingItems.id, id),
      columns: {
        name: true,
        amount: true,
      },
      with: {
        userBills: {
          columns: {
            discount: true,
            // remainingAmount: true,
          },
          with: {
            payments: {
              columns: {
                amount: true,
              },
            },
            user: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!req) {
      return {
        status: "Not Found",
        data: undefined,
      };
    }
    // const users = req.userBills.map(({ user, remainingAmount, discount }) => {
    //   return {
    //     id: user.id,
    //     name: user.name,
    //     remainingAmount,
    //     discount,
    //   };
    // });

    const data = {
      ...req,
      // users: mergeUsersByID(users),
    };

    return {
      data,
      status: "success",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
};
