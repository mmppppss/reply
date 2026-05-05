import { BaseRepository } from "./base.repo";
import { agents } from "../schema/agents.schema";
import { eq } from "drizzle-orm";
import { Agent } from "../types/agent.type";
import { randomUUID } from "crypto";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export class AgentRepository extends BaseRepository<
	typeof agents,
	string
> {
	constructor(dbInstance: PostgresJsDatabase<any>) {
		super(dbInstance, agents, agents.id);
	}

	async findByUserId(userId: string): Promise<Agent[]> {
		return this.db
			.select()
			.from(agents)
			.where(eq(agents.idUser, userId));
	}

	async create(name: string, description: string, userId: string): Promise<Agent> {
		const id = randomUUID();
		await this.db.insert(agents).values({
			id,
			name,
			description,
			idUser: userId,
		});

		const created = await this.findById(id);
		if (!created) {
			throw new Error("[AGENT REPO 001] Agent creation failed");
		}

		return created;
	}

	async update(id: string, data: Partial<Agent>): Promise<Agent> {
		await this.db
			.update(agents)
			.set(data)
			.where(eq(this.idColumn, id));

		const updated = await this.findById(id);
		if (!updated) {
			throw new Error("[AGENT REPO 002] Agent update failed");
		}

		return updated;
	}
}
