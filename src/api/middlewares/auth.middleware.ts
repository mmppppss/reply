import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { apiKeyRepo, apiLogRepo } from "@/infrastructure/database/repositories";

const JWT_SECRET = process.env.JWT_SECRET || "clave_super_secreta_provisional";

export interface AuthPayload {
	userId?: string;
	agentId?: string;
	apiKeyId?: string;
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
	return { agentId: record.idAgent, apiKeyId: record.id, authType: "apikey" };
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

	if (payload.authType === "apikey" && payload.agentId) {
		const logIdApiKey = payload.apiKeyId;
		res.on("finish", () => {
			apiLogRepo.create({
				idAgent: payload.agentId!,
				idApiKey: logIdApiKey,
				method: req.method,
				path: req.originalUrl || req.url,
				status: res.statusCode,
				ip: req.ip || (req as any).connection?.remoteAddress,
			}).catch(() => {});
		});
	}

	next();
}

export function requireAgentAccess(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	// NOTE: req.params is REASSIGNED by Express Router({ mergeParams: true })
	// on each middleware/route layer, so writing to req.params here is lost
	// when the next layer runs. Use res.locals instead.
	const agentId = req.params.id_agent || req.auth?.agentId || req.body?.idAgent || req.query?.idAgent;

	if (!agentId) {
		res.status(400).json({ message: "Agent ID required" });
		return;
	}

	if (!req.auth) {
		res.status(401).json({ message: "Not authenticated" });
		return;
	}

	res.locals.agentId = agentId;

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
