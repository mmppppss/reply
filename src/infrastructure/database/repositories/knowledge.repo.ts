import { knowledge } from "../schema/knowledge.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { BaseRepository } from "./base.repo";
import { eq, sql } from "drizzle-orm";
import { KnowledgeEntry } from "../types/knowledge.type";

export class KnowledgeRepository extends BaseRepository<
	typeof knowledge,
	string
> {
	constructor(dbInstance: PostgresJsDatabase<any>) {
		super(dbInstance, knowledge, knowledge.id);
	}

	async findByAgentId(agentId: string): Promise<KnowledgeEntry | null> {
		const [entry] = await this.db
			.select()
			.from(knowledge)
			.where(eq(knowledge.idAgent, agentId))
			.limit(1);

		return entry ?? null;
	}

	async upsert(
		agentId: string,
		data: any,
	): Promise<KnowledgeEntry> {
		const [result] = await this.db
			.insert(knowledge)
			.values({ idAgent: agentId, data })
			.onConflictDoUpdate({
				target: knowledge.idAgent,
				set: { data, updatedAt: new Date() },
			})
			.returning();

		if (!result) {
			throw new Error("[KNOWLEDGE REPO 001] Knowledge upsert failed");
		}
		return result;
	}

	async deleteByAgentId(agentId: string): Promise<void> {
		await this.db
			.delete(knowledge)
			.where(eq(knowledge.idAgent, agentId));
	}
}
