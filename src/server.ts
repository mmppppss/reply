import { Logger } from '@/infrastructure/logging/Logger';
import { WhatsAppConnector } from '@/modules/whatsapp/infrastructure/WhatsAppConector';
import { printQR } from '@/infrastructure/runtime/printQR';
import { processMessage } from '@/modules/whatsapp/application/messageProcessor'
import { ClientsRepo } from '@/infrastructure/database/repositories/client.repo'
import { Client } from '@/types/client';

export default async function server() {
	const logger = new Logger();
	const client = new ClientsRepo();
	const clients = await client.findAll();
	
	clients.forEach((session: Client) => {
		const connector = new WhatsAppConnector({
			sessionId: session.name,
			events: {
				onQR: (qr) => {
					logger.info('QR', { botId: session.name });
					printQR(qr);
				},
				onConnected: () => {
					logger.info('WhatsApp conectado', { botId: session.name });
				},
				onMessage: (msg) => {
					const message = processMessage(msg);
					logger.info(JSON.stringify(message?.text), { botId: session.name });
				},
				onDisconnected(reason) {
					logger.info(`WhatsApp desconectado ${reason}`, { botId: session.name });
					connector.connect();
				},
			}
		});
		connector.connect();
	})
	logger.info('Server started');
}
