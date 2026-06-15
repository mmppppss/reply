import { apiKeys } from "../schema/api-keys.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { BaseRepository } from "./base.repo";
import { eq } from "drizzle-orm";
import { ApiKey } from "../types/api-key.type";
import { randomUUID } from "crypto";

export class ApiKeyRepository extends BaseRepository<
	typeof apiKeys,
	string
> {
	constructor(dbInstance: PostgresJsDatabase<any>) {
		super(dbInstance, apiKeys, apiKeys.id);
	}

	async findByPrefix(prefix: string): Promise<ApiKey | null> {
		const [result] = await this.db
			.select()
			.from(apiKeys)
			.where(eq(apiKeys.prefix, prefix))
			.limit(1);

		return result ?? null;
	}

	async findByAgentId(agentId: string): Promise<ApiKey[]> {
		return this.db
			.select()
			.from(apiKeys)
			.where(eq(apiKeys.idAgent, agentId));
	}

	async create(
		agentId: string,
		name: string,
		keyHash: string,
		prefix: string,
	): Promise<ApiKey> {
		const id = randomUUID();
		await this.db.insert(apiKeys).values({
			id,
			idAgent: agentId,
			name,
			keyHash,
			prefix,
		});

		const created = await this.findById(id);
		if (!created) {
			throw new Error("[API KEY REPO 001] Api key creation failed");
		}
		return created;
	}

	async revoke(id: string): Promise<void> {
		await this.db
			.update(apiKeys)
			.set({ active: false, updatedAt: new Date() })
			.where(eq(apiKeys.id, id));
	}

	async updateLastUsed(id: string): Promise<void> {
		await this.db
			.update(apiKeys)
			.set({ lastUsedAt: new Date(), updatedAt: new Date() })
			.where(eq(apiKeys.id, id));
	}
}
