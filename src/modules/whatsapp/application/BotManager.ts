import { IBotConnector, BotEvents } from "@/modules/shared/domain/IBotConnector";
import { WhatsAppConnector } from "../infrastructure/WhatsAppConector";
import { TelegramConnector } from "@/modules/telegram/infrastructure/TelegramConnector";

export class BotManager {
	private static instance: BotManager;
	private bots: Map<string, IBotConnector> = new Map();

	private constructor() {}

	static getInstance(): BotManager {
		if (!BotManager.instance) {
			BotManager.instance = new BotManager();
		}
		return BotManager.instance;
	}

	async start(
		sessionId: string,
		provider: string,
		events?: BotEvents,
		config?: Record<string, any>,
	): Promise<IBotConnector> {
		const existing = this.bots.get(sessionId);
		if (existing) {
			return existing;
		}

		let connector: IBotConnector;

		if (provider === "whatsapp") {
			connector = new WhatsAppConnector({ sessionId, events: events! });
		} else if (provider === "telegram") {
			const token = config?.token;
			if (!token) {
				throw new Error("Telegram token is required");
			}
			connector = new TelegramConnector({ sessionId, token, events: events! });
		} else {
			throw new Error(`Unsupported provider: ${provider}`);
		}

		this.bots.set(sessionId, connector);
		await connector.connect(events);
		return connector;
	}

	async stop(sessionId: string): Promise<void> {
		const connector = this.bots.get(sessionId);
		if (!connector) return;

		await connector.disconnect();
		this.bots.delete(sessionId);
	}

	async sendMessage(
		sessionId: string,
		destination: string,
		text: string,
	): Promise<{ success: boolean; messageId?: string; error?: string }> {
		const connector = this.bots.get(sessionId);
		if (!connector) {
			return { success: false, error: "Bot not found or not started" };
		}
		return connector.sendMessage(destination, text);
	}

	getConnector(sessionId: string): IBotConnector | undefined {
		return this.bots.get(sessionId);
	}

	getStatus(sessionId: string) {
		return this.bots.get(sessionId)?.getConnectionStatus() ?? null;
	}

	getAllBots(): Map<string, IBotConnector> {
		return this.bots;
	}
}
