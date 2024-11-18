import { index, varchar } from "drizzle-orm/pg-core";
import { baseColumns, createTable, STRING_LENGTHS } from "./etc";
import { users } from "./users";
import { organizations } from "./organizations";
import { relations } from "drizzle-orm";
import { institutionStudents } from "./institutions";

// Students table dengan optimasi
export const students = createTable(
  "student",
  {
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id)
      .primaryKey(),
    organizationId: varchar("organization_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),
    nisn: varchar("nisn", { length: STRING_LENGTHS.NIS }).notNull().unique(),
    createdBy: varchar("created_by", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    ...baseColumns,
  },
  (table) => ({
    nisnIdx: index("student_nisn_idx").on(table.nisn),
    orgIdx: index("student_org_idx").on(table.organizationId), // Added for better query performance
  }),
);

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, { fields: [students.userId], references: [users.id] }),
  institutions: many(institutionStudents),
  organization: one(organizations, {
    fields: [students.organizationId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [students.createdBy],
    references: [users.id],
  }),
}));
