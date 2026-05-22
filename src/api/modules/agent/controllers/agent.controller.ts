import { Request, Response } from "express";
import { AgentService } from "../services/agent.service";

export class AgentController {
	private agentService: AgentService;

	constructor() {
		this.agentService = new AgentService();
	}

	public create = async (req: Request, res: Response): Promise<Response> => {
		try {
			const userId = (req.params.id_user as string) || (req as any).user?.id;

			if (!userId) {
				return res.status(401).json({ message: "User not authenticated" });
			}

			const result = await this.agentService.create(userId, req.body);
			return res.status(201).json({
				message: "Agent created successfully",
				data: result,
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error creating agent",
			});
		}
	};

	public connect = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.agentService.connect(
				req.query,
				req.params,
				req.body,
			);
			return res.status(200).json(result);
		} catch (error: any) {
			const cause = error.cause?.message || error.cause || "";
			return res.status(400).json({
				message: error.message || "Error connecting agent",
				...(cause ? { cause } : {}),
			});
		}
	};

	public getAll = async (req: Request, res: Response): Promise<Response> => {
		try {
			const userId = (req.params.id_user as string) || (req as any).user?.id;

			if (!userId) {
				return res.status(401).json({ message: "User not authenticated" });
			}

			const agents = await this.agentService.findAllByUser(userId);
			return res.status(200).json({
				data: agents,
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error fetching agents",
			});
		}
	};

	public getById = async (req: Request, res: Response): Promise<Response> => {
		try {
			const userId = (req.params.id_user as string) || (req as any).user?.id;
			const agentId = req.params.id_agent as string;

			if (!userId) {
				return res.status(401).json({ message: "User not authenticated" });
			}

			const agent = await this.agentService.findById(agentId, userId);
			return res.status(200).json({
				data: agent,
			});
		} catch (error: any) {
			return res.status(404).json({
				message: error.message || "Agent not found",
			});
		}
	};

	public update = async (req: Request, res: Response): Promise<Response> => {
		try {
			const userId = (req.params.id_user as string) || (req as any).user?.id;
			const agentId = req.params.id_agent as string;

			if (!userId) {
				return res.status(401).json({ message: "User not authenticated" });
			}

			const result = await this.agentService.update(agentId, userId, req.body);
			return res.status(200).json({
				message: "Agent updated successfully",
				data: result,
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error updating agent",
			});
		}
	};

	public delete = async (req: Request, res: Response): Promise<Response> => {
		try {
			const userId = (req.params.id_user as string) || (req as any).user?.id;
			const agentId = req.params.id_agent as string;

			if (!userId) {
				return res.status(401).json({ message: "User not authenticated" });
			}

			await this.agentService.delete(agentId, userId);
			return res.status(200).json({
				message: "Agent deleted successfully",
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error deleting agent",
			});
		}
	};

	public send = async (req: Request, res: Response): Promise<Response> => {
		try {
			const userId = (req.params.id_user as string) || (req as any).user?.id;
			const agentId = req.params.id_agent as string;
			const { to, text } = req.body;

			if (!userId) {
				return res.status(401).json({ message: "User not authenticated" });
			}

			if (!to || !text) {
				return res.status(400).json({ message: "to and text are required" });
			}

			const result = await this.agentService.sendMessage(
				agentId,
				userId,
				to,
				text,
			);

			if (!result.success) {
				return res.status(400).json({
					message: result.error,
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
