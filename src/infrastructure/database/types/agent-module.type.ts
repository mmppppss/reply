import { InferSelectModel } from "drizzle-orm";
import { agentModules } from "../schema/agent-module.schema";

export type AgentModule = InferSelectModel<typeof agentModules>;
