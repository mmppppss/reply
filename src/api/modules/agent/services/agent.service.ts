import {
	agentRepo,
	providerRepo,
	sessionRepo,
} from "@/infrastructure/database/repositories";
import { CreateAgentDTO, UpdateAgentDTO } from "../validators";
import { Agent } from "@/infrastructure/database/types/agent.type";
import { WhatsAppConnector } from "@/modules/whatsapp/infrastructure/WhatsAppConector";
import { BotManager } from "@/modules/whatsapp/application/BotManager";
import { printQR } from "@/infrastructure/runtime/printQR";

export class AgentService {
	public async create(userId: string, data: CreateAgentDTO): Promise<Agent> {
		return agentRepo.create(data.name, data.description, userId);
	}

	public async connect(query, params, res: Response): Promise<void> {
		const type = query.type;
		const id = params.id_agent;
		if (type == "whatsapp") {
			const provider = await providerRepo.findByName("whatsapp");
			const session = await sessionRepo.create(id, provider.id);
			const botManager = BotManager.getInstance();
			await botManager.start(session.id, {
				onQR: (qr) => {
					printQR(qr);
					res.json({
						message: "Qr Generated",
						data: qr,
					});
					res.end();
				},
				onConnected: () => {
					sessionRepo.updateStatus(session.id, "C");
				},
			});
		}
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
