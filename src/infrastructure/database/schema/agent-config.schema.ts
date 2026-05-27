import { pgTable, varchar, timestamp, uuid, jsonb, unique } from "drizzle-orm/pg-core";
import { agents } from "./agents.schema";

export const agentConfig = pgTable("agent_config", {
    id: uuid("id").primaryKey().defaultRandom(),
    idAgent: uuid("id_agent")
        .notNull()
        .references(() => agents.id, { onDelete: "cascade" }),
    configKey: varchar("config_key", { length: 100 }).notNull(),
    configValue: jsonb("config_value").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    uniqueKey: unique().on(table.idAgent, table.configKey),
}));
