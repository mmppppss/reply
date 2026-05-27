import { IAgentModule } from "../domain/IAgentModule";
import { agentModuleRepo } from "@/infrastructure/database/repositories";
import { BotManager } from "@/modules/whatsapp/application/BotManager";

export class ModuleRegistry {
    private static instance: ModuleRegistry;
    private modules: Map<string, IAgentModule> = new Map();

    private constructor() {}

    static getInstance(): ModuleRegistry {
        if (!ModuleRegistry.instance) {
            ModuleRegistry.instance = new ModuleRegistry();
        }
        return ModuleRegistry.instance;
    }

    register(module: IAgentModule): void {
        this.modules.set(module.key, module);
    }

    getModule(key: string): IAgentModule | undefined {
        return this.modules.get(key);
    }

    async process(
        agentId: string,
        text: string,
        sessionId: string,
        chatId: string,
    ): Promise<void> {
        const enabledModules = await agentModuleRepo.findEnabledByAgentId(agentId);
        if (!enabledModules || enabledModules.length === 0) return;

        for (const am of enabledModules) {
            const module = this.modules.get(am.moduleKey);
            if (!module) continue;

            const response = await module.process(
                agentId,
                text,
                sessionId,
                chatId,
                (am.config as Record<string, any>) || {},
            );

            if (response !== null) {
                await BotManager.getInstance().sendMessage(sessionId, chatId, response);
                return;
            }
        }
    }
}
