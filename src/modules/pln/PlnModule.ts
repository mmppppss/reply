import { IAgentModule } from "@/modules/shared/domain/IAgentModule";
import { OpenRouterService } from "./services/openRouter.service";

export class PlnModule implements IAgentModule {
	readonly key = "pln";
	private openRouter: OpenRouterService;

	constructor(apiKey: string, defaultModel: string) {
		this.openRouter = new OpenRouterService(apiKey, defaultModel);
	}

	async process(
		_agentId: string,
		text: string,
		_sessionId: string,
		_chatId: string,
		config: Record<string, any>,
	): Promise<string | null> {
		const systemPrompt = (config.systemPrompt as string) ||
			"Eres un asistente útil y amigable. Responde de forma clara y concisa.";

		const options: Record<string, any> = {};
		if (config.model) options.model = config.model;
		if (config.temperature != null) options.temperature = config.temperature;
		if (config.maxTokens != null) options.maxTokens = config.maxTokens;

		const response = await this.openRouter.chat(
			[
				{ role: "system", content: systemPrompt },
				{ role: "user", content: text },
			],
			options,
		);

		console.log(response);


		return response;
	}
}
