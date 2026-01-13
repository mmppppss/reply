import { User } from '@/database/models/User';

export class UserRepository {
	async create(data: {
		user: string;
		password: string;
		mail: string;
	}): Promise<User> {
		return User.create(data);
	}

	async findById(id: number): Promise<User | null> {
		return User.findByPk(id);
	}

	async findByUser(username: string): Promise<User | null> {
		return User.findOne({
			where: { user: username },
		});
	}

	async findByMail(mail: string): Promise<User | null> {
		return User.findOne({
			where: { mail },
		});
	}

	async updatePassword(id: number, password: string): Promise<void> {
		await User.update(
			{ password },
			{ where: { id } }
		);
	}

	async delete(id: number): Promise<void> {
		await User.destroy({
			where: { id },
		});
	}
}

