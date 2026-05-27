import { Request, Response } from "express";
import { responseRepo } from "@/infrastructure/database/repositories";
import { KeywordModule } from "@/modules/shared/application/KeywordModule";

export class ResponseController {
	public create = async (req: Request, res: Response): Promise<Response> => {
		try {
			const agentId = req.params.id_agent as string;
			const { keyword, response } = req.body;

			if (!keyword || !response) {
				return res
					.status(400)
					.json({ message: "keyword and response are required" });
			}

			const result = await responseRepo.create(agentId, keyword, response);
			await KeywordModule.getInstance().reload(agentId);

			return res.status(201).json({
				message: "Response rule created",
				data: result,
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error creating response rule",
			});
		}
	};

	public getAll = async (req: Request, res: Response): Promise<Response> => {
		try {
			const agentId = req.params.id_agent as string;
			const rules = await responseRepo.findByAgentId(agentId);
			return res.status(200).json({ data: rules });
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error fetching response rules",
			});
		}
	};

	public remove = async (req: Request, res: Response): Promise<Response> => {
		try {
			const agentId = req.params.id_agent as string;
			const id = req.params.id_response as string;
			await responseRepo.deleteById(id);
			await KeywordModule.getInstance().reload(agentId);
			return res.status(200).json({ message: "Response rule deleted" });
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error deleting response rule",
			});
		}
	};
}
