import { z } from "zod";

export const sendMessageSchema = z.object({
	to: z.string().min(1),
	text: z.string().min(1),
});

export type SendMessageDTO = z.infer<typeof sendMessageSchema>;
