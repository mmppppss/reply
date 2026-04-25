import { sql } from "drizzle-orm";
import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	username: varchar("username", { length: 50 }).notNull().unique(),
	email: varchar("email", { length: 100 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").notNull().default(sql`now()`),
	updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
})