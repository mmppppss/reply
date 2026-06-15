import { pgTable, timestamp, uuid, varchar, text, boolean, unique } from "drizzle-orm/pg-core";
import { agents } from "./agents.schema";

export const apiKeys = pgTable("api_keys", {
	id: uuid("id").primaryKey().defaultRandom(),
	idAgent: uuid("id_agent")
		.notNull()
		.references(() => agents.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 255 }).notNull(),
	keyHash: text("key_hash").notNull(),
	prefix: varchar("prefix", { length: 12 }).notNull(),
	active: boolean("active").notNull().default(true),
	lastUsedAt: timestamp("last_used_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
	unq: unique().on(t.prefix),
}));
