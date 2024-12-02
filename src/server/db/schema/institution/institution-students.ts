import { relations } from "drizzle-orm";
import { date, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { baseColumns, createTable, STRING_LENGTHS } from "../core/base";
import { students } from "../organization/students";
import { institutions } from "./institutions";

export const institutionStudents = createTable(
  "inst_students",
  {
    studentId: varchar("student_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => students.id),
    institutionId: varchar("inst_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => institutions.id),
    nisLocal: varchar("nis_local", { length: STRING_LENGTHS.NIS }).unique(),
    joiningDate: date("joining_date"),
    ...baseColumns,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.studentId, table.institutionId] }),
    nisLocalIdx: index("students_insts_nis_local_idx").on(table.nisLocal),
  }),
);

export const institutionStudentsRelations = relations(
  institutionStudents,
  ({ one }) => ({
    student: one(students, {
      fields: [institutionStudents.studentId],
      references: [students.id],
    }),
    institution: one(institutions, {
      fields: [institutionStudents.institutionId],
      references: [institutions.id],
    }),
  }),
);
