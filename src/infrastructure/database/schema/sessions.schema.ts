import { sql } from "drizzle-orm";
import { mysqlTable, datetime, char } from "drizzle-orm/mysql-core";
import { users } from "./users.schema";

export const sessions = mysqlTable("sessions", {
	id: char("id", { length: 36 }).primaryKey(),
	idUser: char("id_user", {length:36}).references(()=>users.id),
	status: char("status", {length:1}).notNull().default("P"),
    createdAt: datetime("created_at").notNull().default(sql`now()`),
	updatedAt: datetime("updated_at").notNull().default(sql`now()`)
});

