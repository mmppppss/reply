import server from '@/server'
import startApi from '@/api/server'

async function bootstrap() {
    await Promise.all([
        server(),
        startApi()
    ]);
}

bootstrap().catch(err => {
    console.error("Bootstrap error:", err);
    process.exit(1);
});
