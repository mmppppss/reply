import { InferSelectModel } from "drizzle-orm";
import { agentConfig } from "../schema/agent-config.schema";

export type AgentConfig = InferSelectModel<typeof agentConfig>;
