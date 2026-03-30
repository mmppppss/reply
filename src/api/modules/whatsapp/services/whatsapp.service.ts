import { sessionRepo } from "@/infrastructure/database/repositories";

export class WhatsappService {

	public async connect(params: any) {
		const { userId } = params;
		// validate user config 

		const session = await sessionRepo.create(userId);
		return session;
	}

	public async getSessions(params: any) {
		try {
			const { userId } = params;
			const sessions = await sessionRepo.findByUserId(userId);
			//crear adapter
			if(!sessions)
				return {
					"message":"no existen sesiones"
				}
			return sessions;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}
