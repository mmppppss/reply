import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, char } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const sessions = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	idUser: uuid("id_user").references(()=>users.id),
	status: char("status", {length:1}).notNull().default("P"),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
	updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});