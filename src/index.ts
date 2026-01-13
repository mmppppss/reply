/*import { WhatsAppConnector } from '@/modules/whatsapp/infrastructure/WhatsAppConector';
import { processMessage } from '@/modules/whatsapp/application/messageProcessor'
import { printQR } from '@/infrastructure/runtime/printQR';
import { Logger } from '@/infrastructure/logging/Logger';

import { initDatabase } from '@/database';

async function main() {
	const logger = new Logger();
	await initDatabase();
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
*/

import { initDatabase } from '@/database';
import { UserRepository } from '@/database/repositories/User.repo';

async function main() {
    await initDatabase();

    const userRepo = new UserRepository();

    const user = await userRepo.create({
        user: 'pedro',
        mail: 'pedro@mail.com',
        password: '123456',
    });

    console.log('Usuario creado:', user.toJSON());

    const foundByUser = await userRepo.findByUser('pedro');
    console.log('Encontrado por user:', foundByUser?.toJSON());

    const foundByMail = await userRepo.findByMail('pedro@mail.com');
    console.log('Encontrado por mail:', foundByMail?.toJSON());
}

main().catch(console.error);
