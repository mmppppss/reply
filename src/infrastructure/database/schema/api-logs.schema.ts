import { pgTable, timestamp, uuid, varchar, text, integer } from "drizzle-orm/pg-core";
import { agents } from "./agents.schema";
import { apiKeys } from "./api-keys.schema";

export const apiLogs = pgTable("api_logs", {
	id: uuid("id").primaryKey().defaultRandom(),
	idAgent: uuid("id_agent")
		.notNull()
		.references(() => agents.id, { onDelete: "cascade" }),
	idApiKey: uuid("id_api_key")
		.references(() => apiKeys.id, { onDelete: "set null" }),
	method: varchar("method", { length: 10 }).notNull(),
	path: text("path").notNull(),
	status: integer("status").notNull(),
	ip: varchar("ip", { length: 45 }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
