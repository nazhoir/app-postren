import { pgEnum } from "drizzle-orm/pg-core";

export const employeeStatus = pgEnum("emp_status", ["PNS", "PPPK", "NON-ASN"]);
export const gender = pgEnum("gender", ["L", "P"]);
export const nationality = pgEnum("nationality", ["WNA", "WNI"]);
export const cardStatus = pgEnum("card_status", ["ACTIVE", "BLOCKED"]);
// Enum untuk tipe hubungan keluarga
export const familyRelationType = pgEnum('family_relation_type', [
  'father', 
  'mother', 
  'sibling', 
  'spouse', 
  'child', 
  'guardian', 
  'other'
]);

export const cashflowType = pgEnum("cashflow_type", ["credit", "debit"]);
export const paymentMethod = pgEnum("payment_method", [
  "cash",
  "bank_transfer",
]);
export const billingItemStatus = pgEnum("billing_item_status", [
  "active",
  "inactive",
]);
