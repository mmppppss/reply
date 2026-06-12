import { knowledgeRepo } from "@/infrastructure/database/repositories";
import { KnowledgeEntry } from "@/infrastructure/database/types/knowledge.type";

function mergeItems(existing: any, incoming: any): any {
	if (existing == null) return incoming;

	if (Array.isArray(existing) && Array.isArray(incoming)) {
		return [...existing, ...incoming];
	}

	if (Array.isArray(existing) && !Array.isArray(incoming)) {
		return [...existing, incoming];
	}

	return incoming;
}

export class KnowledgeService {
	async getByAgentId(agentId: string): Promise<KnowledgeEntry | null> {
		return knowledgeRepo.findByAgentId(agentId);
	}

	async upload(
		agentId: string,
		data: any,
	): Promise<KnowledgeEntry> {
		const existing = await knowledgeRepo.findByAgentId(agentId);
		const merged = mergeItems(existing?.data, data);
		return knowledgeRepo.upsert(agentId, merged);
	}

	async remove(agentId: string): Promise<void> {
		await knowledgeRepo.deleteByAgentId(agentId);
	}
}
