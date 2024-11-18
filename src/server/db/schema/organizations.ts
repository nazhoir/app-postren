import { index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { baseColumns, createTable, STRING_LENGTHS } from "./etc";
import { nanoid } from "@/lib/nanoid";
import { users } from "./users";
import { institutions } from "./institutions";
import { relations } from "drizzle-orm";

export const organizations = createTable(
  "organization",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid(10)),
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
    createdBy: varchar("created_by", { length: STRING_LENGTHS.ID }).references(
      () => users.id,
    ),
    ...baseColumns,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.organizationId] }),
    createdByIdx: index("users_to_organizations_created_by_idx").on(
      table.createdBy,
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
    createdByUser: one(users, {
      fields: [organizationUsers.createdBy],
      references: [users.id],
    }),
  }),
);
