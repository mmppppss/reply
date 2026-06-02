import { sessions } from "../schema/sessions.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { BaseRepository } from "./base.repo";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export class SessionRepository extends BaseRepository<typeof sessions, string> {
	constructor(dbInstance: PostgresJsDatabase<any>) {
		super(dbInstance, sessions, sessions.id);
	}

	async create(idAgent: string, idProvider?: string): Promise<any> {
		const id = randomUUID();
		await this.db.insert(sessions).values({
			id,
			idAgent,
			idProvider,
		});

		const created = await this.findById(id);
		if (!created) {
			throw new Error("[SESSION REPO 001] Session creation failed");
		}

		return created;
	}

	async findByAgentId(idAgent: string): Promise<any> {
		const session = await this.db
			.select()
			.from(sessions)
			.where(eq(sessions.idAgent, idAgent));

		return session ?? null;
	}

	async findByStatus(status: string): Promise<any> {
		const session = await this.db
			.select()
			.from(sessions)
			.where(eq(sessions.status, status));

		return session ?? null;
	}

	async updateStatus(id: string, status: string): Promise<void> {
		await this.db
			.update(sessions)
			.set({
				status,
				updatedAt: new Date(),
			})
			.where(eq(sessions.id, id));
	}

	async updateConfig(id: string, config: Record<string, any>): Promise<void> {
		await this.db
			.update(sessions)
			.set({
				config,
				updatedAt: new Date(),
			})
			.where(eq(sessions.id, id));
	}

	async deleteByAgentId(idAgent: string): Promise<void> {
		await this.db
			.delete(sessions)
			.where(eq(sessions.idAgent, idAgent));
	}
}
