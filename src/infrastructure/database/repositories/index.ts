import { db } from "..";

import { UserRepository } from "./user.repo";
import { SessionRepository } from "./session.repo";
import { AgentRepository } from "./agent.repo";
import { ProviderRepository } from "./provider.repo";

export const userRepo = new UserRepository(db);
export const sessionRepo = new SessionRepository(db);
export const agentRepo = new AgentRepository(db);
export const providerRepo = new ProviderRepository(db);
