import { apiLogs } from "../schema/api-logs.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { BaseRepository } from "./base.repo";
import { eq, desc } from "drizzle-orm";

export class ApiLogRepository extends BaseRepository<
	typeof apiLogs,
	string
> {
	constructor(dbInstance: PostgresJsDatabase<any>) {
		super(dbInstance, apiLogs, apiLogs.id);
	}

	async create(data: {
		idAgent: string;
		idApiKey?: string | null;
		method: string;
		path: string;
		status: number;
		ip?: string | null;
	}) {
		await this.db.insert(apiLogs).values({
			idAgent: data.idAgent,
			idApiKey: data.idApiKey ?? null,
			method: data.method,
			path: data.path,
			status: data.status,
			ip: data.ip ?? null,
		});
	}

	async findByAgentId(agentId: string, limit = 50) {
		return this.db
			.select()
			.from(apiLogs)
			.where(eq(apiLogs.idAgent, agentId))
			.orderBy(desc(apiLogs.createdAt))
			.limit(limit);
	}
}
