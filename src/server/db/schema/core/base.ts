import { pgTableCreator, timestamp } from "drizzle-orm/pg-core";

// Konstanta untuk timestamp columns
export const TIMESTAMP_CONFIG = { mode: "date", precision: 3 } as const;

// Optimize timestamp columns
export const baseColumns = {
  createdAt: timestamp("created_at", TIMESTAMP_CONFIG)
    .$default(
      () => new Date(new Date().toISOString().slice(0, 19).replace("T", " ")),
    )
    .notNull(),
  updatedAt: timestamp("updated_at", TIMESTAMP_CONFIG).$onUpdate(
    () => new Date(new Date().toISOString().slice(0, 19).replace("T", " ")),
  ),
  deletedAt: timestamp("deleted_at", TIMESTAMP_CONFIG),
};

// Table creator dengan prefix yang lebih pendek
export const createTable = pgTableCreator((name) => `${name}`);

// Optimasi panjang string berdasarkan kebutuhan
export const STRING_LENGTHS = {
  ID: 36,
  EMAIL: 255,
  NAME: 100,
  USERNAME: 30,
  PASSWORD: 255,
  URL: 255,
  ROLE: 20,
  TOKEN: 255,
  NIS: 20,
  SHORTNAME: 10,
  TYPE: 20,
} as const;
