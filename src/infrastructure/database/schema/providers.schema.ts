import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const providers = pgTable("providers", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 50 }).notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
})
