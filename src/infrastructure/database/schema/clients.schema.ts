import { sql } from "drizzle-orm";
import { mysqlTable, int, varchar, datetime } from "drizzle-orm/mysql-core";

export const clients = mysqlTable("clients", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    phone: varchar("phone", { length: 30 }),
    createdAt: datetime("created_at").notNull().default(sql`now()`)
});

