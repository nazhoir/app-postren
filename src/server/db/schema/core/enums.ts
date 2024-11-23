import { pgEnum } from "drizzle-orm/pg-core";

export const employeeStatus = pgEnum("emp_status", ["PNS", "PPPK", "NON-ASN"]);
export const gender = pgEnum("gender", ["L", "P"]);
export const nationality = pgEnum("nationality", ["WNA", "WNI"]);
export const cardStatus = pgEnum("card_status", ["ACTIVE", "BLOCKED"]);
export const guardianType = pgEnum("guardian_type", [
  "kakek",
  "nenek",
  "paman",
  "bibi",
  "orang_tua_asuh",
]);
