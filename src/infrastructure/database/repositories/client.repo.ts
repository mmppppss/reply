import { db } from "../index";
import { clients } from "../schema/clients.schema";
import { Client, CreateClientDto } from "../../../types/client";
import { eq } from "drizzle-orm";

export class ClientsRepo {
	async findAll(): Promise<Client[]> {
		return db.select().from(clients);
	}

	async findById(id: number): Promise<Client | null> {
		const result = await db
			.select()
			.from(clients)
			.where(eq(clients.id, id))
			.limit(1);

		return result[0] ?? null;
	}

	async create(data: CreateClientDto): Promise<boolean> {
		const result = await db
			.insert(clients)
			.values(data)
			.returning();
		return result.length > 0;
	}

	async update(id: number, data: Partial<CreateClientDto>): Promise<boolean> {
		const result = await db
			.update(clients)
			.set(data)
			.where(eq(clients.id, id))
			.returning();

		return result.length > 0;
	}

	async deleteById(id: number): Promise<boolean> {
		const result = await db
			.delete(clients)
			.where(eq(clients.id, id))
			.returning();

		return result.length > 0;
	}
}