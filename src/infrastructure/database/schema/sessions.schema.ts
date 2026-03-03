import { sql } from "drizzle-orm";
import { mysqlTable, int, varchar, datetime } from "drizzle-orm/mysql-core";
import { clients } from "./clients.schema";

export const sessions = mysqlTable("sessions", {
    id: int("id").primaryKey().autoincrement(),
    idCliente: int("id_cliente").references(()=>clients.id),
    createdAt: datetime("created_at").notNull().default(sql`now()`)
});

