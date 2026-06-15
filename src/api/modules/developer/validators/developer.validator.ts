import { z } from "zod";

export const createApiKeySchema = z.object({
	name: z.string().min(1).max(255),
});

export type CreateApiKeyDTO = z.infer<typeof createApiKeySchema>;
