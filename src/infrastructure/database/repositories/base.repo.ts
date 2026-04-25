import { eq, InferSelectModel } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Table } from "drizzle-orm";
export abstract class BaseRepository<
	TTable extends Table,
	TId
> {
	constructor(
		protected readonly db: PostgresJsDatabase<any>,
		protected table: TTable,
		protected idColumn: any
	) { }

	async findAll(): Promise<any[]> {
		return this.db.select().from(this.table as any);
	}

	async findById(
		id: TId
	): Promise<any | null> {
		const result = await this.db
			.select()
			.from(this.table as any)
			.where(eq(this.idColumn as any, id))
			.limit(1);

		return result[0] ?? null;
	}

	async deleteById(id: TId) {
		const result = await this.db
			.delete(this.table as any)
			.where(eq(this.idColumn as any, id))
		return result;
	}
}