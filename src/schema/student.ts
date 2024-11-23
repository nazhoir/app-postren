import { z } from "zod";

export const getOrganizationStudentsSchema = z.object({
  id: z.string(),
  name: z.string(),
  nisn: z.string().optional().nullable(),
  image: z.string(),
  active: z.boolean().optional(),
  organizationId: z.string(),
  institutions: z
    .array(
      z.object({
        name: z.string(),
        educationalUnit: z.object({
          shortName: z.string().nullable().optional(),
          fullName: z.string(),
        }),
      }),
    )
    .nullable()
    .optional(),
});

export const AddOrganizationStudentSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  invitedBy: z.string(),
  nisn: z.string(),
});

export type OrganizationStudent = z.infer<typeof getOrganizationStudentsSchema>;

export const getStudentProfilePersonalIdentitySchema = z.object({
  nisn: z.string().nullable().optional(),
  nisnVerified: z.date().nullable().optional(),
  citizenship: z.string().nullable().optional(),
  nik: z.string().nullable().optional(),
  nikVerified: z.date().nullable().optional(),
  birthDate: z.date().nullable().optional(),
  birthPlace: z.string().nullable().optional(),
});

export type StudentProfilePersonalIdentity = z.infer<
  typeof getStudentProfilePersonalIdentitySchema
>;
