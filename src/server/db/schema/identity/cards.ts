import { relations } from "drizzle-orm";
import { varchar } from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/generate-id";
import { baseColumns, createTable, STRING_LENGTHS } from "../core/base";
import { cardStatus } from "../core/enums";
import { users } from "./users";
import { organizations } from "../organization/organizations";

export const cardID = createTable("card_id", {
  id: varchar("id", { length: STRING_LENGTHS.ID })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: varchar("user_id", { length: STRING_LENGTHS.ID }).references(
    () => users.id,
  ),
  issuedBy: varchar("issued_by", { length: STRING_LENGTHS.ID }).references(
    () => organizations.id,
  ),
  registrar: varchar("registrar", { length: STRING_LENGTHS.ID }).references(
    () => users.id,
  ),
  label: varchar("label", { length: 255 }),
  identifier: varchar("identifier", { length: 255 }).unique(),
  rfid: varchar("rfid", { length: 255 }).unique(),
  status: cardStatus(),
  ...baseColumns,
});

export const cardIDRelations = relations(cardID, ({ one }) => ({
  user: one(users, {
    fields: [cardID.userId],
    references: [users.id],
  }),
  issuedBy: one(organizations, {
    fields: [cardID.issuedBy],
    references: [organizations.id],
  }),
  registrar: one(users, {
    fields: [cardID.registrar],
    references: [users.id],
    relationName: "card_registrar",
  }),
}));
