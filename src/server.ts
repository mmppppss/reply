import { Logger } from "@/infrastructure/logging/Logger";
import { printQR } from "@/infrastructure/runtime/printQR";
import { BotManager } from "@/modules/whatsapp/application/BotManager";
import { handleWhatsAppMessage, handleTelegramMessage } from "@/modules/shared/application/messageHandler";
import { sessionRepo, providerRepo } from "./infrastructure/database/repositories";
import { Session } from "./infrastructure/database/types/session.type";

export default async function server() {
	const logger = new Logger();
	const sessions = await sessionRepo.findByStatus("C");
	const botManager = BotManager.getInstance();

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
					onMessage: (msg) => handleWhatsAppMessage(session, msg),
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
					onMessage: (msg: any) => handleTelegramMessage(session, msg),
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
