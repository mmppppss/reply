export interface BotEvents {
	onQR?: (qr: string) => void;
	onMessage?: (message: any) => void;
	onConnected?: () => void;
	onDisconnected?: (reason?: any, error?: string) => void;
	onConnectionStatus?: (
		status: "disconnected" | "connecting" | "connected",
	) => void;
}

export interface IBotConnector {
	readonly sessionId: string;
	readonly platform: string;
	connect(events?: BotEvents): Promise<void>;
	disconnect(): Promise<void>;
	sendMessage(
		destination: string,
		text: string,
	): Promise<{ success: boolean; messageId?: string; error?: string }>;
	getConnectionStatus(): { status: string; error?: string | null };
}
