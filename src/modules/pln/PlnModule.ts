import { IAgentModule } from "@/modules/shared/domain/IAgentModule";
import { OpenRouterService } from "./services/openRouter.service";
import { KnowledgeRepository } from "@/infrastructure/database/repositories/knowledge.repo";

export class PlnModule implements IAgentModule {
	readonly key = "pln";
	private openRouter: OpenRouterService;
	private knowledgeRepo: KnowledgeRepository;

	constructor(
		apiKey: string,
		defaultModel: string,
		knowledgeRepo: KnowledgeRepository,
	) {
		this.openRouter = new OpenRouterService(apiKey, defaultModel);
		this.knowledgeRepo = knowledgeRepo;
	}

	async process(
		agentId: string,
		text: string,
		_sessionId: string,
		_chatId: string,
		config: Record<string, any>,
	): Promise<string | null> {
		let systemPrompt = (config.systemPrompt as string) ||
			"Eres un asistente útil y amigable. Responde de forma clara y concisa.";

		const knowledgeEntry = await this.knowledgeRepo.findByAgentId(agentId);
		if (knowledgeEntry) {
			const knowledgeBlock = JSON.stringify(knowledgeEntry.data, null, 2);
			systemPrompt += `\n\nInformación de contexto disponible:\n${knowledgeBlock}`;
		}

		const options: Record<string, any> = {};
		if (config.model) options.model = config.model;
		if (config.temperature != null) options.temperature = config.temperature;
		if (config.maxTokens != null) options.maxTokens = config.maxTokens;

		const messages = [
			{ role: "system" as const, content: systemPrompt },
			{ role: "user" as const, content: text },
		];

		let response = await this.openRouter.chat(messages, options);

		if (response === null) {
			console.log(`[PLN] OpenRouter no respondió, reintentando...`);
			response = await this.openRouter.chat(messages, options);
		}

		console.log(response);

		return response;
	}
}
