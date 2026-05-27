import { z } from "zod";

export const upsertAgentModuleSchema = z.object({
    enabled: z.boolean().optional(),
    priority: z.number().int().min(0).optional(),
    config: z.any().optional(),
});

export type UpsertAgentModuleDTO = z.infer<typeof upsertAgentModuleSchema>;
