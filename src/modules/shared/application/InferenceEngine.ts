import { BotManager } from "@/modules/whatsapp/application/BotManager";
import { responseRepo } from "@/infrastructure/database/repositories";
import { ResponseRule } from "@/infrastructure/database/types/response.type";

export class InferenceEngine {
	private static instance: InferenceEngine;
	private cache: Map<string, ResponseRule[]> = new Map();

	private constructor() {}

	static getInstance(): InferenceEngine {
		if (!InferenceEngine.instance) {
			InferenceEngine.instance = new InferenceEngine();
		}
		return InferenceEngine.instance;
	}

	async loadAll(): Promise<void> {
		const all: ResponseRule[] = await responseRepo.findAll();
		this.cache.clear();
		for (const rule of all) {
			const arr = this.cache.get(rule.idAgent) || [];
			arr.push(rule);
			this.cache.set(rule.idAgent, arr);
		}
		console.log(`[InferenceEngine] ${all.length} reglas cargadas en cache`);
	}

	async reload(agentId: string): Promise<void> {
		const rules = await responseRepo.findByAgentId(agentId);
		this.cache.set(agentId, rules);
	}

	async process(
		agentId: string,
		text: string,
		sessionId: string,
		chatId: string,
	): Promise<void> {
		const rules = this.cache.get(agentId);
		if (!rules || rules.length === 0) return;

		const lower = text.toLowerCase();
		for (const rule of rules) {
			if (lower.includes(rule.keyword.toLowerCase())) {
				await BotManager.getInstance().sendMessage(sessionId, chatId, rule.response);
				return;
			}
		}
	}
}
