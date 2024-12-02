import { relations } from "drizzle-orm";
import {
  date,
  foreignKey,
  index,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/generate-id";
import {
  baseColumns,
  createTable,
  STRING_LENGTHS,
  TIMESTAMP_CONFIG,
} from "../core/base";
import { users } from "../identity/users";
import { organizations } from "./organizations";
import { institutions } from "../institution/institutions";
import { employeeStatus } from "../core/enums";

export const employees = createTable(
  "employee",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id)
      .primaryKey(),
    npk: varchar("npk", { length: 50 }).unique(),
    nuptk: varchar("nuptk", { length: 50 }).unique(),
    nip: varchar("nip", { length: 50 }).unique(),
    status: employeeStatus(),
    invitedBy: varchar("created_by", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    organizationId: varchar("org_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => organizations.id),
    joiningDate: date("joining_date"),
    ...baseColumns,
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.id],
      foreignColumns: [users.id],
      name: "emp_user_fk",
    }),
    npkIndex: index("npk_idx").on(table.npk),
    nuptkIndex: index("nuptk_idx").on(table.nuptk),
    nipIndex: index("nip_idx").on(table.nip),
  }),
);

export const employeeTasks = createTable(
  "emp_tasks",
  {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    employeeId: varchar("emp_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => employees.id),
    type: varchar("type", { length: 100 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    location: varchar("location", { length: STRING_LENGTHS.ID })
      .references(() => institutions.id)
      .notNull(),
    startedAt: timestamp("started_at", TIMESTAMP_CONFIG).notNull(),
    endsOn: timestamp("ends_on", TIMESTAMP_CONFIG),
  },
  (table) => ({
    employeeFk: foreignKey({
      columns: [table.employeeId],
      foreignColumns: [employees.id],
      name: "emp_task_fk",
    }),
    employeeIdIndex: index("emp_id_idx").on(table.employeeId),
    typeIndex: index("type_idx").on(table.type),
  }),
);

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, {
    fields: [employees.id],
    references: [users.id],
    relationName: "emp_user",
  }),
  tasks: many(employeeTasks, {
    relationName: "emp_tasks",
  }),
  organization: one(organizations, {
    fields: [employees.organizationId],
    references: [organizations.id],
  }),
}));

export const employeeTasksRelations = relations(employeeTasks, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeTasks.employeeId],
    references: [employees.id],
    relationName: "task_emp",
  }),
  location: one(institutions, {
    fields: [employeeTasks.location],
    references: [institutions.id],
    relationName: "task_locations",
  }),
}));
