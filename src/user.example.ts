import { initDatabase } from '@/database';
import { UserRepository } from '@/database/repositories/User.repo';

async function main() {
    await initDatabase();

    const userRepo = new UserRepository();

    const user = await userRepo.create({
        user: 'pedro',
        mail: 'pedro@mail.com',
        password: '123456',
    });

    console.log('Usuario creado:', user.toJSON());

    const foundByUser = await userRepo.findByUser('pedro');
    console.log('Encontrado por user:', foundByUser?.toJSON());

    const foundByMail = await userRepo.findByMail('pedro@mail.com');
    console.log('Encontrado por mail:', foundByMail?.toJSON());
}

main().catch(console.error);
