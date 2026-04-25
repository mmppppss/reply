import { BaseRepository } from "./base.repo";
import { users } from "../schema/users.schema";
import { eq } from "drizzle-orm";
import { User } from "../types/user.type";
import { randomUUID } from "crypto";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export class UserRepository extends BaseRepository<
	typeof users,
	string
> {
	constructor(dbInstance: PostgresJsDatabase<any>) {
		super(dbInstance, users, users.id);
	}

	async findByEmail(email: string): Promise<User | null> {
		const result = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		return result[0] ?? null;
	}


	async findByUsername(username: string): Promise<User | null> {
		const result = await this.db
			.select()
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		return result[0] ?? null;
	}

	async create(username: string, email: string, password: string): Promise<User> {
		const id = randomUUID();
		await this.db.insert(users).values({
			id,
			username,
			email,
			password,
		});

		const created = await this.findById(id);
		if (!created) {
			throw new Error("[USER REPO 001] User creation failed");
		}

		return created;
	}

}