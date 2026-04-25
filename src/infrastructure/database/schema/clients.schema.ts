import { sql } from "drizzle-orm";
import { pgTable, serial, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const clients = pgTable("clients", {
    id: serial("id").primaryKey(),
	idUser: uuid("id_user").references(()=>users.id),
    name: varchar("name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    phone: varchar("phone", { length: 30 }),
    createdAt: timestamp("created_at").notNull().default(sql`now()`)
});