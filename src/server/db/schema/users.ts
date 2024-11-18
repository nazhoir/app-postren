import {
  date,
  index,
  integer,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  baseColumns,
  createTable,
  STRING_LENGTHS,
  TIMESTAMP_CONFIG,
} from "./etc";
import { type AdapterAccount } from "next-auth/adapters";
import { relations } from "drizzle-orm";
import { organizationAdmins, organizationUsers } from "./organizations";
import { students } from "./students";
import { nanoid } from "@/lib/nanoid";

export const users = createTable(
  "user",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: STRING_LENGTHS.NAME }),
    username: varchar("username", { length: STRING_LENGTHS.USERNAME }).unique(),
    email: varchar("email", { length: STRING_LENGTHS.EMAIL }).unique(),
    nationality: varchar("nationality", { length: 3 }), // WNA /WNI
    country: varchar("country", { length: 100 }),
    nik: varchar("nik", { length: STRING_LENGTHS.NIS }).unique(),
    nkk: varchar("nkk", { length: STRING_LENGTHS.NIS }),
    passport: varchar("passport", { length: 50 }).unique(),
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

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  organizations: many(organizationUsers),
  admins: many(organizationAdmins),
  students: many(students),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
