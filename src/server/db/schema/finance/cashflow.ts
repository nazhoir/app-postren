import { decimal, text, timestamp, varchar } from "drizzle-orm/pg-core";
import {
  baseColumns,
  createTable,
  STRING_LENGTHS,
  TIMESTAMP_CONFIG,
} from "../core/base";
import { nanoid } from "@/lib/generate-id";
import { organizations } from "../organization/organizations";
import { relations } from "drizzle-orm";
import { users } from "../identity/users";
import { cashflowType } from "../core/enums";

export const organizationCashflow = createTable("org_cashflow", {
  id: varchar("id", { length: STRING_LENGTHS.ID })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),

  organizationId: varchar("org_id", { length: STRING_LENGTHS.ID })
    .references(() => organizations.id)
    .notNull(),

  name: varchar("name", { length: 255 }) // Tambahkan panjang maksimum
    .notNull(),

  type: cashflowType().notNull(),

  amount: decimal("amount", {
    precision: 20,
    scale: 2, // Support 2 decimal places
  }).notNull(),

  note: text(), // Eksplisit nullable

  date: timestamp("date", TIMESTAMP_CONFIG).notNull().defaultNow(),

  createdBy: varchar("created_by", { length: STRING_LENGTHS.ID })
    .notNull()
    .references(() => users.id),

  ...baseColumns,
});

// Relasi untuk cashflow
export const organizationCashflowRelation = relations(
  organizationCashflow,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationCashflow.organizationId],
      references: [organizations.id],
    }),
    createdByUser: one(users, {
      fields: [organizationCashflow.createdBy],
      references: [users.id],
    }),
  }),
);
