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

    const apiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free"
    if (apiKey) {
        registry.register(new PlnModule(apiKey, model))
        console.log(`[Bootstrap] Módulo PLN registrado con OpenRouter (modelo: ${model})`)
    } else {
        console.warn('[Bootstrap] OPENROUTER_API_KEY no configurada — módulo PLN deshabilitado')
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
