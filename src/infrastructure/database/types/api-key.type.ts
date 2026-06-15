import { InferSelectModel } from "drizzle-orm";
import { apiKeys } from "../schema/api-keys.schema";

export type ApiKey = InferSelectModel<typeof apiKeys>;
