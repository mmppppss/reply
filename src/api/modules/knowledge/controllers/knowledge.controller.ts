import { Request, Response } from "express";
import { KnowledgeService } from "../services/knowledge.service";

export class KnowledgeController {
	private service: KnowledgeService;

	constructor() {
		this.service = new KnowledgeService();
	}

	public get = async (req: Request, res: Response): Promise<Response> => {
		try {
			const agentId = req.params.id_agent as string;
			const entry = await this.service.getByAgentId(agentId);

			if (!entry) {
				return res.status(200).json({ data: null });
			}

			return res.status(200).json({ data: entry.data });
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error fetching knowledge",
				detail: error.detail || error.cause?.message || undefined,
				code: error.code || undefined,
			});
		}
	};

	public upload = async (req: Request, res: Response): Promise<Response> => {
		try {
			const agentId = req.params.id_agent as string;
			const { data } = req.body;

			const entry = await this.service.upload(agentId, data);

			return res.status(200).json({
				message: "Knowledge uploaded",
				data: entry.data,
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error uploading knowledge",
				detail: error.detail || error.cause?.message || undefined,
				code: error.code || undefined,
			});
		}
	};
}
