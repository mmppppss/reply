import { db } from "..";

import { UserRepository } from "./user.repo";
import { SessionRepository } from "./session.repo";
import { AgentRepository } from "./agent.repo";
import { ProviderRepository } from "./provider.repo";
import { ResponseRepository } from "./response.repo";
import { AgentModuleRepository } from "./agent-module.repo";
import { AgentConfigRepository } from "./agent-config.repo";
import { MessageRepository } from "./message.repo";
import { ContactRepository } from "./contact.repo";
import { KnowledgeRepository } from "./knowledge.repo";

export const userRepo = new UserRepository(db);
export const sessionRepo = new SessionRepository(db);
export const agentRepo = new AgentRepository(db);
export const providerRepo = new ProviderRepository(db);
export const responseRepo = new ResponseRepository(db);
export const agentModuleRepo = new AgentModuleRepository(db);
export const agentConfigRepo = new AgentConfigRepository(db);
export const messageRepo = new MessageRepository(db);
export const contactRepo = new ContactRepository(db);
export const knowledgeRepo = new KnowledgeRepository(db);
