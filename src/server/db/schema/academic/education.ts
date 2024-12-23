import {
    boolean,
  date,
  decimal,
  varchar,
} from "drizzle-orm/pg-core";
import {
  baseColumns,
  createTable,
  STRING_LENGTHS,
  TIMESTAMP_CONFIG,
} from "../core/base";
import { nanoid } from "@/lib/generate-id";
import { relations } from "drizzle-orm";
import {   schoolTypes, educationTypes,formalEducationLevels,trainingTypes, educationDegreePositions} from "../core/enums";
import { users } from "../identity/users";
export const educationHistories = createTable("edu_history", {
    id: varchar("id", { length: STRING_LENGTHS.ID })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    
    userId: varchar("user_id", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    
    createdBy: varchar("created_by", { length: STRING_LENGTHS.ID })
      .notNull()
      .references(() => users.id),
    
    // Jenis pendidikan (formal/non-formal)
    educationType: educationTypes("education_type").notNull(),
    
    // Kolom untuk pendidikan formal
    formalEducationLevel: formalEducationLevels("formal_level"),
    schoolName: varchar("sch_name", { length: STRING_LENGTHS.NAME }),
    major:varchar({length:STRING_LENGTHS.NAME}),
    schoolType: schoolTypes("sch_type"),
    schoolAddress: varchar("sch_address"),
    entryYear: varchar("entry_year", { length: 4 }),
    graduationYear: varchar("graduation_year", { length: 4 }),
    averageValue: decimal("average_value"),
    diplomaDate: date("diploma_date", TIMESTAMP_CONFIG),
    diplomaNumber: varchar("diploma_number", { length: STRING_LENGTHS.NAME }),
    degreePosition:educationDegreePositions(),
    degree:varchar({length:100}),
    degreeCode:varchar({length:10}),

    // Kolom untuk pendidikan non-formal (kursus/pelatihan)
    trainingName: varchar("training_name", { length: STRING_LENGTHS.NAME }),
    trainingType: trainingTypes("training_type"),
    organizer: varchar("organizer", { length: STRING_LENGTHS.NAME }),
    trainingLocation: varchar("training_location"),
    startDate: date("start_date", TIMESTAMP_CONFIG),
    endDate: date("end_date", TIMESTAMP_CONFIG),
    durationMinutes: decimal("duration_hours"),
    certificateNumber: varchar("certificate_number", { length: STRING_LENGTHS.NAME }),
    certificateDate: date("certificate_date", TIMESTAMP_CONFIG),
    
    // Apakah sudah selesai/lulus
    isCompleted: boolean("is_completed").default(false),
    attachment:varchar(),
    
    ...baseColumns,
  });
  
  // Hubungan dengan tabel users
  export const educationHistoryRelations = relations(educationHistories, ({ one }) => ({
    user: one(users, {
      fields: [educationHistories.userId],
      references: [users.id],
      relationName:"user_edu_hstry"
    }),
    createdByUser: one(users, {
      fields: [educationHistories.createdBy],
      references: [users.id],
      relationName:"created_edu_hstry"
    })
  }));