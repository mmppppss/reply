import { responses } from "../schema/responses.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { BaseRepository } from "./base.repo";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { ResponseRule } from "../types/response.type";

export class ResponseRepository extends BaseRepository<
	typeof responses,
	string
> {
	constructor(dbInstance: PostgresJsDatabase<any>) {
		super(dbInstance, responses, responses.id);
	}

	async create(
		agentId: string,
		keyword: string,
		response: string,
	): Promise<ResponseRule> {
		const id = randomUUID();
		await this.db.insert(responses).values({
			id,
			idAgent: agentId,
			keyword,
			response,
		});

		const created = await this.findById(id);
		if (!created) {
			throw new Error("[RESPONSE REPO 001] Response creation failed");
		}
		return created;
	}

	async findByAgentId(agentId: string): Promise<ResponseRule[]> {
		return this.db
			.select()
			.from(responses)
			.where(eq(responses.idAgent, agentId));
	}

	async update(
		id: string,
		data: Partial<Pick<ResponseRule, "keyword" | "response">>,
	): Promise<ResponseRule> {
		await this.db
			.update(responses)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(responses.id, id));

		const updated = await this.findById(id);
		if (!updated) {
			throw new Error("[RESPONSE REPO 002] Response update failed");
		}
		return updated;
	}
}
