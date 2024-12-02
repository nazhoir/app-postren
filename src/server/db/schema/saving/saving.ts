import { decimal, varchar } from "drizzle-orm/pg-core";
import { baseColumns, createTable, STRING_LENGTHS } from "../core/base";
import { nanoid } from "@/lib/generate-id";
import { users } from "../identity/users";
import { relations } from "drizzle-orm";
import { cashflowType } from "../core/enums";

export const savings = createTable("saving", {
  id: varchar("id", { length: STRING_LENGTHS.ID })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid().toUpperCase()),
  userId: varchar("user_id", { length: STRING_LENGTHS.ID })
    .references(() => users.id)
    .notNull()
    .unique(),
  balance: decimal().notNull(),
  maxCreditPerDay: decimal("max_transaction_perday"),
  createdBy: varchar()
    .references(() => users.id)
    .notNull(),
  ...baseColumns,
});

export const savingCashflow = createTable("sv_cashflow", {
  id: varchar("id", { length: STRING_LENGTHS.ID })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid(18).toUpperCase()),
  name: varchar("name", { length: 46 }).notNull(),
  createdBy: varchar("created_by", { length: STRING_LENGTHS.ID })
    .references(() => users.id)
    .notNull(),
  savingId: varchar("saving_id", { length: STRING_LENGTHS.ID })
    .references(() => savings.id)
    .notNull(),
  type: cashflowType().notNull(),
  amount: decimal().notNull(),
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

export const savingCashflowRelatiosn = relations(
  savingCashflow,
  ({ one, many }) => ({
    saving: one(savings, {
      references: [savings.id],
      fields: [savingCashflow.savingId],
    }),

    createdBy: one(users, {
      references: [users.id],
      fields: [savingCashflow.createdBy],
    }),
  }),
);
