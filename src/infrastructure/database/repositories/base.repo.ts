import { MySqlTable } from "drizzle-orm/mysql-core";
import { eq, InferSelectModel } from "drizzle-orm";
import { db } from "..";
export abstract class BaseRepository<
	TTable extends MySqlTable,
	TId
> {
	constructor(
		protected table: TTable,
		protected idColumn: TTable["_"]["columns"][string]
	) { }

	async findAll(): Promise<InferSelectModel<TTable>[]> {
		return db.select().from(this.table);
	}

	async findById(
		id: TId
	): Promise<InferSelectModel<TTable> | null> {
		const result = await db
			.select()
			.from(this.table)
			.where(eq(this.idColumn as any, id))
			.limit(1);

		return result[0] ?? null;
	}
}
