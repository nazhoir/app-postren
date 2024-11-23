import { relations } from "drizzle-orm";
import { date, index, varchar } from "drizzle-orm/pg-core";
import { baseColumns, createTable, STRING_LENGTHS } from "../core/base";
import { users } from "../identity/users";
import { organizations } from "./organizations";
import { institutionStudents } from "../institution/institution-students";

export const students = createTable(
  "student",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id)
      .primaryKey(),
    organizationId: varchar("organization_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),
    nisn: varchar("nisn", { length: STRING_LENGTHS.NIS }).notNull().unique(),
    invitedBy: varchar("created_by", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    joiningDate: date("joining_date"),
    ...baseColumns,
  },
  (table) => ({
    nisnIdx: index("student_nisn_idx").on(table.nisn),
    orgIdx: index("student_org_idx").on(table.organizationId),
  }),
);

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.id],
    references: [users.id],
    relationName: "user_student",
  }),
  institutions: many(institutionStudents),
  organization: one(organizations, {
    fields: [students.organizationId],
    references: [organizations.id],
  }),
  invitedByUser: one(users, {
    fields: [students.invitedBy],
    references: [users.id],
  }),
}));
