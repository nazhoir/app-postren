import {
  decimal,
  integer,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  baseColumns,
  createTable,
  STRING_LENGTHS,
  TIMESTAMP_CONFIG,
} from "../core/base";
import { nanoid } from "@/lib/generate-id";
import { organizations } from "../organization/organizations";
import { relations } from "drizzle-orm";
import { billingItemStatus } from "../core/enums";
import { users } from "../identity/users";

// Billing item untuk organisasi
export const organizationBillingItems = createTable("org_billing_items", {
  id: varchar("id", { length: STRING_LENGTHS.ID })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  organizationId: varchar("org_id", { length: STRING_LENGTHS.ID })
    .references(() => organizations.id)
    .notNull(),
  name: varchar("name", { length: 255 }) // Tambahkan panjang maksimum
    .notNull(),
  amount: decimal("amount", {
    precision: 20,
    scale: 2, // Support 2 decimal places
  }).notNull(),
  status: billingItemStatus().notNull().default("active"),
  createdBy: varchar("created_by", { length: STRING_LENGTHS.ID })
    .notNull()
    .references(() => users.id),
  ...baseColumns,
});

// User bill untuk tracking tagihan individual
export const userBill = createTable(
  "user_bill",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .unique()
      .$defaultFn(() => nanoid()),
    billId: varchar("bill_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizationBillingItems.id),
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    amount: decimal("amount", {
      precision: 20,
      scale: 2,
    }),
    discount: decimal("discount", {
      precision: 20,
      scale: 2,
    }),
    amountPaid: decimal("amount_paid", {
      precision: 20,
      scale: 2,
    }),
    quantity: integer().notNull().default(1),
    note: varchar(),
    createdBy: varchar("created_by", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    ...baseColumns,
  },
  (table) => {
    return {
      pkUserBill: primaryKey({
        name: "pk_user_id_bill_id",
        columns: [table.billId, table.userId],
      }),
    };
  },
);

// Transaksi untuk user bill
export const userBillPayments = createTable("user_bill_payment", {
  id: varchar("id", { length: STRING_LENGTHS.ID })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid(32).toUpperCase()),

  createdBy: varchar("created_by", { length: STRING_LENGTHS.ID })
    .notNull()
    .references(() => users.id),

  billId: varchar("bill_id", { length: STRING_LENGTHS.ID })
    .notNull()
    .references(() => userBill.id),
  userId: varchar("user_id", { length: STRING_LENGTHS.ID })
    .notNull()
    .references(() => users.id),
  amount: decimal("amount", {
    precision: 20,
    scale: 2,
  }).notNull(), // Tambahkan notNull

  date: timestamp("date", TIMESTAMP_CONFIG).notNull().defaultNow(),

  ...baseColumns,
});

// Relasi untuk billing items
export const organizationBillingItemsRelation = relations(
  organizationBillingItems,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [organizationBillingItems.organizationId],
      references: [organizations.id],
    }),
    userBills: many(userBill),
  }),
);

// Relasi untuk user bill
export const userBillRelation = relations(userBill, ({ one, many }) => ({
  item: one(organizationBillingItems, {
    fields: [userBill.billId],
    references: [organizationBillingItems.id],
  }),
  user: one(users, {
    fields: [userBill.userId],
    references: [users.id],
  }),
  payments: many(userBillPayments),
}));

export const userBillPaymentsRelation = relations(
  userBillPayments,
  ({ one }) => ({
    user: one(users, {
      fields: [userBillPayments.userId],
      references: [users.id],
    }),
    bill: one(userBill, {
      fields: [userBillPayments.billId],
      references: [userBill.billId],
    }),
    createdBy: one(users, {
      fields: [userBillPayments.createdBy],
      references: [users.id],
    }),
  }),
);
