import { relations } from "drizzle-orm";
import { index, text, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/generate-id";
import { baseColumns, createTable, STRING_LENGTHS } from "../core/base";
import { organizations } from "../organization/organizations";
import { institutionStudents } from "./institution-students";

export const institutions = createTable(
  "institution",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: STRING_LENGTHS.NAME }).notNull(),
    shortname: varchar("shortname", {
      length: STRING_LENGTHS.SHORTNAME,
    }).unique(),
    image: varchar("image", { length: STRING_LENGTHS.URL }),
    type: varchar("type", { length: STRING_LENGTHS.TYPE }),
    organizationId: varchar("organization_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),
    statistic: text("statistic"),
    statisticType: varchar("statistic_type", { length: STRING_LENGTHS.TYPE }),
    ...baseColumns,
  },
  (table) => ({
    nameIdx: index("institution_name_idx").on(table.name),
    shortnameIdx: index("institution_shortname_idx").on(table.shortname),
    orgIdx: index("institution_org_idx").on(table.organizationId),
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
