import { pgTable, varchar, timestamp, uuid, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { agents } from "./agents.schema";

export const agentModules = pgTable("agent_modules", {
    id: uuid("id").primaryKey().defaultRandom(),
    idAgent: uuid("id_agent")
        .notNull()
        .references(() => agents.id, { onDelete: "cascade" }),
    moduleKey: varchar("module_key", { length: 50 }).notNull(),
    enabled: boolean("enabled").notNull().default(true),
    priority: integer("priority").notNull().default(0),
    config: jsonb("config").default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
});
