import { Telegraf, Context } from "telegraf";
import { BotEvents, IBotConnector } from "@/modules/shared/domain/IBotConnector";

export interface TelegramConnectorOptions {
	sessionId: string;
	token: string;
	events?: BotEvents;
}

export class TelegramConnector implements IBotConnector {
	readonly sessionId: string;
	readonly platform = "telegram";
	private client: Telegraf | null = null;
	private readonly token: string;
	private events: BotEvents | undefined;
	private connectionStatus: "disconnected" | "connecting" | "connected" =
		"disconnected";
	private connectionError: string | null = null;

	constructor(options: TelegramConnectorOptions) {
		this.sessionId = options.sessionId;
		this.token = options.token;
		this.events = options.events;
	}

	async connect(events?: BotEvents): Promise<void> {
		if (events) this.events = events;

		if (this.connectionStatus === "connected" && this.client) return;

		this.connectionStatus = "connecting";
		this.connectionError = null;

		try {
			this.client = new Telegraf(this.token);

			const botInfo = await this.client.telegram.getMe();
			console.log(`[Telegram] Bot connected: @${botInfo.username}`);

			this.client.on("message", (ctx: Context) => {
				const msg = ctx.message as any;
				this.events?.onMessage?.({
					chatId: String(ctx.chat?.id),
					from: String(ctx.from?.id),
					text: msg?.text || "",
					timestamp: msg?.date || Date.now(),
					isGroup: ctx.chat?.type === "group" || ctx.chat?.type === "supergroup",
					platform: "telegram",
				});
			});

			this.client.launch().catch((err) => {
				console.error(`[Telegram] Polling error: ${err.message}`);
				this.connectionStatus = "disconnected";
				this.connectionError = err.message;
				this.events?.onConnectionStatus?.("disconnected");
				this.events?.onDisconnected?.(undefined, err.message);
			});

			this.connectionStatus = "connected";
			this.events?.onConnected?.();
			this.events?.onConnectionStatus?.("connected");
		} catch (error) {
			this.connectionStatus = "disconnected";
			this.connectionError =
				error instanceof Error ? error.message : "Failed to connect";
			this.client = null;
			this.events?.onConnectionStatus?.("disconnected");
			this.events?.onDisconnected?.(undefined, this.connectionError);
			throw error;
		}
	}

	async sendMessage(
		chatId: string,
		text: string,
	): Promise<{ success: boolean; messageId?: string; error?: string }> {
		if (!this.client || this.connectionStatus !== "connected") {
			return { success: false, error: "Telegram bot not connected" };
		}

		try {
			const result = await this.client.telegram.sendMessage(chatId, text);
			return {
				success: true,
				messageId: String(result.message_id),
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	getConnectionStatus() {
		return {
			status: this.connectionStatus,
			error: this.connectionError,
		};
	}

	async disconnect(): Promise<void> {
		if (this.client) {
			try {
				await this.client.stop();
			} catch {
				// ignore
			}
			this.client = null;
		}
		this.connectionStatus = "disconnected";
		this.connectionError = null;
	}
}
