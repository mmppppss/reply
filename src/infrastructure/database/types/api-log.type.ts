import { InferSelectModel } from "drizzle-orm";
import { apiLogs } from "../schema/api-logs.schema";

export type ApiLog = InferSelectModel<typeof apiLogs>;
