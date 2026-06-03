import { contacts } from "../schema/contacts.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { BaseRepository } from "./base.repo";
import { randomUUID } from "crypto";
import { eq, and, desc, sql } from "drizzle-orm";
import { Contact } from "../types/contact.type";

export class ContactRepository extends BaseRepository<
    typeof contacts,
    string
> {
    constructor(dbInstance: PostgresJsDatabase<any>) {
        super(dbInstance, contacts, contacts.id);
    }

    async findByAgent(agentId: string): Promise<Contact[]> {
        return this.db
            .select()
            .from(contacts)
            .where(eq(contacts.idAgent, agentId))
            .orderBy(desc(contacts.lastInteractionAt));
    }

    async findByAgentAndContactId(
        agentId: string,
        contactId: string,
    ): Promise<Contact | null> {
        const result = await this.db
            .select()
            .from(contacts)
            .where(
                and(
                    eq(contacts.idAgent, agentId),
                    eq(contacts.contactId, contactId),
                ),
            )
            .limit(1);

        return result[0] ?? null;
    }

    async create(data: {
        idAgent: string;
        contactId: string;
        name?: string | null;
        platform?: string | null;
        chatType?: string | null;
        metadata?: Record<string, any> | null;
    }): Promise<Contact> {
        const id = randomUUID();
        const now = new Date();
        await this.db.insert(contacts).values({
            id,
            idAgent: data.idAgent,
            contactId: data.contactId,
            name: data.name ?? null,
            platform: data.platform ?? null,
            chatType: data.chatType ?? null,
            firstSeenAt: now,
            lastInteractionAt: now,
            metadata: data.metadata ?? null,
        });

        const created = await this.findById(id);
        if (!created) {
            throw new Error("[CONTACT REPO 001] Create failed");
        }
        return created;
    }

    async upsert(
        agentId: string,
        contactId: string,
        data: {
            name?: string | null;
            platform?: string | null;
            chatType?: string | null;
            metadata?: Record<string, any> | null;
        },
    ): Promise<Contact> {
        const id = randomUUID();
        const now = new Date();

        const updateData: Record<string, any> = {
            lastInteractionAt: now,
            updatedAt: now,
        };
        if (data.name !== undefined) updateData.name = data.name;
        if (data.platform !== undefined) updateData.platform = data.platform;
        if (data.chatType !== undefined) updateData.chatType = data.chatType;
        if (data.metadata !== undefined) updateData.metadata = data.metadata;

        await this.db
            .insert(contacts)
            .values({
                id,
                idAgent: agentId,
                contactId,
                name: data.name ?? null,
                platform: data.platform ?? null,
                chatType: data.chatType ?? null,
                firstSeenAt: now,
                lastInteractionAt: now,
                metadata: data.metadata ?? null,
            })
            .onConflictDoUpdate({
                target: [contacts.idAgent, contacts.contactId],
                set: updateData,
            });

        const result = await this.findByAgentAndContactId(agentId, contactId);
        if (!result) {
            throw new Error("[CONTACT REPO 002] Upsert failed");
        }
        return result;
    }

    async update(
        id: string,
        data: {
            name?: string | null;
            platform?: string | null;
            chatType?: string | null;
            metadata?: Record<string, any> | null;
        },
    ): Promise<Contact> {
        const updateData: Record<string, any> = { updatedAt: new Date() };
        if (data.name !== undefined) updateData.name = data.name;
        if (data.platform !== undefined) updateData.platform = data.platform;
        if (data.chatType !== undefined) updateData.chatType = data.chatType;
        if (data.metadata !== undefined) updateData.metadata = data.metadata;

        await this.db
            .update(contacts)
            .set(updateData)
            .where(eq(contacts.id, id));

        const updated = await this.findById(id);
        if (!updated) {
            throw new Error("[CONTACT REPO 004] Update failed");
        }
        return updated;
    }
}
