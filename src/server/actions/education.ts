"use server";

import {
  CreateEducationHistorySchema,
  type CreateEducationHistory,
} from "@/schema/education";
import { db } from "../db";
import { educationHistories } from "../db/schema";

export const createEducationHistory = async (
  values: CreateEducationHistory,
) => {
  const validatedFields = CreateEducationHistorySchema.safeParse(values);

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

  const { durationMinutes, ...data } = validatedFields.data;
  try {
    await db.transaction(async (tx) => {
      await tx.insert(educationHistories).values({
        ...data,
        durationMinutes: String(durationMinutes),
      });
    });

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
        code: "FAILED",
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
