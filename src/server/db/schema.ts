import { relations, sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

// Konstanta untuk timestamp columns
const TIMESTAMP_CONFIG = { mode: "date" } as const;

// Optimize timestamp columns
const baseColumns = {
  createdAt: timestamp("created_at", TIMESTAMP_CONFIG).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", TIMESTAMP_CONFIG).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", TIMESTAMP_CONFIG),
};

// Table creator dengan prefix yang lebih pendek
const createTable = pgTableCreator((name) => `p_${name}`);

// Optimasi panjang string berdasarkan kebutuhan
const STRING_LENGTHS = {
  ID: 36, // UUID length
  EMAIL: 255, // Standard email length
  NAME: 100, // Reduced from 255 to 100 for typical names
  USERNAME: 30, // Reduced from 50 to 30 for typical usernames
  PASSWORD: 255, // Reduced to 60 for bcrypt hash
  URL: 2048, // Increased for long URLs
  ROLE: 20, // Reduced from 255 to 20 for role names
  TOKEN: 255, // Token length
  NIS: 20, // Student number length
  SHORTNAME: 10, // Added for institution shortnames
  TYPE: 20, // Added for various type fields
} as const;

// Users table dengan column sizes yang dioptimalkan
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
    nik: varchar("nik", { length: STRING_LENGTHS.NIS }).unique(),
    nkk: varchar("nkk", { length: STRING_LENGTHS.NIS }),
    birthPlace: varchar("birth_place", { length: STRING_LENGTHS.NAME }),
    birthDate: date("birth_date"),
    gender: varchar("gender", { length: 1 }), // Optimized to single character M/F
    emailVerified: timestamp("email_verified", TIMESTAMP_CONFIG),
    password: varchar("password", { length: STRING_LENGTHS.PASSWORD }),
    image: varchar("image", { length: STRING_LENGTHS.URL }),
    ...baseColumns,
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    usernameIdx: index("user_username_idx").on(table.username),
    nikIdx: index("user_nik_idx").on(table.nik), // Added index for NIK lookups
  }),
);

// Students table dengan optimasi
export const students = createTable(
  "student",
  {
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id)
      .primaryKey(),
    organizationId: varchar("organization_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),
    nisn: varchar("nisn", { length: STRING_LENGTHS.NIS }).notNull().unique(),
    createdBy: varchar("created_by", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    ...baseColumns,
  },
  (table) => ({
    nisnIdx: index("student_nisn_idx").on(table.nisn),
    orgIdx: index("student_org_idx").on(table.organizationId), // Added for better query performance
  }),
);

// Institutions table dengan optimasi
export const institutions = createTable(
  "institution",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
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

// Junction table dengan optimasi
export const studentsToInstitutions = createTable(
  "students_institutions",
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

// Organizations table dengan optimasi
export const organizations = createTable(
  "organization",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: STRING_LENGTHS.NAME }).notNull(),
    type: varchar("type", { length: STRING_LENGTHS.TYPE }).notNull(),
    ...baseColumns,
  },
  (table) => ({
    nameIdx: index("organization_name_idx").on(table.name),
    typeIdx: index("organization_type_idx").on(table.type),
  }),
);

// Junction table untuk users dan organizations dengan optimasi
export const usersToOrganizations = createTable(
  "users_to_organizations",
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

// Organization admins table dengan optimasi
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

// OAuth accounts table dengan optimasi
export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: STRING_LENGTHS.TYPE })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: STRING_LENGTHS.TYPE }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: STRING_LENGTHS.ID,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: STRING_LENGTHS.TYPE }),
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

// Sessions table dengan optimasi
export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: STRING_LENGTHS.TOKEN })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", TIMESTAMP_CONFIG).notNull(),
    ...baseColumns,
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

// Verification tokens table dengan optimasi
export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", {
      length: STRING_LENGTHS.EMAIL,
    }).notNull(),
    token: varchar("token", { length: STRING_LENGTHS.TOKEN }).notNull(),
    expires: timestamp("expires", TIMESTAMP_CONFIG).notNull(),
    ...baseColumns,
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// Relations definitions dengan tambahan relasi yang lebih jelas
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  organizations: many(usersToOrganizations),
  admins: many(organizationAdmins),
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, { fields: [students.userId], references: [users.id] }),
  institutions: many(studentsToInstitutions),
  organization: one(organizations, {
    fields: [students.organizationId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [students.createdBy],
    references: [users.id],
  }),
}));

export const institutionsRelations = relations(
  institutions,
  ({ many, one }) => ({
    students: many(studentsToInstitutions),
    organization: one(organizations, {
      fields: [institutions.organizationId],
      references: [organizations.id],
    }),
  }),
);

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
  institutions: many(institutions),
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
    createdByUser: one(users, {
      fields: [usersToOrganizations.createdBy],
      references: [users.id],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
