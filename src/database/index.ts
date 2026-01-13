import { Sequelize } from 'sequelize';
import { User } from './models/User';

export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'root',
    database: 'whabot',
    logging: false,
});

export const initDatabase = async () => {
    User.initModel(sequelize);

    await sequelize.authenticate();
    await sequelize.sync();
};

