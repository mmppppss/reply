import { InferSelectModel } from "drizzle-orm";
import { knowledge } from "../schema/knowledge.schema";

export type KnowledgeEntry = InferSelectModel<typeof knowledge>;
