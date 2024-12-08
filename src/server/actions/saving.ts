"use server";
import {
  RegistrationUserSavingSchema,
  CashflowSavingAccountSchema,
} from "@/schema/saving";
import { type z } from "zod";
import { db } from "../db";
import { and, eq, gte } from "drizzle-orm";
import { users } from "../db/schema";
import { savingCashflow, savings } from "../db/schema/saving/saving";
import { getOrgsIdByUserId } from "./organizations";

// Custom error class for saving account operations
class SavingAccountError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "SavingAccountError";
  }
}

// Error code constants
const ERROR_CODES = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  SAVING_ACCOUNT_NOT_FOUND: "SAVING_ACCOUNT_NOT_FOUND",
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  INVALID_AMOUNT: "INVALID_AMOUNT",
  INVALID_TRANSACTION_TYPE: "INVALID_TRANSACTION_TYPE",
  REGISTRATION_FAILED: "REGISTRATION_FAILED",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  MAX_CREDIT_EXCEEDED: "MAX_CREDIT_EXCEEDED",
};

// Response type for consistent error handling
interface OperationResult {
  success: boolean;
  data?: unknown;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Registers a new saving account for a user
 * @param values Registration details for the saving account
 * @returns Operation result with saving account details or error
 */
export const registrationUserSavingAccount = async (
  values: z.infer<typeof RegistrationUserSavingSchema>,
): Promise<OperationResult> => {
  // Validate input
  const validatedFields = RegistrationUserSavingSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input fields",
        details: validatedFields.error.flatten().fieldErrors,
      },
    };
  }

  const { nik, createdBy, balance } = validatedFields.data;

  try {
    // Convert and validate balance
    const numericBalance = Number(balance);
    if (isNaN(numericBalance) || numericBalance < 0) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.INVALID_AMOUNT,
          message: "Invalid balance amount",
        },
      };
    }

    // Find user by NIK
    const user = await db.query.users.findFirst({
      where: eq(users.nik, nik),
      columns: {
        id: true,
        name: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.USER_NOT_FOUND,
          message: "User not found with the provided NIK",
        },
      };
    }

    const orgId = await getOrgsIdByUserId(user.id);
    if (!orgId) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.USER_NOT_FOUND,
          message: "User not found with the provided NIK",
        },
      };
    }

    let savingAccountId: string | undefined;

    // Use transaction to ensure data consistency
    await db.transaction(async (tx) => {
      // Insert saving account
      const [savedSaving] = await tx
        .insert(savings)
        .values({
          createdBy,
          balance,
          userId: user.id,
          orgId: orgId,
        })
        .returning({
          id: savings.id,
        });

      savingAccountId = savedSaving?.id;

      // Insert initial cashflow record
      await tx.insert(savingCashflow).values({
        savingId: savingAccountId!,
        createdBy,
        type: "debit",
        amount: balance,
        name: "Deposit",
      });
    });

    return {
      success: true,
      data: { savingAccountId },
      error: undefined,
    };
  } catch (error) {
    console.error("Error in registering user saving account:", error);

    return {
      success: false,
      error: {
        code: ERROR_CODES.REGISTRATION_FAILED,
        message: "Failed to register saving account",
        details:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : undefined,
      },
    };
  }
};

/**
 * Processes a transaction for a user's saving account
 * @param values Transaction details
 * @returns Operation result of the transaction
 */
export const transactionUserSavingAccount = async (
  values: z.infer<typeof CashflowSavingAccountSchema>,
) => {
  // Validate input
  const validatedFields = CashflowSavingAccountSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input fields",
        details: validatedFields.error.flatten().fieldErrors,
      },
    };
  }

  const {
    createdBy,
    userId,
    amount,
    type,
    name,
    paymentMethod,
    paymentNote,
    note,
  } = validatedFields.data;

  try {
    const admin = await db.query.users.findFirst({
      where: eq(users.id, createdBy),
      columns: {
        id: true,
        name: true,
      },
    });

    if (!admin) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.USER_NOT_FOUND,
          message: "Admin ID invalid",
        },
      };
    }
    // Validate transaction type
    if (type !== "credit" && type !== "debit") {
      return {
        success: false,
        error: {
          code: ERROR_CODES.INVALID_TRANSACTION_TYPE,
          message: "Invalid transaction type",
        },
      };
    }

    // Validate and convert amount
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.INVALID_AMOUNT,
          message: "Invalid transaction amount",
        },
      };
    }

    // Find user's saving account
    const sv = await db.query.savings.findFirst({
      where: eq(savings.userId, userId),
      columns: {
        id: true,
        balance: true,
        maxCreditPerDay: true,
      },
      with: {
        user: {
          columns: {
            name: true,
          },
        },
      },
    });

    if (!sv) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.SAVING_ACCOUNT_NOT_FOUND,
          message: "Saving account not found",
        },
      };
    }

    const currentBalance = Number(sv.balance);

    // Check for sufficient balance for credit transactions
    if (type === "credit" && numericAmount > currentBalance) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.INSUFFICIENT_BALANCE,
          message: "Saldo tidak mencukupi",
        },
      };
    }

    const maxCreditPerDay = sv.maxCreditPerDay
      ? Number(sv.maxCreditPerDay)
      : null;

    // Check max credit per day for credit transactions
    if (type === "credit" && maxCreditPerDay !== null) {
      // Get total credit amount for today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayDebitTotal = await db.query.savingCashflow.findMany({
        where: and(
          eq(savingCashflow.savingId, sv.id),
          eq(savingCashflow.type, "credit"),
          gte(savingCashflow.createdAt, todayStart),
        ),
        columns: {
          amount: true,
        },
      });

      const totalDebitToday = todayDebitTotal.reduce(
        (sum, record) => sum + Number(record.amount),
        0,
      );

      // Check if adding this transaction would exceed max credit per day
      if (totalDebitToday + numericAmount > maxCreditPerDay) {
        return {
          success: false,
          error: {
            code: ERROR_CODES.MAX_CREDIT_EXCEEDED,
            message: `Melebihi batas kuota pengeluaran harian`,
          },
        };
      }
    }

    // Calculate new balance
    const newBalance =
      type === "debit"
        ? currentBalance + numericAmount
        : currentBalance - numericAmount;

    let cashflowRecordId: string | undefined;
    let cashflowRecordDate: Date | undefined;

    // Use transaction to ensure atomicity
    await db.transaction(async (tx) => {
      // Insert cashflow record
      const [cashflowRecord] = await tx
        .insert(savingCashflow)
        .values({
          createdBy,
          savingId: sv.id,
          amount,
          type,
          name,
          paymentMethod,
          paymentNote,
          note,
        })
        .returning({
          id: savingCashflow.id,
          createdAt: savingCashflow.createdAt,
        });

      cashflowRecordId = cashflowRecord?.id;
      cashflowRecordDate = cashflowRecord?.createdAt;

      // Update saving account balance
      await tx
        .update(savings)
        .set({
          balance: newBalance.toString(),
        })
        .where(eq(savings.id, sv.id));
    });

    const data = {
      id: cashflowRecordId,
      type,
      name,
      amount,
      createdAt: cashflowRecordDate,
      balance: newBalance,
      createdBy: admin,
      user: {
        id: userId,
        name: sv.user.name,
      },
    };

    return {
      success: true,
      data,
      error: undefined,
    };
  } catch (error) {
    console.error("Error in processing saving account transaction:", error);

    return {
      success: false,
      error: {
        code: ERROR_CODES.TRANSACTION_FAILED,
        message: "Failed to process saving transaction",
        details:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : undefined,
      },
    };
  }
};

export const searchSavingAccount = async (userId: string) => {
  // Validate input
  if (!userId) {
    throw new SavingAccountError(
      ERROR_CODES.USER_NOT_FOUND,
      "User ID is required",
    );
  }

  try {
    // Find saving account with related information
    const data = await db.query.savings.findFirst({
      where: eq(savings.userId, userId),
      columns: {
        id: true,
      },
    });

    if (!data) return null;

    return data;
  } catch (error) {
    console.error(`Error fetching saving account for user ${userId}:`, error);

    throw new SavingAccountError(
      ERROR_CODES.SAVING_ACCOUNT_NOT_FOUND,
      "Failed to retrieve saving account information",
      error instanceof Error ? { message: error.message } : undefined,
    );
  }
};

/**
 * Retrieves user's saving account information
 * @param userId ID of the user
 * @returns Saving account details or null
 */
export const getUserSavingAccountInfo = async (userId: string) => {
  if (!userId || typeof userId !== "string") {
    throw new SavingAccountError(
      ERROR_CODES.USER_NOT_FOUND,
      "Valid User ID is required",
    );
  }

  try {
    // Find saving account with related information
    const data = await db.query.savings.findFirst({
      where: eq(savings.userId, userId),
      with: {
        user: true, // Include user details
        cashflow: {
          orderBy: (cashflow, { desc }) => [desc(cashflow.createdAt)],
        },
      },
    });

    if (!data) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCashflow = {
      today: { credit: 0, debit: 0 },
      total: { credit: 0, debit: 0 },
    };

    if (Array.isArray(data.cashflow)) {
      for (const flow of data.cashflow) {
        const flowDate = new Date(flow.createdAt);
        flowDate.setHours(0, 0, 0, 0);

        const amount = Number(flow.amount);
        if (flow.type === "credit") {
          todayCashflow.total.credit += amount;
          if (flowDate.getTime() === today.getTime()) {
            todayCashflow.today.credit += amount;
          }
        } else if (flow.type === "debit") {
          todayCashflow.total.debit += amount;
          if (flowDate.getTime() === today.getTime()) {
            todayCashflow.today.debit += amount;
          }
        }
      }
    }

    const { cashflow, ...savingDetails } = data;

    const result = {
      ...savingDetails,
      todayCashflow,
      cashflow,
    };
    return result;
  } catch (error) {
    console.error(`Error fetching saving account for user ${userId}:`, error);

    throw new SavingAccountError(
      ERROR_CODES.SAVING_ACCOUNT_NOT_FOUND,
      "Failed to retrieve saving account information",
      error instanceof Error ? { message: error.message } : undefined,
    );
  }
};

export const getOrgSavingCashflowReport = async (orgId: string) => {
  try {
    const req = await db.query.savings.findMany({
      where: eq(savings.orgId, orgId),
      columns: {},
      with: {
        user: {
          columns: {
            id: true,
            name: true,
          },
        },
        cashflow: true,
      },
    });

    const result = req.flatMap(({ cashflow, user }) =>
      cashflow.map((casflow) => ({
        ...casflow,
        user,
      })),
    );

    return result;
  } catch (error) {
    // Log the full error for internal debugging
    console.error(
      `Error fetching saving cashflow report for organization ${orgId}:`,
      error,
    );

    // Throw a structured error with detailed information
    throw new SavingAccountError(
      ERROR_CODES.SAVING_ACCOUNT_NOT_FOUND,
      "Failed to retrieve saving cashflow report information",
      {
        orgId,
        errorDetails:
          error instanceof Error
            ? {
                message: error.message,
                name: error.name,
                stack: error.stack,
              }
            : { message: "Unknown error occurred" },
      },
    );
  }
};
