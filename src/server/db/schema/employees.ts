import { boolean, foreignKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable, STRING_LENGTHS, TIMESTAMP_CONFIG } from "./etc";
import { users } from "./users";

export const employees = createTable(
  "emp",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id)
      .primaryKey(),
    npk: varchar("npk", { length: 50 }),
    nuptk: varchar("nuptk", { length: 50 }),
    nip: varchar("nip", { length: 50 }),
    status: varchar("status", { length: 50 }), // pns, p3k, non-asn
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.id],
      foreignColumns: [users.id],
      name: "emp_user_fk",
    }),
  }),
);

export const employeeAssignments = createTable(
  "emp_assignments",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID }).notNull().primaryKey(),
    employeeId: varchar("employee_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => employees.id),
    type: varchar("type", { length: 100 }).notNull(), // jenis pegawai = guru, tendik, pegawai
    startedAt: timestamp("started_at", TIMESTAMP_CONFIG).notNull(),
    endsOn: timestamp("ends_on", TIMESTAMP_CONFIG),
  },
  (table) => ({
    employeeFk: foreignKey({
      columns: [table.employeeId],
      foreignColumns: [employees.id],
      name: "emp_assign_emp_fk",
    }),
  }),
);

export const employeeAssignmentLocations = createTable(
  "emp_assign_locations",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID }).notNull().primaryKey(),
    assignmentId: varchar("assignment_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => employeeAssignments.id),
    startedAt: timestamp("started_at", TIMESTAMP_CONFIG).notNull(),
    endsOn: timestamp("ends_on", TIMESTAMP_CONFIG),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => ({
    assignmentFk: foreignKey({
      columns: [table.assignmentId],
      foreignColumns: [employeeAssignments.id],
      name: "emp_loc_assign_fk",
    }),
  }),
);
