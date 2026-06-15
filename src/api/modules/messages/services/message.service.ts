import { BotManager } from "@/modules/whatsapp/application/BotManager";
import { sessionRepo, messageRepo } from "@/infrastructure/database/repositories";

export class MessageService {
	async sendByAgent(
		agentId: string,
		to: string,
		text: string,
	): Promise<{ success: boolean; messageId?: string; error?: string }> {
		const sessions = await sessionRepo.findByAgentId(agentId);
		const activeSession = Array.isArray(sessions) ? sessions.find((s: any) => s.status === "A") : null;

		if (!activeSession) {
			return { success: false, error: "No active session found for this agent" };
		}

		const result = await BotManager.getInstance().sendMessage(activeSession.id, to, text);

		if (result.success) {
			await messageRepo.create({
				idAgent: agentId,
				idSession: activeSession.id,
				direction: "outgoing",
				to,
				content: text,
			}).catch(() => {});
		}

		return result;
	}
}
