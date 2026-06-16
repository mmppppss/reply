import { BotManager } from "@/modules/whatsapp/application/BotManager";
import { sessionRepo, messageRepo, providerRepo } from "@/infrastructure/database/repositories";

export class MessageService {
	async sendByAgent(
		agentId: string,
		provider: string,
		to: string,
		text: string,
	): Promise<{ success: boolean; messageId?: string; error?: string }> {
		const prov = await providerRepo.findByName(provider);
		if (!prov) {
			return { success: false, error: `Provider '${provider}' not found` };
		}

		const session = await sessionRepo.findByAgentAndProvider(agentId, prov.id);
		if (!session) {
			return { success: false, error: `No active ${provider} session for this agent` };
		}

		const result = await BotManager.getInstance().sendMessage(session.id, to, text);

		if (result.success) {
			await messageRepo.create({
				idAgent: agentId,
				idSession: session.id,
				direction: "outgoing",
				to,
				content: text,
			}).catch(() => {});
		}

		return result;
	}
}
