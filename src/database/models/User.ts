import {
	DataTypes,
	Model,
	Optional,
	Sequelize
} from 'sequelize';

export interface UserAttributes {
	id: number;
	user: string;
	password: string;
	mail: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export type UserCreationAttributes =
	Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class User
	extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes {
	public id!: number;
	public user!: string;
	public password!: string;
	public mail!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	static initModel(sequelize: Sequelize): typeof User {
		User.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
				},
				user: {
					type: DataTypes.STRING(50),
					allowNull: false,
					unique: true,
				},
				password: {
					type: DataTypes.STRING(255),
					allowNull: false,
				},
				mail: {
					type: DataTypes.STRING(100),
					allowNull: false,
					unique: true,
				},
			},
			{
				sequelize,
				tableName: 'users',
				timestamps: true,
			}
		);

		return User;
	}
}
