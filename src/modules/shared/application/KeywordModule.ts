import { IAgentModule } from "../domain/IAgentModule";
import { responseRepo } from "@/infrastructure/database/repositories";
import { ResponseRule } from "@/infrastructure/database/types/response.type";

export class KeywordModule implements IAgentModule {
    readonly key = "keyword";
    private static instance: KeywordModule;
    private cache: Map<string, ResponseRule[]> = new Map();

    private constructor() {}

    static getInstance(): KeywordModule {
        if (!KeywordModule.instance) {
            KeywordModule.instance = new KeywordModule();
        }
        return KeywordModule.instance;
    }

    async loadAll(): Promise<void> {
        const all = await responseRepo.findAll();
        this.cache.clear();
        for (const rule of all) {
            const arr = this.cache.get(rule.idAgent) || [];
            arr.push(rule);
            this.cache.set(rule.idAgent, arr);
        }
    }

    async reload(agentId: string): Promise<void> {
        const rules = await responseRepo.findByAgentId(agentId);
        this.cache.set(agentId, rules);
    }

    async process(
        agentId: string,
        text: string,
        _sessionId: string,
        _chatId: string,
        _config: Record<string, any>,
        _platform?: string,
    ): Promise<string | null> {
        const rules = this.cache.get(agentId);
        if (!rules || rules.length === 0) return null;

        const lower = text.toLowerCase();
        for (const rule of rules) {
            if (lower.includes(rule.keyword.toLowerCase())) {
                return rule.response;
            }
        }
        return null;
    }
}
