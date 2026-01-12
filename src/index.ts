import { WhatsAppConnector } from '@/modules/whatsapp/infrastructure/WhatsAppConector';
import { processMessage } from '@/modules/whatsapp/application/messageProcessor'
import { printQR } from '@/infrastructure/runtime/printQR';
import { Logger } from '@/infrastructure/logging/Logger';

async function main() {
	const logger = new Logger();
	const connector = new WhatsAppConnector({
		sessionId: 'test',
		events: {
			onQR: (qr) => {
				printQR(qr);
			},
			onConnected: () => {
				console.log('WhatsApp conectado');
			},
			onMessage: (msg) => {
				const message = processMessage(msg);
				logger.info(JSON.stringify(message));
			}
		}
	});

	await connector.connect();
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
