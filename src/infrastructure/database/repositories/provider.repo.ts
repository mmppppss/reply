import { providers } from "../schema/providers.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { BaseRepository } from "./base.repo";
import { eq } from "drizzle-orm";

export class ProviderRepository extends BaseRepository<
	typeof providers,
	string
> {
	constructor(dbInstance: PostgresJsDatabase<any>) {
		super(dbInstance, providers, providers.id);
	}

	async findByName(name: string): Promise<any> {
		const result = await this.db
			.select()
			.from(providers)
			.where(eq(providers.name, name))
			.limit(1);
		return result[0] || null;
	}
}
