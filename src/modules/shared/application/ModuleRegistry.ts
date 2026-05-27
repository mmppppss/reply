import { IAgentModule } from "../domain/IAgentModule";
import { agentModuleRepo, agentConfigRepo, messageRepo, contactRepo } from "@/infrastructure/database/repositories";
import { BotManager } from "@/modules/whatsapp/application/BotManager";

export class ModuleRegistry {
    private static instance: ModuleRegistry;
    private modules: Map<string, IAgentModule> = new Map();
    private saveMessagesCache: Map<string, boolean> = new Map();
    private saveContactsCache: Map<string, boolean> = new Map();

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
        from?: string,
        chatType?: string,
        chat?: string,
    ): Promise<void> {
        const shouldSaveMessages = await this.shouldSaveMessages(agentId);
        const shouldSaveContacts = await this.shouldSaveContacts(agentId);

        if (shouldSaveContacts && from && chatType === "private") {
            try {
                const existing = await contactRepo.findByAgentAndContactId(agentId, from);
                if (!existing) {
                    await contactRepo.create({
                        idAgent: agentId,
                        contactId: from,
                        chatType,
                    });
                } else {
                    await contactRepo.upsert(agentId, from, { chatType });
                }
            } catch (err) {
                console.error(`[ModuleRegistry] Error saving contact:`, err);
            }
        }

        if (shouldSaveMessages) {
            try {
                await messageRepo.create({
                    idAgent: agentId,
                    idSession: sessionId,
                    direction: "incoming",
                    from: from ?? null,
                    chat: chat ?? null,
                    chatType: chatType ?? null,
                    content: text,
                });
            } catch (err) {
                console.error(`[ModuleRegistry] Error saving message:`, err);
            }
        }

        const enabledModules = await agentModuleRepo.findEnabledByAgentId(agentId);
        if (!enabledModules || enabledModules.length === 0) {
            console.log(`[ModuleRegistry] No enabled modules for agent ${agentId}`);
            return;
        }

        for (const am of enabledModules) {
            const module = this.modules.get(am.moduleKey);
            if (!module) {
                console.log(`[ModuleRegistry] Module ${am.moduleKey} not registered`);
                continue;
            }

            try {
                const response = await module.process(
                    agentId,
                    text,
                    sessionId,
                    chatId,
                    (am.config as Record<string, any>) || {},
                );

                if (response !== null) {
                    if (shouldSaveMessages) {
                        try {
                            await messageRepo.create({
                                idAgent: agentId,
                                idSession: sessionId,
                                direction: "outgoing",
                                to: chatId,
                                chat: chat ?? null,
                                chatType: chatType ?? null,
                                content: response,
                                moduleKey: module.key,
                            });
                        } catch (err) {
                            console.error(`[ModuleRegistry] Error saving outgoing message:`, err);
                        }
                    }

                    await BotManager.getInstance().sendMessage(sessionId, chatId, response);
                    return;
                }
            } catch (err) {
                console.error(`[ModuleRegistry] Module ${module.key} error:`, err);
            }
        }

        console.log(`[ModuleRegistry] No module responded for agent ${agentId}`);
    }

    private async shouldSaveMessages(agentId: string): Promise<boolean> {
        const cached = this.saveMessagesCache.get(agentId);
        if (cached !== undefined) return cached;

        const value = await agentConfigRepo.get(agentId, "save_messages");
        const result = value === true;
        this.saveMessagesCache.set(agentId, result);
        return result;
    }

    private async shouldSaveContacts(agentId: string): Promise<boolean> {
        const cached = this.saveContactsCache.get(agentId);
        if (cached !== undefined) return cached;

        const value = await agentConfigRepo.get(agentId, "save_contacts");
        const result = value === true;
        this.saveContactsCache.set(agentId, result);
        return result;
    }
}
