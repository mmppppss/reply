import { Request, Response } from "express";
import { agentConfigRepo } from "@/infrastructure/database/repositories";

export class AgentConfigController {
    public getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const configs = await agentConfigRepo.getAll(agentId);
            return res.status(200).json({ data: configs });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error fetching config",
            });
        }
    };

    public getByKey = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const key = req.params.key as string;
            const value = await agentConfigRepo.get(agentId, key);

            if (value === null) {
                return res.status(404).json({ message: "Config key not found" });
            }

            return res.status(200).json({ data: { key, value } });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error fetching config",
            });
        }
    };

    public set = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const key = req.params.key as string;
            const { value } = req.body;

            if (value === undefined) {
                return res.status(400).json({ message: "value is required" });
            }

            const result = await agentConfigRepo.set(agentId, key, value);
            return res.status(200).json({
                message: "Config updated",
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error setting config",
            });
        }
    };

    public remove = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const key = req.params.key as string;
            await agentConfigRepo.delete(agentId, key);
            return res.status(200).json({ message: "Config deleted" });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error deleting config",
            });
        }
    };
}
