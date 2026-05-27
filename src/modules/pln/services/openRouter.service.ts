// todo mover a .env
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface OpenRouterMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
    error?: {
        message: string;
    };
}

export class OpenRouterService {
    private apiKey: string;
    private defaultModel: string;

    constructor(apiKey: string, defaultModel: string) {
        this.apiKey = apiKey;
        this.defaultModel = defaultModel;
    }

    async chat(
        messages: OpenRouterMessage[],
        options?: {
            model?: string;
            temperature?: number;
            maxTokens?: number;
        },
    ): Promise<string | null> {
        try {
            const response = await fetch(OPENROUTER_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
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
                console.error(`[OpenRouter] HTTP ${response.status}: ${errorText}`);
                return null;
            }

            const data = await response.json() as OpenRouterResponse;

            if (data.error) {
                console.error(`[OpenRouter] API error: ${data.error.message}`);
                return null;
            }

            const content = data.choices?.[0]?.message?.content;
            return content || null;
        } catch (error) {
            console.error(`[OpenRouter] Request failed:`, error);
            return null;
        }
    }
}
