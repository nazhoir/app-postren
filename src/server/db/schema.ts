import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

// Optimize timestamp columns by using a more efficient format
const baseColumns = {
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
};

// Simplified table creator
const createTable = pgTableCreator((name) => `p_${name}`);

// Optimize string lengths based on actual needs
const STRING_LENGTHS = {
  ID: 36, // UUID length
  EMAIL: 255,
  NAME: 255,
  USERNAME: 50,
  PASSWORD: 255, // bcrypt hash length
  URL: 255,
  ROLE: 255,
  TOKEN: 255,
  NIS: 20,
} as const;

// Users table with optimized column sizes
export const users = createTable(
  "user",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: STRING_LENGTHS.NAME }),
    username: varchar("username", { length: STRING_LENGTHS.USERNAME }).unique(),
    email: varchar("email", { length: STRING_LENGTHS.EMAIL }).unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    password: varchar("password", { length: STRING_LENGTHS.PASSWORD }),
    image: varchar("image", { length: STRING_LENGTHS.URL }),
    ...baseColumns,
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    usernameIdx: index("user_username_idx").on(table.username),
  }),
);

// Students table with optimized NISN length
export const students = createTable(
  "student",
  {
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id)
      .primaryKey(),
    nisn: varchar("nisn", { length: STRING_LENGTHS.NIS }).notNull().unique(),
    ...baseColumns,
  },
  (table) => ({
    nisnIdx: index("student_nisn_idx").on(table.nisn),
  }),
);

// Institutions table with optimized column sizes
export const institutions = createTable(
  "institution",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: STRING_LENGTHS.NAME }).notNull(),
    shortname: varchar("shortname", { length: STRING_LENGTHS.NIS }).unique(),
    image: varchar("image", { length: STRING_LENGTHS.URL }),
    type: varchar("type", { length: 255 }),
    organizationId: varchar("organization_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),
    statistic: varchar("", { length: 255 }),
    statisticType: varchar("", { length: 255 }),
    ...baseColumns,
  },
  (table) => ({
    nameIdx: index("institution_name_idx").on(table.name),
    shortnameIdx: index("institution_shortname_idx").on(table.shortname),
  }),
);

// Junction table with optimized column sizes
export const studentsToInstitutions = createTable(
  "students_institutions",
  {
    studentId: varchar("student_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => students.userId),
    institutionId: varchar("institution_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => institutions.id),
    nisLocal: varchar("nis_local", { length: STRING_LENGTHS.NIS })
      .notNull()
      .unique(),
    ...baseColumns,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.studentId, table.institutionId] }),
    nisLocalIdx: index("students_institutions_nis_local_idx").on(
      table.nisLocal,
    ),
  }),
);

// Organizations table with optimized column sizes
export const organizations = createTable(
  "organization",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: STRING_LENGTHS.NAME }).notNull(),
    type: varchar("type", { length: STRING_LENGTHS.ROLE }).notNull(),
    ...baseColumns,
  },
  (table) => ({
    nameIdx: index("organization_name_idx").on(table.name),
    typeIdx: index("organization_type_idx").on(table.type),
  }),
);

// Junction table for users and organizations with optimized column sizes
export const usersToOrganizations = createTable(
  "users_to_organizations",
  {
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    organizationId: varchar("organization_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),
    ...baseColumns,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.organizationId] }),
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

// OAuth accounts table with optimized column sizes
export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: STRING_LENGTHS.ROLE })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: STRING_LENGTHS.ROLE }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: STRING_LENGTHS.ID,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: STRING_LENGTHS.ROLE }),
    scope: varchar("scope", { length: STRING_LENGTHS.NAME }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: STRING_LENGTHS.NAME }),
    ...baseColumns,
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

// Sessions table with optimized column sizes
export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: STRING_LENGTHS.TOKEN })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    ...baseColumns,
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

// Verification tokens table with optimized column sizes
export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", {
      length: STRING_LENGTHS.EMAIL,
    }).notNull(),
    token: varchar("token", { length: STRING_LENGTHS.TOKEN }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    ...baseColumns,
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// Relations definitions
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  organizations: many(usersToOrganizations),
  admins: many(organizationAdmins),
  student: many(students),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, { fields: [students.userId], references: [users.id] }),
  institutions: many(studentsToInstitutions),
}));

export const institutionsRelations = relations(institutions, ({ many }) => ({
  students: many(studentsToInstitutions),
}));

export const studentsToInstitutionsRelations = relations(
  studentsToInstitutions,
  ({ one }) => ({
    student: one(students, {
      fields: [studentsToInstitutions.studentId],
      references: [students.userId],
    }),
    institution: one(institutions, {
      fields: [studentsToInstitutions.institutionId],
      references: [institutions.id],
    }),
  }),
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(usersToOrganizations),
  admins: many(organizationAdmins),
}));

export const usersToOrganizationsRelations = relations(
  usersToOrganizations,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToOrganizations.userId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [usersToOrganizations.organizationId],
      references: [organizations.id],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
