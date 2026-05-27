import { pgTable, varchar, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { agents } from "./agents.schema";
import { sessions } from "./sessions.schema";

export const messages = pgTable("messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    idAgent: uuid("id_agent")
        .notNull()
        .references(() => agents.id, { onDelete: "cascade" }),
    idSession: uuid("id_session")
        .references(() => sessions.id, { onDelete: "set null" }),
    direction: varchar("direction", { length: 10 }).notNull(),
    from: varchar("from", { length: 255 }),
    to: varchar("to", { length: 255 }),
    chat: varchar("chat", { length: 255 }),
    chatType: varchar("chat_type", { length: 20 }),
    content: text("content").notNull(),
    moduleKey: varchar("module_key", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
