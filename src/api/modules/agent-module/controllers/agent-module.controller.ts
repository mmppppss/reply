import { Request, Response } from "express";
import { agentModuleRepo } from "@/infrastructure/database/repositories";

export class AgentModuleController {
    public list = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const modules = await agentModuleRepo.findByAgentId(agentId);
            return res.status(200).json({ data: modules });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error listing modules",
            });
        }
    };

    public upsert = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const moduleKey = req.params.module_key as string;
            const data = req.body;

            const result = await agentModuleRepo.upsert(agentId, moduleKey, data);
            return res.status(200).json({
                message: "Module updated successfully",
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error updating module",
                ...(error.code && { code: error.code }),
                ...(error.detail && { detail: error.detail }),
                ...(error.hint && { hint: error.hint }),
            });
        }
    };

    public toggle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const moduleKey = req.params.module_key as string;

            const result = await agentModuleRepo.toggleEnabled(agentId, moduleKey);
            return res.status(200).json({
                message: `Module ${result.enabled ? "enabled" : "disabled"} successfully`,
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error toggling module",
            });
        }
    };

    public remove = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const moduleKey = req.params.module_key as string;

            const existing = await agentModuleRepo.findByAgentAndModule(agentId, moduleKey);
            if (!existing) {
                return res.status(404).json({ message: "Module not found" });
            }

            await agentModuleRepo.deleteById(existing.id);
            return res.status(200).json({ message: "Module removed successfully" });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error removing module",
            });
        }
    };
}
