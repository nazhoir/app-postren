import { relations } from "drizzle-orm";
import { type AdapterAccount } from "next-auth/adapters";
import {
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
} from "../core/base";
import { users } from "./users";

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

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

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

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

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
