import { Request, Response } from "express";
import { messageRepo } from "@/infrastructure/database/repositories";
import { MessageService } from "../services/message.service";

export class MessagesController {
	private service: MessageService;

	constructor() {
		this.service = new MessageService();
	}

	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const agentId = req.params.id_agent as string;
			const limit = parseInt(req.query.limit as string) || 50;
			const offset = parseInt(req.query.offset as string) || 0;

			const messages = await messageRepo.findByAgent(agentId, limit, offset);
			return res.status(200).json({ data: messages });
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error fetching messages",
			});
		}
	};

	public send = async (req: Request, res: Response): Promise<Response> => {
		try {
			const agentId = req.params.id_agent as string;
			const { to, text } = req.body;

			const result = await this.service.sendByAgent(agentId, to, text);

			if (!result.success) {
				return res.status(400).json({
					message: result.error || "Failed to send message",
				});
			}

			return res.status(200).json({
				message: "Message sent",
				data: result,
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error sending message",
			});
		}
	};
}
