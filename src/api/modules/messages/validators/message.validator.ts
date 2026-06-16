import { z } from "zod";

export const sendMessageSchema = z.object({
	provider: z.string().min(1),
	to: z.string().min(1),
	text: z.string().min(1),
});

export type SendMessageDTO = z.infer<typeof sendMessageSchema>;
