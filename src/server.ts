import { Logger } from "@/infrastructure/logging/Logger";
import { WhatsAppConnector } from "@/modules/whatsapp/infrastructure/WhatsAppConector";
import { printQR } from "@/infrastructure/runtime/printQR";
import { processMessage } from "@/modules/whatsapp/application/messageProcessor";
import { sessionRepo } from "./infrastructure/database/repositories";
import { Session } from "./infrastructure/database/types/session.type";

export default async function server() {
	const logger = new Logger();
	const sessions = await sessionRepo.findByStatus("C");
	sessions.forEach((session: Session) => {
		logger.info("conectando");
		const connector = new WhatsAppConnector({
			sessionId: session.id,
			events: {
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
					connector.connect();
				},
			},
		});
		connector.connect();
	});
	logger.info("Server started");
}
