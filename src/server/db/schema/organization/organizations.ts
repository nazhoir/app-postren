import { relations } from "drizzle-orm";
import {
  index,
  primaryKey,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/generate-id";
import { baseColumns, createTable, STRING_LENGTHS } from "../core/base";
import { users } from "../identity/users";
import { institutions } from "../institution/institutions";
import { cardID } from "../identity/cards";
import { organizationBillingItems } from "../finance/billings";
import { organizationCashflow } from "../finance/cashflow";

// Definisi tabel organisasi
export const organizations = createTable(
  "organization",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    name: varchar("name", { length: STRING_LENGTHS.NAME }).notNull(),

    type: varchar("type", { length: STRING_LENGTHS.TYPE }).notNull(),

    isActive: boolean("is_active").notNull().default(true), // Tambahkan status aktif

    ...baseColumns,
  },
  (table) => ({
    nameIdx: index("org_name_idx").on(table.name),
    typeIdx: index("org_type_idx").on(table.type),
    activeIdx: index("org_active_idx").on(table.isActive), // Indeks untuk status aktif
  }),
);

// Tabel hubungan antara pengguna dan organisasi
export const organizationUsers = createTable(
  "org_users",
  {
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),

    organizationId: varchar("org_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),

    invitedBy: varchar("created_by", { length: STRING_LENGTHS.ID }).references(
      () => users.id,
    ),

    isActive: boolean("is_active").notNull().default(true), // Status keanggotaan

    joinedAt: timestamp("joined_at").defaultNow(), // Waktu bergabung

    ...baseColumns,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.organizationId] }),
    invitedByIdx: index("users_to_orgs_created_by_idx").on(table.invitedBy),
    activeIdx: index("org_users_active_idx").on(table.isActive),
  }),
);

// Tabel admin organisasi
export const organizationAdmins = createTable(
  "org_admins",
  {
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),

    organizationId: varchar("org_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),

    role: varchar("role", { length: STRING_LENGTHS.ROLE }).notNull(), // Tambahkan notNull

    isActive: boolean("is_active").notNull().default(true), // Status admin

    ...baseColumns,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.organizationId] }),
    roleIdx: index("orgs_admins_role_idx").on(table.role),
    activeIdx: index("org_admins_active_idx").on(table.isActive),
  }),
);

// Relasi untuk tabel organisasi
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(organizationUsers),
  admins: many(organizationAdmins),
  institutions: many(institutions),
  issuedCard: many(cardID),
  billItems: many(organizationBillingItems),
  cashFlow: many(organizationCashflow),
}));

// Relasi untuk tabel pengguna organisasi
export const organizationUsersRelations = relations(
  organizationUsers,
  ({ one }) => ({
    user: one(users, {
      fields: [organizationUsers.userId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [organizationUsers.organizationId],
      references: [organizations.id],
    }),
    invitedByUser: one(users, {
      fields: [organizationUsers.invitedBy],
      references: [users.id],
    }),
  }),
);
