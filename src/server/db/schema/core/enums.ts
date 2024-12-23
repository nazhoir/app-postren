import { pgEnum } from "drizzle-orm/pg-core";

export const employeeStatus = pgEnum("emp_status", ["PNS", "PPPK", "NON-ASN"]);
export const gender = pgEnum("gender", ["L", "P"]);
export const nationality = pgEnum("nationality", ["WNA", "WNI"]);
export const cardStatus = pgEnum("card_status", ["ACTIVE", "BLOCKED"]);
// Enum untuk tipe hubungan keluarga
export const familyRelationType = pgEnum("family_relation_type", [
  "father",
  "mother",
  "sibling",
  "spouse",
  "child",
  "guardian",
  "other",
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


export const educationTypes = pgEnum("education_types", [
  "FORMAL",
  "NON_FORMAL"
]);

// Enum untuk level pendidikan formal
export const formalEducationLevels = pgEnum("formal_edu_levels", [
  "SD/Sederajat",
  "SMP/Sederajat", 
  "SMA/Sederajat",
  "D1",
  "D2", 
  "D3",
  "D4/S1",
  "S2",
  "S3"
]);

export const educationDegreePositions = pgEnum("edu_dgr_positions",[
  "Depan",
  "Belakang"
])

// Enum untuk jenis institusi pendidikan formal
export const schoolTypes = pgEnum("school_type", [
  "SWASTA",
  "NEGERI"
]);

// Enum untuk jenis pelatihan/kursus
export const trainingTypes = pgEnum("training_types", [
  "WORKSHOP",
  "SEMINAR", 
  "PELATIHAN",
  "SERTIFIKASI",
  "KONFERENSI",
  "ONLINE_COURSE",
  "LAINNYA"
]);