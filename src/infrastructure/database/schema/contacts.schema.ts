import { pgTable, varchar, timestamp, uuid, jsonb, unique } from "drizzle-orm/pg-core";
import { agents } from "./agents.schema";

export const contacts = pgTable("contacts", {
    id: uuid("id").primaryKey().defaultRandom(),
    idAgent: uuid("id_agent")
        .notNull()
        .references(() => agents.id, { onDelete: "cascade" }),
    contactId: varchar("contact_id", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    platform: varchar("platform", { length: 20 }),
    chatType: varchar("chat_type", { length: 20 }),
    firstSeenAt: timestamp("first_seen_at").notNull().defaultNow(),
    lastInteractionAt: timestamp("last_interaction_at").notNull().defaultNow(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    uniqueContact: unique().on(table.idAgent, table.contactId),
}));
