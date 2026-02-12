// @ts-check
import { eq } from "drizzle-orm";
import { db } from "../index";
import { sessions } from "../schema/sessions.schema";


export class Session {
	/**
	 * Find all sessions
	 *
	 * @returns array sesions
	 */
	async findAll() {
		return db.select().from(sessions);
	}

	/**
	 * Create 
	 *
	 */
	async create(data: any) {
		const result = await db
			.insert(sessions)
			.values(data);
		return result;
	}
	/**
	 * deleteById.
	 *
	 * @param {number} id
	 */
	async deleteById(id: number) {
		const result = await db
			.delete(sessions)
			.where(eq(sessions.id, id))
		return result;
	}
	/**
	 * update.
	 *
	 * @param {number} id
	 * @param {any} data
	 */
	async update(id: number, data: any) {
		const result = await db
			.update(sessions)
			.set(data)
			.where(eq(sessions.id, id))
		return result[0].affectedRows > 0;
	}

}
