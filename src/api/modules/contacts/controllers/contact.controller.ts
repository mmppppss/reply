import { Request, Response } from "express";
import { contactRepo } from "@/infrastructure/database/repositories";

export class ContactController {
    public list = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const result = await contactRepo.findByAgent(agentId);
            return res.status(200).json({ data: result });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error listing contacts",
            });
        }
    };

    public getByContactId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const contactId = req.params.contact_id as string;
            const contact = await contactRepo.findByAgentAndContactId(agentId, contactId);

            if (!contact) {
                return res.status(404).json({ message: "Contact not found" });
            }

            return res.status(200).json({ data: contact });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error fetching contact",
            });
        }
    };

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const { contactId, name, platform, chatType, metadata } = req.body;

            if (!contactId) {
                return res.status(400).json({ message: "contactId is required" });
            }

            const existing = await contactRepo.findByAgentAndContactId(agentId, contactId);
            if (existing) {
                return res.status(409).json({ message: "Contact already exists" });
            }

            const result = await contactRepo.create({
                idAgent: agentId,
                contactId,
                name,
                platform,
                chatType,
                metadata,
            });

            return res.status(201).json({
                message: "Contact created",
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error creating contact",
            });
        }
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const contactId = req.params.contact_id as string;
            const { name, platform, chatType, metadata } = req.body;

            const existing = await contactRepo.findByAgentAndContactId(agentId, contactId);
            if (!existing) {
                return res.status(404).json({ message: "Contact not found" });
            }

            const result = await contactRepo.update(existing.id, {
                name,
                platform,
                chatType,
                metadata,
            });

            return res.status(200).json({
                message: "Contact updated",
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error updating contact",
            });
        }
    };

    public delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const agentId = req.params.id_agent as string;
            const contactId = req.params.contact_id as string;

            const existing = await contactRepo.findByAgentAndContactId(agentId, contactId);
            if (!existing) {
                return res.status(404).json({ message: "Contact not found" });
            }

            await contactRepo.deleteById(existing.id);
            return res.status(200).json({ message: "Contact deleted" });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Error deleting contact",
            });
        }
    };
}
