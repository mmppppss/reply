import { pgTable, timestamp, uuid, jsonb, unique } from "drizzle-orm/pg-core";
import { agents } from "./agents.schema";

export const knowledge = pgTable("knowledge", {
	id: uuid("id").primaryKey().defaultRandom(),
	idAgent: uuid("id_agent")
		.notNull()
		.references(() => agents.id, { onDelete: "cascade" }),
	data: jsonb("data").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
	unq: unique().on(t.idAgent),
}));
