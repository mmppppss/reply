import { Logger } from "@/infrastructure/logging/Logger";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const logger = new Logger();
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno");
}

const pool = mysql.createPool({
	uri: connectionString,
	ssl: { rejectUnauthorized: true }
}).on("acquire",()  => {
	logger.success("Database conected", {system: true});
});

export const db = drizzle(pool);
