import { z } from 'zod';

export const updateAgentSchema = z.object({
	name: z.string().min(3).max(50).optional(),
	description: z.string().min(5).max(255).optional(),
});

export type UpdateAgentDTO = z.infer<typeof updateAgentSchema>;
