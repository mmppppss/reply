import { z } from "zod";

export const uploadKnowledgeSchema = z.object({
	data: z.any(),
});

export type UploadKnowledgeDTO = z.infer<typeof uploadKnowledgeSchema>;
