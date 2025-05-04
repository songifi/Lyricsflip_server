import { DataSource } from 'typeorm';
import { GameHistory } from './entities/GameHistory';

export const AppDataSource = new DataSource({
    type: 'postgres', // or your preferred database
    host: 'localhost',
    port: 5432,
    username: 'your_username',
    password: 'your_password',
    database: 'your_database',
    synchronize: true, // set to false in production
    logging: false,
    entities: [GameHistory],
    migrations: [],
    subscribers: [],
});