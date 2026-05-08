import { Logger } from "@/infrastructure/logging/Logger";
import { printQR } from "@/infrastructure/runtime/printQR";
import { processMessage } from "@/modules/whatsapp/application/messageProcessor";
import { BotManager } from "@/modules/whatsapp/application/BotManager";
import { sessionRepo } from "./infrastructure/database/repositories";
import { Session } from "./infrastructure/database/types/session.type";

export default async function server() {
	const logger = new Logger();
	const sessions = await sessionRepo.findByStatus("C");
	const botManager = BotManager.getInstance();

	await Promise.all(
		sessions.map((session: Session) => {
			logger.info("conectando", { botId: session.id });
			return botManager.start(session.id, {
				onQR: (qr) => {
					logger.info("QR", { botId: session.id });
					printQR(qr);
				},
				onConnected: () => {
					logger.info("WhatsApp conectado", { botId: session.id });
				},
				onMessage: (msg) => {
					const message = processMessage(msg);
					logger.info(JSON.stringify(message?.text), { botId: session.id });
				},
				onDisconnected(reason) {
					logger.info(`WhatsApp desconectado ${reason}`, {
						botId: session.id,
					});
					botManager.start(session.id);
				},
			});
		}),
	);

	logger.info("Server started");
}
