import { relations } from "drizzle-orm";
import { index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/generate-id";
import { baseColumns, createTable, STRING_LENGTHS } from "../core/base";
import { users } from "../identity/users";
import { institutions } from "../institution/institutions";
import { cardID } from "../identity/cards";

export const organizations = createTable(
  "organization",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: STRING_LENGTHS.NAME }).notNull(),
    type: varchar("type", { length: STRING_LENGTHS.TYPE }).notNull(),
    ...baseColumns,
  },
  (table) => ({
    nameIdx: index("organization_name_idx").on(table.name),
    typeIdx: index("organization_type_idx").on(table.type),
  }),
);

export const organizationUsers = createTable(
  "organizations_users",
  {
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    organizationId: varchar("organization_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),
    invitedBy: varchar("created_by", { length: STRING_LENGTHS.ID }).references(
      () => users.id,
    ),
    ...baseColumns,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.organizationId] }),
    invitedByIdx: index("users_to_organizations_created_by_idx").on(
      table.invitedBy,
    ),
  }),
);

export const organizationAdmins = createTable(
  "organizations_admins",
  {
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    organizationId: varchar("organization_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),
    role: varchar("role", { length: STRING_LENGTHS.ROLE }),
    ...baseColumns,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.organizationId] }),
    roleIdx: index("organizations_admins_role_idx").on(table.role),
  }),
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(organizationUsers),
  admins: many(organizationAdmins),
  institutions: many(institutions),
  issuedCard: many(cardID),
}));

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
