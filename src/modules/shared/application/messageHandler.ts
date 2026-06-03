import { ModuleRegistry } from "./ModuleRegistry";
import { processMessage } from "@/modules/whatsapp/application/messageProcessor";
import { Logger } from "@/infrastructure/logging/Logger";

const logger = new Logger();

export function handleWhatsAppMessage(session: { idAgent?: string | null; id: string }, msg: any): void {
	if (msg.key?.fromMe) return;

	const message = processMessage(msg);
	const text = message?.text;
	logger.info(JSON.stringify(text), { botId: session.id });

	if (text && session.idAgent) {
		const chatJid = msg.key.remoteJid as string;
		const isGroup = message!.isGroup;
		const fromJid = isGroup ? (msg.key.participant as string) : chatJid;
		const chatType = isGroup ? "group" : "private";

		ModuleRegistry.getInstance()
			.process(session.idAgent, text, session.id, chatJid, fromJid, chatType, chatJid, "whatsapp")
			.catch((err) =>
				logger.error(
					"WhatsApp process error",
					err instanceof Error ? err : new Error(String(err)),
					{ botId: session.id },
				),
			);
	}
}

export function handleTelegramMessage(session: { idAgent?: string | null; id: string }, msg: any): void {
	const text = msg.text || "";
	const groupInfo = msg.isGroup ? " [grupo]" : "";
	logger.info(`Telegram${groupInfo} de:${msg.from} chat:${msg.chatId} texto:${text}`, { botId: session.id });

	if (text && session.idAgent) {
		const chatType = msg.isGroup ? "group" : "private";

		ModuleRegistry.getInstance()
			.process(session.idAgent, text, session.id, msg.chatId, msg.from, chatType, msg.chatId, "telegram")
			.catch((err) =>
				logger.error(
					"Telegram process error",
					err instanceof Error ? err : new Error(String(err)),
					{ botId: session.id },
				),
			);
	}
}
