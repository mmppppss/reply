import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {

	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}
	public login = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return res.status(400).json({
					message: "Missing email or password"
				});
			}

			const result = await this.authService.login(email, password);

			return res.status(200).json(result);

		} catch (error: any) {

			return res.status(401).json({
				message: error.message || "Invalid credentials"
			});

		}
	};
}
