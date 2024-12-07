import { decimal, varchar } from "drizzle-orm/pg-core";
import { baseColumns, createTable, STRING_LENGTHS } from "../core/base";
import { nanoid } from "@/lib/generate-id";
import { users } from "../identity/users";
import { relations } from "drizzle-orm";
import { cashflowType, paymentMethod } from "../core/enums";
import { organizations } from "../organization/organizations";

export const savings = createTable("saving", {
  id: varchar("id", { length: STRING_LENGTHS.ID })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid().toUpperCase()),
  userId: varchar("user_id", { length: STRING_LENGTHS.ID })
    .references(() => users.id)
    .notNull()
    .unique(),
  orgId: varchar("org_id", { length: STRING_LENGTHS.ID })
    .references(() => organizations.id)
    .notNull()
    .unique(),
  balance: decimal().notNull(),
  maxCreditPerDay: decimal("max_transaction_perday"),
  createdBy: varchar("created_by", { length: STRING_LENGTHS.ID })
    .references(() => users.id)
    .notNull(),
  ...baseColumns,
});

export const savingCashflow = createTable("sv_cashflow", {
  id: varchar("id", { length: STRING_LENGTHS.ID })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid(18).toUpperCase()),
  name: varchar("name", { length: 32 }).notNull(),
  createdBy: varchar("created_by", { length: STRING_LENGTHS.ID })
    .references(() => users.id)
    .notNull(),
  savingId: varchar("saving_id", { length: STRING_LENGTHS.ID })
    .references(() => savings.id)
    .notNull(),
  type: cashflowType().notNull(),
  amount: decimal().notNull(),
  note: varchar("note", { length: 46 }),
  paymentMethod: paymentMethod("payment_method"),
  paymentNote: varchar("payment_note", { length: 46 }),
  ...baseColumns,
});

export const savingRelations = relations(savings, ({ one, many }) => ({
  user: one(users, {
    references: [users.id],
    fields: [savings.userId],
  }),
  cashflow: many(savingCashflow),
  createdBy: one(users, {
    references: [users.id],
    fields: [savings.createdBy],
  }),
}));

export const savingCashflowRelatiosn = relations(savingCashflow, ({ one }) => ({
  saving: one(savings, {
    references: [savings.id],
    fields: [savingCashflow.savingId],
  }),

  createdBy: one(users, {
    references: [users.id],
    fields: [savingCashflow.createdBy],
  }),
}));
