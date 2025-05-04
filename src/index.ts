import express from 'express';
import { AppDataSource } from './data-source';
import gameHistoryRoutes from './routes/gameHistoryRoutes';

const app = express();

app.use(express.json());

async function startServer() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        app.use('/api/game-history', gameHistoryRoutes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();
