export interface IAgentModule {
    readonly key: string;
    process(
        agentId: string,
        text: string,
        sessionId: string,
        chatId: string,
        config: Record<string, any>,
    ): Promise<string | null>;
}
