import server from '@/server'
import startApi from '@/api/server'
import { ModuleRegistry } from '@/modules/shared/application/ModuleRegistry'
import { KeywordModule } from '@/modules/shared/application/KeywordModule'
import { PlnModule } from '@/modules/pln/PlnModule'
async function bootstrap() {
    const registry = ModuleRegistry.getInstance()
    const keywordModule = KeywordModule.getInstance()

    registry.register(keywordModule)
    await keywordModule.loadAll()

    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    const geminiApiKey = process.env.GEMINI_API_KEY
    const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite"
    const openRouterModel = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free"

    if (geminiApiKey || openRouterApiKey) {
        registry.register(new PlnModule(
            openRouterApiKey || "",
            geminiApiKey || "",
            geminiModel,
            openRouterModel,
        ))
        console.log(`[Bootstrap] Módulo PLN registrado (Gemini: ${geminiModel}, fallback OpenRouter: ${openRouterApiKey ? "sí" : "no"})`)
    } else {
        console.warn('[Bootstrap] Ni GEMINI_API_KEY ni OPENROUTER_API_KEY configuradas — módulo PLN deshabilitado')
    }

    await Promise.all([
        server(),
        startApi(),
    ]);
}

bootstrap().catch(err => {
    console.error("Bootstrap error:", err);
    process.exit(1);
});
