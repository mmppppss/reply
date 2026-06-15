import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { apiKeyRepo } from "@/infrastructure/database/repositories";

const JWT_SECRET = process.env.JWT_SECRET || "clave_super_secreta_provisional";

export interface AuthPayload {
	userId?: string;
	agentId?: string;
	authType: "jwt" | "apikey";
}

declare global {
	namespace Express {
		interface Request {
			auth?: AuthPayload;
		}
	}
}

function extractToken(req: Request): string | null {
	const header = req.headers.authorization;
	if (!header || !header.startsWith("Bearer ")) return null;
	return header.slice(7).trim();
}

async function tryJwt(token: string): Promise<AuthPayload | null> {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email: string };
		return { userId: decoded.sub, authType: "jwt" };
	} catch {
		return null;
	}
}

async function tryApiKey(token: string): Promise<AuthPayload | null> {
	const raw = token.startsWith("rp_") ? token.slice(3) : token;
	const prefix = raw.slice(0, 12);
	const record = await apiKeyRepo.findByPrefix(prefix);
	if (!record || !record.active) return null;

	const match = await bcrypt.compare(raw, record.keyHash);
	if (!match) return null;

	await apiKeyRepo.updateLastUsed(record.id).catch(() => {});
	return { agentId: record.idAgent, authType: "apikey" };
}

export async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	const token = extractToken(req);
	if (!token) {
		res.status(401).json({ message: "Authorization header required" });
		return;
	}

	const payload = (await tryJwt(token)) || (await tryApiKey(token));
	if (!payload) {
		res.status(401).json({ message: "Invalid or expired token" });
		return;
	}

	req.auth = payload;
	next();
}

export function requireAgentAccess(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const agentId = req.params.id_agent;
	if (!agentId) {
		res.status(400).json({ message: "Agent ID required" });
		return;
	}

	if (!req.auth) {
		res.status(401).json({ message: "Not authenticated" });
		return;
	}

	if (req.auth.authType === "jwt") {
		next();
		return;
	}

	if (req.auth.agentId === agentId) {
		next();
		return;
	}

	res.status(403).json({ message: "Forbidden: this API key does not have access to this agent" });
}
