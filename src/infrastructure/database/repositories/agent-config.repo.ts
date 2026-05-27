import { agentConfig } from "../schema/agent-config.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { BaseRepository } from "./base.repo";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { AgentConfig } from "../types/agent-config.type";

export class AgentConfigRepository extends BaseRepository<
    typeof agentConfig,
    string
> {
    constructor(dbInstance: PostgresJsDatabase<any>) {
        super(dbInstance, agentConfig, agentConfig.id);
    }

    async get(agentId: string, key: string): Promise<any | null> {
        const result = await this.db
            .select()
            .from(agentConfig)
            .where(
                and(
                    eq(agentConfig.idAgent, agentId),
                    eq(agentConfig.configKey, key),
                ),
            )
            .limit(1);

        return result[0]?.configValue ?? null;
    }

    async getAll(agentId: string): Promise<AgentConfig[]> {
        return this.db
            .select()
            .from(agentConfig)
            .where(eq(agentConfig.idAgent, agentId));
    }

    async set(
        agentId: string,
        key: string,
        value: any,
    ): Promise<AgentConfig> {
        const existing = await this.db
            .select()
            .from(agentConfig)
            .where(
                and(
                    eq(agentConfig.idAgent, agentId),
                    eq(agentConfig.configKey, key),
                ),
            )
            .limit(1);

        if (existing[0]) {
            await this.db
                .update(agentConfig)
                .set({ configValue: value, updatedAt: new Date() })
                .where(eq(agentConfig.id, existing[0].id));

            const updated = await this.findById(existing[0].id);
            if (!updated) {
                throw new Error("[AGENT CONFIG REPO 001] Update failed");
            }
            return updated;
        }

        const id = randomUUID();
        await this.db.insert(agentConfig).values({
            id,
            idAgent: agentId,
            configKey: key,
            configValue: value,
        });

        const created = await this.findById(id);
        if (!created) {
            throw new Error("[AGENT CONFIG REPO 002] Create failed");
        }
        return created;
    }

    async delete(agentId: string, key: string): Promise<void> {
        await this.db
            .delete(agentConfig)
            .where(
                and(
                    eq(agentConfig.idAgent, agentId),
                    eq(agentConfig.configKey, key),
                ),
            );
    }
}
