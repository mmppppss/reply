import makeWASocket, {
	useMultiFileAuthState,
	DisconnectReason,
	WAMessage
} from 'baileys';

import pino from 'pino';

export interface WhatsAppConnectorEvents {
	onQR?: (qr: string) => void;
	onMessage?: (message: WAMessage) => void;
	onConnected?: () => void;
	onDisconnected?: (reason: DisconnectReason | undefined) => void;
}

export interface WhatsAppConnectorOptions {
	sessionId: string;
	events?: WhatsAppConnectorEvents;
}

export class WhatsAppConnector {
	private client: ReturnType<typeof makeWASocket> | null = null;
	private readonly sessionId: string;
	private readonly events?: WhatsAppConnectorEvents;

	constructor(options: WhatsAppConnectorOptions) {
		this.sessionId = options.sessionId;
		this.events = options.events!;
	}

	async connect(): Promise<void> {
		const { state, saveCreds } = await useMultiFileAuthState(
			`./sessions/${this.sessionId}`
		);

		this.client = makeWASocket({
			auth: state,
			logger: pino({ level: 'silent' }),
			printQRInTerminal: false
		});

		this.client.ev.on('connection.update', (update) => {
			const { connection, lastDisconnect, qr } = update;

			if (qr) {
				this.events?.onQR?.(qr);
			}

			if (connection === 'open') {
				this.events?.onConnected?.();
			}

			if (connection === 'close') {
				const reason =
					(lastDisconnect?.error as any)?.output?.statusCode;

				this.events?.onDisconnected?.(reason);
			}
		});

		this.client.ev.on('creds.update', saveCreds);

		this.client.ev.on('messages.upsert', (upsert) => {
			if (upsert.type !== 'notify') return;

			for (const message of upsert.messages) {
				if (!message.message) continue;
				if (message.key.fromMe) continue;
				this.events?.onMessage?.(message);
			}
		});
	}

	async sendRaw(jid: string, content: any): Promise<void> {
		if (!this.client) {
			throw new Error('WhatsApp client not connected');
		}

		await this.client.sendMessage(jid, content);
	}

	disconnect(): void {
		this.client?.end(undefined);
		this.client = null;
	}
}
