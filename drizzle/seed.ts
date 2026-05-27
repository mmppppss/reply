import { db } from "../src/infrastructure/database";
import { users } from "../src/infrastructure/database/schema/users.schema";
import { providers } from "../src/infrastructure/database/schema/providers.schema";
import { agents } from "../src/infrastructure/database/schema/agents.schema";
import { agentModules } from "../src/infrastructure/database/schema/agent-module.schema";
import { hashSync } from "bcrypt";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

async function seed() {
	const password = hashSync("mps", 10);

	await db.insert(users).values([
		{ username: "admin", email: "me@mpps.qzz.io", password }
	]).onConflictDoNothing();

	await db.insert(providers).values([
		{ name: "telegram" },
		{ name: "whatsapp" }
	]).onConflictDoNothing();

	// Registrar módulos por defecto para cada agente existente
	const allAgents = await db.select().from(agents);

	for (const agent of allAgents) {
		const existing = await db
			.select()
			.from(agentModules)
			.where(
				and(
					eq(agentModules.idAgent, agent.id),
					eq(agentModules.moduleKey, "keyword"),
				),
			)
			.limit(1);

		if (!existing.length) {
			await db.insert(agentModules).values({
				id: randomUUID(),
				idAgent: agent.id,
				moduleKey: "keyword",
				enabled: true,
				priority: 0,
				config: {},
			});
			console.log(`  Módulo 'keyword' agregado al agente ${agent.id}`);
		}
	}

	console.log("Seed completado");
}

seed();