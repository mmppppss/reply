import { z } from "zod";

export const updateResponseSchema = z.object({
	keyword: z.string().min(1).max(100).optional(),
	response: z.string().min(1).optional(),
});

export type UpdateResponseDTO = z.infer<typeof updateResponseSchema>;
