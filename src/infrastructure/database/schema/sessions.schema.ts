import { pgTable, timestamp, uuid, char } from "drizzle-orm/pg-core";
import { agents } from "./agents.schema";
import { providers } from "./providers.schema";

export const sessions = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	idAgent: uuid("id_agent").references(()=>agents.id),
	idProvider: uuid("id_provider").references(()=>providers.id),
	status: char("status", {length:1}).notNull().default("P"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
});
