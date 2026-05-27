import { Logger } from "@/infrastructure/logging/Logger";
import { printQR } from "@/infrastructure/runtime/printQR";
import { processMessage } from "@/modules/whatsapp/application/messageProcessor";
import { BotManager } from "@/modules/whatsapp/application/BotManager";
import { ModuleRegistry } from "@/modules/shared/application/ModuleRegistry";
import { sessionRepo, providerRepo } from "./infrastructure/database/repositories";
import { Session } from "./infrastructure/database/types/session.type";

export default async function server() {
	const logger = new Logger();
	const sessions = await sessionRepo.findByStatus("C");
	const botManager = BotManager.getInstance();
	const moduleRegistry = ModuleRegistry.getInstance();

	await Promise.all(
		sessions.map(async (session: Session) => {
			const provider = session.idProvider ? await providerRepo.findById(session.idProvider) : null;

			if (!provider) {
				logger.warn(`Provider not found for session ${session.id}`);
				return;
			}

			logger.info(`conectando ${provider.name}`, { botId: session.id });

			if (provider.name === "whatsapp") {
				return botManager.start(session.id, provider.name, {
					onQR: (qr) => {
						logger.info("QR", { botId: session.id });
						printQR(qr);
					},
					onConnected: () => {
						logger.info("WhatsApp conectado", { botId: session.id });
					},
					onMessage: (msg) => {
						const message = processMessage(msg);
						const text = message?.text;
						logger.info(JSON.stringify(text), { botId: session.id });
						if (text && session.idAgent) {
							moduleRegistry.process(session.idAgent, text, session.id, message!.fromJid);
						}
					},
					onDisconnected(reason) {
						logger.info(`WhatsApp desconectado ${reason}`, {
							botId: session.id,
						});
						botManager.start(session.id, provider.name);
					},
				});
			}

			if (provider.name === "telegram") {
				const config = (session as any).config || {};
				return botManager.start(session.id, provider.name, {
					onConnected: () => {
						logger.info("Telegram bot conectado", { botId: session.id });
					},
					onMessage: (msg: any) => {
						const text = msg.text || "";
						const groupInfo = msg.isGroup ? " [grupo]" : "";
						logger.info(`Telegram${groupInfo} de:${msg.from} chat:${msg.chatId} texto:${text}`, { botId: session.id });
						if (text && session.idAgent) {
							moduleRegistry.process(session.idAgent, text, session.id, msg.chatId);
						}
					},
					onDisconnected(_reason, error) {
						logger.info(`Telegram desconectado ${error}`, {
							botId: session.id,
						});
					},
				}, { token: config.token });
			}
		}),
	);

	logger.info("Server started");
}
