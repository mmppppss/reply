import { apiKeyRepo, apiLogRepo } from "@/infrastructure/database/repositories";
import bcrypt from "bcrypt";
import crypto from "crypto";

function generateRawKey(): { raw: string; prefix: string } {
	const bytes = crypto.randomBytes(32);
	const raw = bytes.toString("hex");
	const prefix = raw.slice(0, 12);
	return { raw, prefix };
}

export class DeveloperService {
	async listKeys(agentId: string) {
		return apiKeyRepo.findByAgentId(agentId);
	}

	async createKey(agentId: string, name: string) {
		const { raw, prefix } = generateRawKey();
		const keyHash = await bcrypt.hash(raw, 10);
		await apiKeyRepo.create(agentId, name, keyHash, prefix);
		return { key: raw, prefix };
	}

	async revokeKey(keyId: string) {
		await apiKeyRepo.revoke(keyId);
	}

	async listLogs(agentId: string) {
		return apiLogRepo.findByAgentId(agentId);
	}
}
