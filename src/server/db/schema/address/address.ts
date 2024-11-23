import { varchar } from "drizzle-orm/pg-core";
import { baseColumns, createTable, STRING_LENGTHS } from "../core/base";
import { nanoid } from "@/lib/generate-id";
import { relations } from "drizzle-orm";
import { users } from "../identity/users";

export const addresses = createTable("address", {
  id: varchar("id", { length: STRING_LENGTHS.ID })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  fullAddress: varchar("full_address", { length: 255 }), // Fixed typo in column name
  rt: varchar("rt", { length: 100 }),
  rw: varchar("rw", { length: 100 }),
  village: varchar("village", { length: 100 }),
  district: varchar("district", { length: 100 }),
  regency: varchar("regency", { length: 100 }),
  province: varchar("province", { length: 100 }),
  country: varchar("country", { length: 100 }),
  postalCode: varchar("postal_code", { length: 100 }), // Changed to more standard naming
  ...baseColumns,
});

export const addressRelations = relations(addresses, ({ many }) => ({
  usersAddress: many(users),
  usersDomicile: many(users),
}));
