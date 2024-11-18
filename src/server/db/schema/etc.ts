import { pgTableCreator, timestamp } from "drizzle-orm/pg-core";

// Konstanta untuk timestamp columns
export const TIMESTAMP_CONFIG = { mode: "date" } as const;

// Optimize timestamp columns
export const baseColumns = {
  createdAt: timestamp("created_at", TIMESTAMP_CONFIG).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", TIMESTAMP_CONFIG).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", TIMESTAMP_CONFIG),
};

// Table creator dengan prefix yang lebih pendek
export const createTable = pgTableCreator((name) => `${name}`);

// Optimasi panjang string berdasarkan kebutuhan
export const STRING_LENGTHS = {
  ID: 36, // UUID length
  EMAIL: 255, // Standard email length
  NAME: 100, // Reduced from 255 to 100 for typical names
  USERNAME: 30, // Reduced from 50 to 30 for typical usernames
  PASSWORD: 255,
  URL: 255,
  ROLE: 20, // Reduced from 255 to 20 for role names
  TOKEN: 255, // Token length
  NIS: 20, // Student number length
  SHORTNAME: 10, // Added for institution shortnames
  TYPE: 20, // Added for various type fields
} as const;
