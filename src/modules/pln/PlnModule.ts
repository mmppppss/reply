import { IAgentModule } from "@/modules/shared/domain/IAgentModule";
import { GeminiService } from "./services/gemini.service";
import { OpenRouterService } from "./services/openRouter.service";
import { agentRepo, knowledgeRepo } from "@/infrastructure/database/repositories";

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
	whatsapp: `- Máximo 300 caracteres por mensaje
- Usa texto plano, sin markdown ni formato especial
- Emojis con moderación (1-2 por mensaje máximo)
- Tono conversacional natural
- Un párrafo corto o dos líneas máximo
- Responde directo al grano, sin introducciones`,
	telegram: `- Máximo 500 caracteres por mensaje
- Puedes usar Markdown: *negrita*, _cursiva_, \`código\`
- Emojis permitidos
- Respuestas más detalladas que en WhatsApp
- Puedes separar en párrafos cortos
- Usa listas con - si es necesario`,
};

function buildPlatformInfo(platform?: string): string {
	if (!platform) return "";
	const instructions = PLATFORM_INSTRUCTIONS[platform];
	if (!instructions) return "";
	return `<channel>${platform}</channel>

<format_rules>
${instructions}
</format_rules>`;
}

export class PlnModule implements IAgentModule {
	readonly key = "pln";
	private gemini: GeminiService;
	private openRouter: OpenRouterService;

	constructor(
		apiKey: string,
		geminiApiKey: string,
		geminiModel: string,
		defaultModel: string,
	) {
		this.gemini = new GeminiService(geminiApiKey, geminiModel);
		this.openRouter = new OpenRouterService(apiKey, defaultModel);
	}

	async process(
		agentId: string,
		text: string,
		_sessionId: string,
		_chatId: string,
		config: Record<string, any>,
		platform?: string,
	): Promise<string | null> {
		const agent = await agentRepo.findById(agentId).catch(() => null);

		const userPrompt = (config.systemPrompt as string) ||
			"Eres un asistente útil y amigable. Responde de forma clara y concisa.";

		const knowledgeEntry = await knowledgeRepo.findByAgentId(agentId);
		const knowledgeBlock = knowledgeEntry
			? JSON.stringify(knowledgeEntry.data, null, 2)
			: null;

		const parts: string[] = [];

		parts.push(`<agent_profile>
  <name>${agent?.name || "Sin nombre"}</name>
  <description>${agent?.description || ""}</description>
</agent_profile>`);

		const platformInfo = buildPlatformInfo(platform);
		if (platformInfo) parts.push(platformInfo);

		parts.push(`<user_config>
${userPrompt}
</user_config>`);

		if (knowledgeBlock) {
			parts.push(`<knowledge_base>
${knowledgeBlock}
</knowledge_base>`);
		}

		const systemPrompt = parts.join("\n\n");

		const options: Record<string, any> = {};
		if (config.model) options.model = config.model;
		if (config.temperature != null) options.temperature = config.temperature;
		if (config.maxTokens != null) options.maxTokens = config.maxTokens;

		const messages = [
			{ role: "system" as const, content: systemPrompt },
			{ role: "user" as const, content: text },
		];

		let response = await this.gemini.chat(messages, options);

		if (response === null) {
			console.log(`[PLN] Gemini no respondió, reintentando con OpenRouter...`);
			response = await this.openRouter.chat(messages, options);
		}

		console.log(response);

		return response;
	}
}
