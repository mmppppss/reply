import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  proto,
  isJidGroup,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import pino from 'pino';

export interface WhatsAppConnectorEvents {
  onQR?: (qr: string) => void;
  onMessage?: (message: proto.IWebMessageInfo) => void;
  onConnected?: () => void;
  onDisconnected?: (reason: DisconnectReason | undefined, error?: string) => void;
  onConnectionStatus?: (status: 'disconnected' | 'connecting' | 'connected') => void;
}

export interface WhatsAppConnectorOptions {
  sessionId: string;
  events?: WhatsAppConnectorEvents;
  authDir?: string;
}

export class WhatsAppConnector {
  private client: WASocket | null = null;
  private readonly sessionId: string;
  private readonly events?: WhatsAppConnectorEvents;
  private readonly authDir: string;
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private qrCode: string | null = null;
  private connectionError: string | null = null;
  private isInitializing: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(options: WhatsAppConnectorOptions) {
    this.sessionId = options.sessionId;
    this.events = options.events;
    this.authDir = options.authDir || path.join(process.cwd(), 'data', 'auth', options.sessionId);
  }

  async connect(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.connectionStatus === 'connected' && this.client) {
      return;
    }

    this.initPromise = this.doConnect();
    
    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  private async doConnect(): Promise<void> {
    this.isInitializing = true;
    this.connectionStatus = 'connecting';
    this.connectionError = null;

    if (!fs.existsSync(this.authDir)) {
      fs.mkdirSync(this.authDir, { recursive: true });
    }

    try {
      const { version } = await fetchLatestBaileysVersion();
      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

      const logger = pino({ 
        level: process.env.NODE_ENV === 'development' ? 'info' : 'silent' 
      });

      this.client = makeWASocket({
        version,
        auth: state,
        logger,
        browser: ['WhatsApp MCP', 'Chrome', '120.0.0'],
        generateHighQualityLinkPreview: false,
        syncFullHistory: true,
        markOnlineOnConnect: false
      });

      this.client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrCode = qr;
          this.connectionStatus = 'connecting';
          this.events?.onQR?.(qr);
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          const errorMessage = (lastDisconnect?.error as Boom)?.message;
          
          this.client = null;
          this.isInitializing = false;
          
          if (statusCode === 515 || statusCode === DisconnectReason.restartRequired) {
            this.connectionStatus = 'connecting';
            this.connectionError = 'Reconnecting after pairing...';
            this.qrCode = null;
            this.initPromise = null;
            this.events?.onConnectionStatus?.('connecting');
            setTimeout(() => this.connect(), 1500);
            return;
          }
          
          if (statusCode === DisconnectReason.loggedOut) {
            this.connectionStatus = 'disconnected';
            this.connectionError = 'Logged out. Click Connect to scan QR again.';
            this.qrCode = null;
            this.clearAuth();
          } else if (statusCode === 405) {
            this.connectionStatus = 'disconnected';
            this.connectionError = 'Conflict error. Click Connect to retry.';
            this.qrCode = null;
            this.clearAuth();
          } else if (statusCode === DisconnectReason.connectionClosed || 
                     statusCode === DisconnectReason.connectionLost ||
                     statusCode === DisconnectReason.timedOut) {
            this.connectionStatus = 'connecting';
            this.connectionError = 'Reconnecting...';
            this.initPromise = null;
            this.events?.onConnectionStatus?.('connecting');
            setTimeout(() => this.connect(), 2000);
          } else {
            this.connectionStatus = 'disconnected';
            this.connectionError = `Disconnected: ${statusCode} - ${errorMessage}`;
          }
          
          this.events?.onDisconnected?.(statusCode, this.connectionError || undefined);
          this.events?.onConnectionStatus?.('disconnected');
        }

        if (connection === 'open') {
          this.qrCode = null;
          this.connectionStatus = 'connected';
          this.connectionError = null;
          this.isInitializing = false;
          this.events?.onConnected?.();
          this.events?.onConnectionStatus?.('connected');
        }
      });

      this.client.ev.on('creds.update', saveCreds);

      this.client.ev.on('messages.upsert', async ({ messages, type }) => {
        for (const message of messages) {
          if (!message.message) continue;
          this.events?.onMessage?.(message);
        }
      });

      this.client.ev.on('chats.update', (chats) => {
        // Handle chat updates if needed
      });

    } catch (error) {
      this.connectionStatus = 'disconnected';
      this.connectionError = error instanceof Error ? error.message : 'Failed to initialize';
      this.isInitializing = false;
      this.client = null;
      throw error;
    }
  }

  async sendMessage(jid: string, content: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.client || this.connectionStatus !== 'connected') {
      return { success: false, error: 'WhatsApp not connected' };
    }

    try {
      let normalizedJid = jid;
      if (!jid.includes('@')) {
        normalizedJid = `${jid}@s.whatsapp.net`;
      }

      const result = await this.client.sendMessage(normalizedJid, { text: content });
      
      return { 
        success: true, 
        messageId: result?.key?.id || undefined
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  getConnectionStatus() {
    return {
      status: this.connectionStatus,
      error: this.connectionError,
    };
  }

  getQRCode(): string | null {
    return this.qrCode;
  }

  async logout(): Promise<void> {
    if (this.client) {
      try {
        await this.client.logout();
      } catch (e) {
        // Ignore error
      }
      this.client = null;
    }
    this.connectionStatus = 'disconnected';
    this.qrCode = null;
    this.isInitializing = false;
    this.initPromise = null;
    this.clearAuth();
  }

  private clearAuth(): void {
    try {
      fs.rmSync(this.authDir, { recursive: true, force: true });
      fs.mkdirSync(this.authDir, { recursive: true });
    } catch (e) {
      // Ignore error
    }
  }

  disconnect(): void {
    this.client?.end(undefined);
    this.client = null;
    this.connectionStatus = 'disconnected';
  }
}
