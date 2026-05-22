import { pgTable, timestamp, uuid, varchar, text } from "drizzle-orm/pg-core";
import { agents } from "./agents.schema";

export const responses = pgTable("responses", {
	id: uuid("id").primaryKey().defaultRandom(),
	idAgent: uuid("id_agent")
		.notNull()
		.references(() => agents.id, { onDelete: "cascade" }),
	keyword: varchar("keyword", { length: 100 }).notNull(),
	response: text("response").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
