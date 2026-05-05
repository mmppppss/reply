import { agentRepo } from "@/infrastructure/database/repositories";
import { CreateAgentDTO, UpdateAgentDTO } from "../validators";
import { Agent } from "@/infrastructure/database/types/agent.type";

export class AgentService {
	public async create(userId: string, data: CreateAgentDTO): Promise<Agent> {
		return agentRepo.create(data.name, data.description, userId);
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

	public async update(id: string, userId: string, data: UpdateAgentDTO): Promise<Agent> {
		const agent = await this.findById(id, userId);

		const updateData: Partial<Agent> = {};
		if (data.name !== undefined) updateData.name = data.name;
		if (data.description !== undefined) updateData.description = data.description;

		return agentRepo.update(id, updateData);
	}

	public async delete(id: string, userId: string): Promise<void> {
		await this.findById(id, userId);
		await agentRepo.deleteById(id);
	}
}
