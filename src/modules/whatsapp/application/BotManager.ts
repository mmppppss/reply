import { WhatsAppConnector, WhatsAppConnectorEvents } from "../infrastructure/WhatsAppConector";

export class BotManager {
	private static instance: BotManager;
	private bots: Map<string, WhatsAppConnector> = new Map();

	private constructor() {}

	static getInstance(): BotManager {
		if (!BotManager.instance) {
			BotManager.instance = new BotManager();
		}
		return BotManager.instance;
	}

	async start(sessionId: string, events?: WhatsAppConnectorEvents): Promise<WhatsAppConnector> {
		const existing = this.bots.get(sessionId);
		if (existing) {
			return existing;
		}

		const connector = new WhatsAppConnector({ sessionId, events });
		this.bots.set(sessionId, connector);
		await connector.connect();
		return connector;
	}

	async stop(sessionId: string): Promise<void> {
		const connector = this.bots.get(sessionId);
		if (!connector) return;

		await connector.logout();
		this.bots.delete(sessionId);
	}

	async sendMessage(
		sessionId: string,
		jid: string,
		text: string,
	): Promise<{ success: boolean; messageId?: string; error?: string }> {
		const connector = this.bots.get(sessionId);
		if (!connector) {
			return { success: false, error: "Bot not found or not started" };
		}
		return connector.sendMessage(jid, text);
	}

	getConnector(sessionId: string): WhatsAppConnector | undefined {
		return this.bots.get(sessionId);
	}

	getStatus(sessionId: string) {
		return this.bots.get(sessionId)?.getConnectionStatus() ?? null;
	}

	getAllBots(): Map<string, WhatsAppConnector> {
		return this.bots;
	}
}
