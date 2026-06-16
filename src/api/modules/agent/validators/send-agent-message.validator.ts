import { z } from "zod";

export const sendAgentMessageSchema = z.object({
	to: z.string().min(1),
	text: z.string().min(1),
	provider: z.string().min(1),
});

export type SendAgentMessageDTO = z.infer<typeof sendAgentMessageSchema>;
