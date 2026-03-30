import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {

	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	public login = async (req: Request, res: Response): Promise<Response> => {
		try {

			const result = await this.authService.login(req.body);
			return res.status(200).json(result);

		} catch (error: any) {

			return res.status(401).json({
				message: error.message || "Invalid credentials"
			});

		}
	};
}
