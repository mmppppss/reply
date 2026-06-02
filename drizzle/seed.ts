import { db } from "../src/infrastructure/database";
import { providers } from "../src/infrastructure/database/schema/providers.schema";

async function seed() {
	await db.insert(providers).values([
		{ name: "telegram" },
		{ name: "whatsapp" },
	]).onConflictDoNothing();

	console.log("Seed completado: providers insertados");
}

seed();
