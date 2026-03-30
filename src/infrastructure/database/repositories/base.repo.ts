import { MySqlTable } from "drizzle-orm/mysql-core";
import { eq, InferSelectModel } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
export abstract class BaseRepository<
	TTable extends MySqlTable,
	TId
> {
	constructor(
		protected readonly db: MySql2Database<any>,
		protected table: TTable,
		protected idColumn: TTable["_"]["columns"][string]
	) { }

	async findAll(): Promise<InferSelectModel<TTable>[]> {
		return this.db.select().from(this.table);
	}

	async findById(
		id: TId
	): Promise<InferSelectModel<TTable> | null> {
		const result = await this.db
			.select()
			.from(this.table)
			.where(eq(this.idColumn as any, id))
			.limit(1);

		return result[0] ?? null;
	}

	/**
	 * deleteById.
	 *
	 * @param {number} id
	 */
	async deleteById(id: number) {
		const result = await this.db
			.delete(this.table)
			.where(eq(this.idColumn as any, id))
		return result;
	}
}
