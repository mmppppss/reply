const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

interface GeminiMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

interface GeminiResponse {
	choices: Array<{
		message: {
			content: string;
		};
	}>;
	error?: {
		message: string;
	};
}

export class GeminiService {
	private apiKey: string;
	private defaultModel: string;

	constructor(apiKey: string, defaultModel: string) {
		this.apiKey = apiKey;
		this.defaultModel = defaultModel;
	}

	async chat(
		messages: GeminiMessage[],
		options?: {
			model?: string;
			temperature?: number;
			maxTokens?: number;
		},
	): Promise<string | null> {
		try {
			const response = await fetch(GEMINI_API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					model: options?.model || this.defaultModel,
					messages,
					temperature: options?.temperature ?? 0.7,
					max_tokens: options?.maxTokens ?? 500,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`[Gemini] HTTP ${response.status}: ${errorText}`);
				return null;
			}

			const data = await response.json() as GeminiResponse;

			if (data.error) {
				console.error(`[Gemini] API error: ${data.error.message}`);
				return null;
			}

			const content = data.choices?.[0]?.message?.content;
			return content || null;
		} catch (error) {
			console.error(`[Gemini] Request failed:`, error);
			return null;
		}
	}
}
