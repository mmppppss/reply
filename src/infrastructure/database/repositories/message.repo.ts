import { messages } from "../schema/messages.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { BaseRepository } from "./base.repo";
import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";

interface CreateMessageData {
    idAgent: string;
    idSession?: string | null;
    direction: "incoming" | "outgoing";
    from?: string | null;
    to?: string | null;
    chat?: string | null;
    chatType?: string | null;
    content: string;
    moduleKey?: string | null;
}

export class MessageRepository extends BaseRepository<
    typeof messages,
    string
> {
    constructor(dbInstance: PostgresJsDatabase<any>) {
        super(dbInstance, messages, messages.id);
    }

    async create(data: CreateMessageData) {
        const id = randomUUID();
        await this.db.insert(messages).values({
            id,
            idAgent: data.idAgent,
            idSession: data.idSession ?? null,
            direction: data.direction,
            from: data.from ?? null,
            to: data.to ?? null,
            chat: data.chat ?? null,
            chatType: data.chatType ?? null,
            content: data.content,
            moduleKey: data.moduleKey ?? null,
        });

        return this.findById(id);
    }

    async findByAgent(
        agentId: string,
        limit = 50,
        offset = 0,
    ) {
        return this.db
            .select()
            .from(messages)
            .where(eq(messages.idAgent, agentId))
            .orderBy(desc(messages.createdAt))
            .limit(limit)
            .offset(offset);
    }
}
