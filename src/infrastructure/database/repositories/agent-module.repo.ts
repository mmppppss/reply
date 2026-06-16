import { agentModules } from "../schema/agent-module.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { BaseRepository } from "./base.repo";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { AgentModule } from "../types/agent-module.type";

export class AgentModuleRepository extends BaseRepository<
    typeof agentModules,
    string
> {
    constructor(dbInstance: PostgresJsDatabase<any>) {
        super(dbInstance, agentModules, agentModules.id);
    }

    async create(
        agentId: string,
        moduleKey: string,
        config?: Record<string, any>,
    ): Promise<AgentModule> {
        const id = randomUUID();
        await this.db.insert(agentModules).values({
            id,
            idAgent: agentId,
            moduleKey,
            config: config || {},
        });

        const created = await this.findById(id);
        if (!created) {
            throw new Error("[AGENT MODULE REPO 001] Agent module creation failed");
        }
        return created;
    }

    async findByAgentId(agentId: string): Promise<AgentModule[]> {
        return this.db
            .select()
            .from(agentModules)
            .where(eq(agentModules.idAgent, agentId));
    }

    async findEnabledByAgentId(agentId: string): Promise<AgentModule[]> {
        return this.db
            .select()
            .from(agentModules)
            .where(
                and(
                    eq(agentModules.idAgent, agentId),
                    eq(agentModules.enabled, true),
                ),
            )
            .orderBy(agentModules.priority);
    }

    async findByAgentAndModule(
        agentId: string,
        moduleKey: string,
    ): Promise<AgentModule | null> {
        const result = await this.db
            .select()
            .from(agentModules)
            .where(
                and(
                    eq(agentModules.idAgent, agentId),
                    eq(agentModules.moduleKey, moduleKey),
                ),
            )
            .limit(1);
        return result[0] ?? null;
    }

    async toggleEnabled(agentId: string, moduleKey: string): Promise<AgentModule> {
        const existing = await this.findByAgentAndModule(agentId, moduleKey);
        if (!existing) {
            return this.upsert(agentId, moduleKey, { enabled: true });
        }

        await this.db
            .update(agentModules)
            .set({ enabled: !existing.enabled, updatedAt: new Date() })
            .where(eq(agentModules.id, existing.id));

        const updated = await this.findById(existing.id);
        if (!updated) {
            throw new Error("[AGENT MODULE REPO 003] Agent module update failed");
        }
        return updated;
    }

    async updateConfig(
        agentId: string,
        moduleKey: string,
        config: Record<string, any>,
    ): Promise<AgentModule> {
        const existing = await this.findByAgentAndModule(agentId, moduleKey);
        if (!existing) {
            throw new Error("[AGENT MODULE REPO 004] Agent module not found");
        }

        await this.db
            .update(agentModules)
            .set({ config, updatedAt: new Date() })
            .where(eq(agentModules.id, existing.id));

        const updated = await this.findById(existing.id);
        if (!updated) {
            throw new Error("[AGENT MODULE REPO 005] Agent module update failed");
        }
        return updated;
    }

    async upsert(
        agentId: string,
        moduleKey: string,
        data: { enabled?: boolean; priority?: number; config?: Record<string, any> },
    ): Promise<AgentModule> {
        const existing = await this.findByAgentAndModule(agentId, moduleKey);
        if (existing) {
            const updateData: any = { updatedAt: new Date() };
            if (data.enabled !== undefined) updateData.enabled = data.enabled;
            if (data.priority !== undefined) updateData.priority = data.priority;
            if (data.config !== undefined) updateData.config = data.config;

            await this.db
                .update(agentModules)
                .set(updateData)
                .where(eq(agentModules.id, existing.id));

            const updated = await this.findById(existing.id);
            if (!updated) {
                throw new Error("[AGENT MODULE REPO 006] Agent module update failed");
            }
            return updated;
        }

        const id = randomUUID();
        await this.db.insert(agentModules).values({
            id,
            idAgent: agentId,
            moduleKey,
            enabled: data.enabled ?? true,
            priority: data.priority ?? 0,
            config: data.config || {},
        });

        const created = await this.findById(id);
        if (!created) {
            throw new Error("[AGENT MODULE REPO 007] Agent module creation failed");
        }
        return created;
    }
}
