import { index, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { baseColumns, createTable, STRING_LENGTHS } from "./etc";
import { nanoid } from "@/lib/nanoid";
import { students } from "./students";
import { relations } from "drizzle-orm";
import { organizations } from "./organizations";

// Institutions table dengan optimasi
export const institutions = createTable(
  "institution",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid(10)),
    name: varchar("name", { length: STRING_LENGTHS.NAME }).notNull(),
    shortname: varchar("shortname", {
      length: STRING_LENGTHS.SHORTNAME,
    }).unique(),
    image: varchar("image", { length: STRING_LENGTHS.URL }),
    type: varchar("type", { length: STRING_LENGTHS.TYPE }),
    organizationId: varchar("organization_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),
    statistic: text("statistic"), // Changed to text for flexible JSON storage
    statisticType: varchar("statistic_type", { length: STRING_LENGTHS.TYPE }),
    ...baseColumns,
  },
  (table) => ({
    nameIdx: index("institution_name_idx").on(table.name),
    shortnameIdx: index("institution_shortname_idx").on(table.shortname),
    orgIdx: index("institution_org_idx").on(table.organizationId),
  }),
);

export const institutionStudents = createTable(
  "institution_students",
  {
    studentId: varchar("student_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => students.userId),
    institutionId: varchar("institution_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => institutions.id),
    nisLocal: varchar("nis_local", { length: STRING_LENGTHS.NIS }).unique(),
    ...baseColumns,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.studentId, table.institutionId] }),
    nisLocalIdx: index("students_institutions_nis_local_idx").on(
      table.nisLocal,
    ),
  }),
);

export const institutionsRelations = relations(
  institutions,
  ({ many, one }) => ({
    students: many(institutionStudents),
    organization: one(organizations, {
      fields: [institutions.organizationId],
      references: [organizations.id],
    }),
  }),
);

export const institutionStudentsRelations = relations(
  institutionStudents,
  ({ one }) => ({
    student: one(students, {
      fields: [institutionStudents.studentId],
      references: [students.userId],
    }),
    institution: one(institutions, {
      fields: [institutionStudents.institutionId],
      references: [institutions.id],
    }),
  }),
);
