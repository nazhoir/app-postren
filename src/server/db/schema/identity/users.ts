import { relations } from "drizzle-orm";
import { boolean, date, index, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/generate-id";
import {
  baseColumns,
  createTable,
  STRING_LENGTHS,
  TIMESTAMP_CONFIG,
} from "../core/base";
import { familyRelationType, gender, nationality } from "../core/enums";
import { accounts } from "./accounts";
import { cardID } from "./cards";
import {
  organizationAdmins,
  organizationUsers,
} from "../organization/organizations";
import { students } from "../organization/students";
import { employees } from "../organization/employees";
import { addresses } from "../address/address";
import { userBill, userBillPayments } from "../finance/billings";
import { savingCashflow, savings } from "../saving/saving";
import { educationHistories } from "../academic/education";

export const users = createTable(
  "user",
  {
    // Identifier utama
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    // Informasi dasar
    name: varchar("name", { length: STRING_LENGTHS.NAME }).notNull(),
    username: varchar("username", { length: STRING_LENGTHS.USERNAME })
      .unique()
      .$defaultFn(() => nanoid()),
    email: varchar("email", { length: STRING_LENGTHS.EMAIL }).unique(),
    // Informasi identitas
    nationality: nationality().notNull(),
    country: varchar("country", { length: 100 }),
    nik: varchar("nik", { length: STRING_LENGTHS.NIS }).unique(),
    nkk: varchar("nkk", { length: STRING_LENGTHS.NIS }),
    passport: varchar("passport", { length: 50 }).unique(),
    // Informasi personal
    birthPlace: varchar("birth_place", { length: STRING_LENGTHS.NAME }),
    birthDate: date("birth_date"),
    gender: gender(),
    // Autentikasi & keamanan
    emailVerified: timestamp("email_verified", TIMESTAMP_CONFIG),
    password: varchar("password", {
      length: STRING_LENGTHS.PASSWORD,
    }), // Hash password
    // Data profil
    image: varchar("image", { length: STRING_LENGTHS.URL }),
    registrationNumber: varchar("registration_number", {
      length: 100,
    }).unique(),
    invitedBy: varchar("invited_by", { length: STRING_LENGTHS.ID }),
    // Referensi alamat
    addressId: varchar("address_id", { length: STRING_LENGTHS.ID }),
    domicileSameAsAddress: boolean("domicile_same_as_address"),
    domicileId: varchar("domicile_id", { length: STRING_LENGTHS.ID }),
    // Status akun
    isActive: boolean("is_active").notNull().default(true),
    lastLogin: timestamp("last_login", TIMESTAMP_CONFIG),

    ...baseColumns,
  },
  (table) => ({
    // Indeks untuk optimasi query
    emailIdx: index("user_email_idx").on(table.email),
    usernameIdx: index("user_username_idx").on(table.username),
    nikIdx: index("user_nik_idx").on(table.nik),
    activeIdx: index("user_active_idx").on(table.isActive),
  }),
);

// Tabel baru untuk hubungan keluarga
export const userFamily = createTable(
  "user_family",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .references(() => users.id)
      .notNull(),
    relatedUserId: varchar("related_user_id", { length: STRING_LENGTHS.ID })
      .references(() => users.id)
      .notNull(),
    relationType: familyRelationType("relation_type").notNull(),
    isGuardian: boolean("is_guardian").default(false),

    ...baseColumns,
  },
  (table) => ({
    // Indeks untuk optimasi query
    userIdx: index("user_family_user_idx").on(table.userId),
    relatedUserIdx: index("user_family_related_user_idx").on(
      table.relatedUserId,
    ),
    relationTypeIdx: index("user_family_relation_type_idx").on(
      table.relationType,
    ),
  }),
);

export const usersRelations = relations(users, ({ many, one }) => ({
  // Relasi autentikasi & organisasi
  accounts: many(accounts),
  organizations: many(organizationUsers),
  admins: many(organizationAdmins),
  cardIDs: many(cardID),

  // Relasi berbasis peran
  student: one(students, {
    references: [students.id],
    fields: [users.id],
    relationName: "student",
  }),
  employees: many(employees),

  // Relasi undangan
  invitee: one(users, {
    references: [users.id],
    fields: [users.invitedBy],
    relationName: "invitee",
  }),

  // Relasi keluarga
  familyRelations: many(userFamily, {
    relationName: "relatedUser",
  }),

  familyRelationsUser: many(userFamily, {
    relationName: "userFamily_main",
  }),

  // Relasi alamat
  domicile: one(addresses, {
    references: [addresses.id],
    fields: [users.domicileId],
    relationName: "domicile",
  }),
  address: one(addresses, {
    references: [addresses.id],
    fields: [users.addressId],
    relationName: "address",
  }),

  // Relasi tagihan
  bills: many(userBill),
  billPayment: many(userBillPayments),

  // saving
  saving: one(savings, {
    references: [savings.id],
    fields: [users.id],
    relationName: "saving",
  }),

  savingCashflowCreated: many(savingCashflow),

  // Education History
  educationHistories:many(educationHistories),
  createdEducationHistories:many(educationHistories),
}));

// Definisi relasi untuk tabel user_family
export const userFamilyRelations = relations(userFamily, ({ one }) => ({
  user: one(users, {
    references: [users.id],
    fields: [userFamily.userId],
    relationName: "userFamily_main",
  }),
  relatedUser: one(users, {
    references: [users.id],
    fields: [userFamily.relatedUserId],
    relationName: "relatedUser",
  }),
}));
