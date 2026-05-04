import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const agents = pgTable("agents", {
	id: uuid("id").primaryKey().defaultRandom(),
	idUser: uuid("id_user").references(()=>users.id),
	name: varchar("name", { length: 50 }).notNull(),
	description: varchar("description", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
});
