import { z } from "zod";

export const getOrganizationEmployeesSchema = z.object({
  id: z.string(),
  name: z.string(),
  nip: z.string(),
});

export type OrganizationEmployee = z.infer<
  typeof getOrganizationEmployeesSchema
>;
