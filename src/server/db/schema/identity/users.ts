import { relations } from "drizzle-orm";
import { boolean, date, index, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/generate-id";
import {
  baseColumns,
  createTable,
  STRING_LENGTHS,
  TIMESTAMP_CONFIG,
} from "../core/base";
import { gender, guardianType, nationality } from "../core/enums";
import { accounts } from "./accounts";
import { cardID } from "./cards";
import {
  organizationAdmins,
  organizationUsers,
} from "../organization/organizations";
import { students } from "../organization/students";
import { employees } from "../organization/employees";
import { addresses } from "../address/address";

export const users = createTable(
  "user",
  {
    // Primary identifier
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    // Basic information
    name: varchar("name", { length: STRING_LENGTHS.NAME }).notNull(),
    username: varchar("username", { length: STRING_LENGTHS.USERNAME })
      .unique()
      .$defaultFn(() => nanoid()),
    email: varchar("email", { length: STRING_LENGTHS.EMAIL }).unique(),

    // Identity information
    nationality: nationality(),
    country: varchar("country", { length: 100 }),
    nik: varchar("nik", { length: STRING_LENGTHS.NIS }).unique(),
    nkk: varchar("nkk", { length: STRING_LENGTHS.NIS }),
    passport: varchar("passport", { length: 50 }).unique(),

    // Personal information
    birthPlace: varchar("birth_place", { length: STRING_LENGTHS.NAME }),
    birthDate: date("birth_date"),
    gender: gender(),

    // Authentication & security
    emailVerified: timestamp("email_verified", TIMESTAMP_CONFIG),
    password: varchar("password", { length: STRING_LENGTHS.PASSWORD }),

    // Profile data
    image: varchar("image", { length: STRING_LENGTHS.URL }),
    registrationNumber: varchar("registration_number", {
      length: 100,
    }).unique(),
    invitedBy: varchar("invited_by", { length: STRING_LENGTHS.ID }),

    // Family relations
    fatherId: varchar("father_id", { length: STRING_LENGTHS.ID }),
    motherId: varchar("mother_id", { length: STRING_LENGTHS.ID }),
    guardianId: varchar("guardian_id", { length: STRING_LENGTHS.ID }),
    guardianType: guardianType(),

    // Address references
    addressId: varchar("address_id", { length: STRING_LENGTHS.ID }),
    domicileSameAsAddress: boolean("domicile_same_as_address"),
    domicileId: varchar("domicile_id", { length: STRING_LENGTHS.ID }), // Fixed space in column name

    ...baseColumns,
  },
  (table) => ({
    // Optimize indexes for common queries
    emailIdx: index("user_email_idx").on(table.email),
    usernameIdx: index("user_username_idx").on(table.username),
    nikIdx: index("user_nik_idx").on(table.nik),
    fatherIdx: index("user_father_idx").on(table.fatherId),
    motherIdx: index("user_mother_idx").on(table.motherId),
    guardianIdx: index("user_guardian_idx").on(table.guardianId),
  }),
);

export const usersRelations = relations(users, ({ many, one }) => ({
  // Authentication & organization relations
  accounts: many(accounts),
  organizations: many(organizationUsers),
  admins: many(organizationAdmins),
  cardIDs: many(cardID),

  // Role-based relations
  student: one(students, {
    references: [students.id],
    fields: [users.id],
  }),
  employees: many(employees),

  // Invitation relation
  invitee: one(users, {
    references: [users.id],
    fields: [users.invitedBy],
  }),

  // Family relations
  father: one(users, {
    references: [users.id],
    fields: [users.fatherId],
  }),
  children_by_father: many(users),

  mother: one(users, {
    references: [users.id],
    fields: [users.motherId],
  }),
  children_by_mother: many(users),

  guardian: one(users, {
    references: [users.id],
    fields: [users.guardianId],
  }),
  children_by_guardian: many(users),

  // Address relations
  domicile: one(addresses, {
    references: [addresses.id],
    fields: [users.domicileId],
  }),
  address: one(addresses, {
    references: [addresses.id],
    fields: [users.addressId],
  }),
}));
