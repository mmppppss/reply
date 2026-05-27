import { Request, Response } from "express";
import { messageRepo } from "@/infrastructure/database/repositories";

export class MessagesController {
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
}
