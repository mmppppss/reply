import { sql } from "drizzle-orm";
import { mysqlTable, varchar, datetime, char } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
	id: char("id", { length: 36 }).primaryKey(),
	username: varchar("username", { length: 50 }).notNull().unique(),
	email: varchar("email", { length: 100 }).notNull().unique(),
	password: varchar("password", { length: 50 }).notNull(),
	createdAt: datetime("created_at").notNull().default(sql`now()`),
	updatedAt: datetime("updated_at").notNull().default(sql`now()`)
})
