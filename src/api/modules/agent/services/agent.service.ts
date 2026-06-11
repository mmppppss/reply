import {
	agentRepo,
	providerRepo,
	sessionRepo,
	agentModuleRepo,
	agentConfigRepo,
} from "@/infrastructure/database/repositories";
import { CreateAgentDTO, UpdateAgentDTO } from "../validators";
import { Agent } from "@/infrastructure/database/types/agent.type";
import { BotManager } from "@/modules/whatsapp/application/BotManager";
import { handleWhatsAppMessage, handleTelegramMessage } from "@/modules/shared/application/messageHandler";
import { printQR } from "@/infrastructure/runtime/printQR";

export class AgentService {
	public async create(userId: string, data: CreateAgentDTO): Promise<Agent> {
		const agent = await agentRepo.create(data.name, data.description, userId);

		await agentModuleRepo.upsert(agent.id, "keyword", {
			enabled: true,
			priority: 0,
		});

		await agentModuleRepo.upsert(agent.id, "pln", {
			enabled: false,
			priority: 1,
			config: { systemPrompt: "Eres un asistente útil y amigable." },
		});

		await agentConfigRepo.set(agent.id, "save_messages", false);
		await agentConfigRepo.set(agent.id, "save_contacts", false);

		return agent;
	}

	public async connect(
		query: Record<string, any>,
		params: Record<string, any>,
		body: Record<string, any>,
	): Promise<any> {
		const type = query.type as string;
		const id = params.id_agent as string;
		const token = body?.token as string | undefined;

		if (type === "whatsapp") {
			const provider = await providerRepo.findByName("whatsapp");
			const session = await sessionRepo.create(id, provider.id);
			const botManager = BotManager.getInstance();

			return new Promise((resolve, reject) => {
				const timeout = setTimeout(() => {
					reject(new Error("QR generation timeout"));
				}, 30000);

				botManager.start(session.id, type, {
					onQR: (qr) => {
						clearTimeout(timeout);
						printQR(qr);
						resolve({ message: "Qr Generated", data: qr, sessionId: session.id });
					},
					onConnected: () => {
						clearTimeout(timeout);
						sessionRepo.updateStatus(session.id, "C");
						resolve({ message: "WhatsApp connected", sessionId: session.id });
					},
					onMessage: (msg) => handleWhatsAppMessage(session, msg),
					onDisconnected: (_reason, error) => {
						clearTimeout(timeout);
						reject(new Error(error || "WhatsApp connection failed"));
					},
				}).catch(reject);
			});
		}

		if (type === "telegram") {
			if (!token) {
				throw new Error("Telegram token is required");
			}
			const provider = await providerRepo.findByName("telegram");
			if (!provider) {
				throw new Error("Provider 'telegram' not found in database");
			}
			const session = await sessionRepo.create(id, provider.id);
			if (!session) {
				throw new Error("Failed to create Telegram session");
			}
			await sessionRepo.updateConfig(session.id, { token });
			const botManager = BotManager.getInstance();
			await botManager.start(session.id, type, {
				onConnected: () => {
					sessionRepo.updateStatus(session.id, "C");
				},
				onMessage: (msg) => handleTelegramMessage(session, msg),
				onDisconnected: (_reason, error) => {
					console.error(`Telegram bot disconnected: ${error}`);
				},
			}, { token });
			return { sessionId: session.id, message: "Telegram bot connected" };
		}

		throw new Error(`Unsupported provider type: ${type}`);
	}

	public async findAllByUser(userId: string): Promise<Agent[]> {
		return agentRepo.findByUserId(userId);
	}

	public async findById(id: string, userId: string): Promise<Agent> {
		const agent = await agentRepo.findById(id);

		if (!agent) {
			throw new Error("Agent not found");
		}

		if (agent.idUser !== userId) {
			throw new Error("Access denied: Agent does not belong to user");
		}

		return agent;
	}

	public async update(
		id: string,
		userId: string,
		data: UpdateAgentDTO,
	): Promise<Agent> {
		const agent = await this.findById(id, userId);

		const updateData: Partial<Agent> = {};
		if (data.name !== undefined) updateData.name = data.name;
		if (data.description !== undefined)
			updateData.description = data.description;

		return agentRepo.update(id, updateData);
	}

	public async delete(id: string, userId: string): Promise<void> {
		await this.findById(id, userId);

		const sessions = await sessionRepo.findByAgentId(id);
		const botManager = BotManager.getInstance();
		for (const session of sessions) {
			await botManager.stop(session.id).catch(() => {});
		}

		await sessionRepo.deleteByAgentId(id);
		await agentRepo.deleteById(id);
	}

	public async sendMessage(
		agentId: string,
		userId: string,
		to: string,
		text: string,
	): Promise<{ success: boolean; messageId?: string; error?: string }> {
		await this.findById(agentId, userId);
		const sessions = await sessionRepo.findByAgentId(agentId);

		if (!sessions || sessions.length === 0) {
			return { success: false, error: "No session found for this agent" };
		}

		const botManager = BotManager.getInstance();
		return botManager.sendMessage(sessions[0].id, to, text);
	}
}
