// @ts-check
import { sessions } from "../schema/sessions.schema";
import { MySql2Database } from "drizzle-orm/mysql2";
import { BaseRepository } from "./base.repo";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";


export class SessionRepository extends BaseRepository<
	typeof sessions,
	string
> {
	constructor(dbInstance: MySql2Database<any>) {
		super(dbInstance, sessions, sessions.id);
	}

	async create(idUser: string): Promise<any> {
		const id = randomUUID();
		await this.db.insert(sessions).values({
			id,
			idUser
		});

		const created = await this.findById(id);
		if (!created) {
			throw new Error("[SESSION REPO 001] Session creation failed");
		}

		return created;
	}

	async findByUserId(idUser: string): Promise<any> {
		const session = await this.db
			.select()
			.from(sessions)
			.where(eq(sessions.idUser, idUser));

		return session ?? null;
	}
}
