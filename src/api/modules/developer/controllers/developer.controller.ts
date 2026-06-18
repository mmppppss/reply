import { Request, Response } from "express";
import { DeveloperService } from "../services/developer.service";

export class DeveloperController {
	private service: DeveloperService;

	constructor() {
		this.service = new DeveloperService();
	}

	private resolveAgentId(req: Request): string | null {
		if (req.auth?.authType === "apikey") {
			return req.auth.agentId ?? null;
		}
		if (req.auth?.authType === "jwt") {
			return (req.body.idAgent as string) || (req.query.idAgent as string) || null;
		}
		return null;
	}

	public listKeys = async (req: Request, res: Response): Promise<Response> => {
		try {
			const agentId = this.resolveAgentId(req);
			if (!agentId) {
				return res.status(400).json({ message: "Agent ID required. Use ?idAgent= for JWT auth." });
			}

			const keys = await this.service.listKeys(agentId);
			const safe = keys.map((k) => ({
				id: k.id,
				name: k.name,
				prefix: k.prefix,
				active: k.active,
				lastUsedAt: k.lastUsedAt,
				createdAt: k.createdAt,
			}));
			return res.status(200).json({ data: safe });
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error listing API keys",
			});
		}
	};

	public createKey = async (req: Request, res: Response): Promise<Response> => {
		try {
			const agentId = this.resolveAgentId(req);
			if (!agentId) {
				return res.status(400).json({ message: "Agent ID required. Send idAgent in body for JWT auth." });
			}

			const { name } = req.body;
			const result = await this.service.createKey(agentId, name);
			return res.status(201).json({
				message: "API key created",
				data: {
					key: `rp_${result.key}`,
					prefix: result.prefix,
				},
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error creating API key",
			});
		}
	};

	public revokeKey = async (req: Request, res: Response): Promise<Response> => {
		try {
			const keyId = req.params.id_key as string;
			await this.service.revokeKey(keyId);
			return res.status(200).json({ message: "API key revoked" });
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error revoking API key",
			});
		}
	};

	public listLogs = async (req: Request, res: Response): Promise<Response> => {
		try {
			const agentId = this.resolveAgentId(req);
			if (!agentId) {
				return res.status(400).json({ message: "Agent ID required. Use ?idAgent= for JWT auth." });
			}

			const logs = await this.service.listLogs(agentId);
			return res.status(200).json({ data: logs });
		} catch (error: any) {
			return res.status(400).json({
				message: error.message || "Error listing logs",
			});
		}
	};
}
