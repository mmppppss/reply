import { WhatsAppConnector } from '../infrastructure/WhatsAppConector';

interface ConnectionData {
  connector: WhatsAppConnector;
  qr: string | null;
  status: 'connecting' | 'qr_ready' | 'connected' | 'failed';
  error?: string;
  timestamp: number;
}

const connections: Map<string, ConnectionData> = new Map();

export function startWhatsAppConnection(agentId: string): void {
  const existing = connections.get(agentId);
  if (existing && (existing.status === 'connecting' || existing.status === 'qr_ready')) {
    console.log(`[WhatsApp] Connection already in progress for agent: ${agentId}`);
    return;
  }

  console.log(`[WhatsApp] Starting connection for agent: ${agentId}`);

  const connectionData: ConnectionData = {
    connector: null!,
    qr: null,
    status: 'connecting',
    timestamp: Date.now()
  };

  connections.set(agentId, connectionData);

  const connector = new WhatsAppConnector({
    sessionId: agentId,
    events: {
      onQR: (qr: string) => {
        console.log(`[WhatsApp] QR received for agent: ${agentId}`);
        const conn = connections.get(agentId);
        if (conn) {
          conn.qr = qr;
          conn.status = 'qr_ready';
        }
      },
      onConnected: () => {
        console.log(`[WhatsApp] Connected for agent: ${agentId}`);
        const conn = connections.get(agentId);
        if (conn) {
          conn.status = 'connected';
        }
      },
      onDisconnected: (reason) => {
        console.log(`[WhatsApp] Disconnected for agent: ${agentId}, reason: ${reason}`);
        const conn = connections.get(agentId);
        if (conn) {
          conn.status = 'failed';
          conn.error = `Connection failed: ${reason}`;
        }
      }
    }
  });

  connectionData.connector = connector;

  connector.connect().catch((err: any) => {
    console.error(`[WhatsApp] Error starting connection for agent ${agentId}:`, err);
    const conn = connections.get(agentId);
    if (conn) {
      conn.status = 'failed';
      conn.error = err.message;
    }
  });
}

export function getWhatsAppQR(agentId: string): { qr: string } | { error: string } | null {
  const conn = connections.get(agentId);
  
  if (!conn) {
    return null;
  }

  if (conn.status === 'qr_ready' && conn.qr) {
    return { qr: conn.qr };
  }

  if (conn.status === 'failed') {
    connections.delete(agentId);
    return { error: conn.error || 'Connection failed' };
  }

  if (conn.status === 'connecting') {
    return { error: 'QR still generating, try again in a few seconds' };
  }

  if (conn.status === 'connected') {
    return { error: 'Already connected, no QR needed' };
  }

  return null;
}

export function disconnectWhatsApp(agentId: string): void {
  const conn = connections.get(agentId);
  if (conn) {
    conn.connector.disconnect();
    connections.delete(agentId);
  }
}
