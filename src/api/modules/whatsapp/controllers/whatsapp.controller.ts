import { Request, Response } from "express";
import { WhatsappService } from "../services/whatsapp.service";

export class WhatsappController {

	private whatsappService: WhatsappService;

	constructor() {
		this.whatsappService = new WhatsappService();
	}

	public connect = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.whatsappService.connect(req.params);
			return res.status(200).json(result);

		} catch (error: any) {
			return res.status(401).json({ message: error.message });
		}
	}

	public sessions = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.whatsappService.getSessions(req.params);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(401).json({ message: error.message });
		}
	}

}
