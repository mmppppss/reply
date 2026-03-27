import { sql } from "drizzle-orm";
import { mysqlTable, int, varchar, datetime, char } from "drizzle-orm/mysql-core";
import { users } from "./users.schema";

export const clients = mysqlTable("clients", {
    id: int("id").primaryKey().autoincrement(),
	id_user: char("id_user", {length: 36}).references(()=>users.id),
    name: varchar("name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    phone: varchar("phone", { length: 30 }),
    createdAt: datetime("created_at").notNull().default(sql`now()`)
});

