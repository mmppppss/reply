import { Logger } from "@/infrastructure/logging/Logger";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const logger = new Logger();
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno");
}

const queryClient = postgres(connectionString);

(async () => {
	try {
		await queryClient`SELECT 1`;
		logger.success("Database conected", {system: true});
	} catch (err) {
		logger.error("Database connection failed", {system: true, extra: err});
	}
})();

export const db = drizzle(queryClient);