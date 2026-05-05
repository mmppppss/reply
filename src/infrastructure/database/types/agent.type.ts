import { InferSelectModel } from "drizzle-orm";
import { agents } from "../schema/agents.schema";

export type Agent = InferSelectModel<typeof agents>;
