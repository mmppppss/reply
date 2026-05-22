import { db } from "../src/infrastructure/database";
import { users } from "../src/infrastructure/database/schema/users.schema";
import { providers } from "../src/infrastructure/database/schema/providers.schema";
import { hashSync } from "bcrypt";

async function seed() {
	const password = hashSync("mps", 10);

	await db.insert(users).values([
		{ username: "admin", email: "me@mpps.qzz.io", password }
	]).onConflictDoNothing();

	await db.insert(providers).values([
		{ name: "telegram" }
	]).onConflictDoNothing();

	console.log("Seed completado");
}

seed();