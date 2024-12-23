import {
  educationDegreePositions,
  educationTypes,
  formalEducationLevels,
  schoolTypes,
  trainingTypes,
} from "@/server/db/schema";
import { z } from "zod";

// Skema Zod untuk enum
export const EducationTypeSchema = z.enum(educationTypes.enumValues);

export const FormalEducationLevelSchema = z.enum(
  formalEducationLevels.enumValues,
);

export const SchoolTypeSchema = z.enum(schoolTypes.enumValues);

export const TrainingTypeSchema = z.enum(trainingTypes.enumValues);

export const DegreePositionSchema = z.enum(educationDegreePositions.enumValues);

// Skema Zod untuk riwayat pendidikan
export const EducationHistorySchema = z.object({
  // Kolom wajib
  id: z.string().max(255),
  userId: z.string().max(255),
  createdBy: z.string().max(255),
  educationType: EducationTypeSchema,

  // Kolom untuk pendidikan formal (opsional)
  formalEducationLevel: FormalEducationLevelSchema.optional(),
  schoolName: z.string().max(255).optional(),
  major:z.string(),
  schoolType: SchoolTypeSchema.optional(),
  schoolAddress: z.string().optional(),
  entryYear: z.string().length(4).optional(),
  graduationYear: z.string().length(4).optional(),
  averageValue: z.string().optional(),
  diplomaDate: z.string().optional(),
  diplomaNumber: z.string().max(255).optional(),
  degreePosition: DegreePositionSchema.optional(),
  degree: z.string().max(100),
  degreeCode: z.string().max(10),

  // Kolom untuk pendidikan non-formal (kursus/pelatihan)
  trainingName: z.string().max(255).optional(),
  trainingType: TrainingTypeSchema.optional(),
  organizer: z.string().max(255).optional(),
  trainingLocation: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  durationMinutes: z.number().optional(),
  certificateNumber: z.string().max(255).optional(),
  certificateDate: z.string().optional(),

  // Kolom tambahan
  isCompleted: z.boolean().default(false),
  attachment: z.string(),

  // Base columns (sesuaikan dengan definisi base columns Anda)
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

// Skema untuk create dan update
export const CreateEducationHistorySchema = EducationHistorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).extend({
  // Tambahkan validasi khusus untuk create
  id: z.string().optional(),
});

export const UpdateEducationHistorySchema =
  CreateEducationHistorySchema.partial();

// Type inference
export type EducationHistory = z.infer<typeof EducationHistorySchema>;
export type CreateEducationHistory = z.infer<
  typeof CreateEducationHistorySchema
>;
export type UpdateEducationHistory = z.infer<
  typeof UpdateEducationHistorySchema
>;
