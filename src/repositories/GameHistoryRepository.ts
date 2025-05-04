import { Repository } from 'typeorm';
import { GameHistory } from '../entities/GameHistory';
import { AppDataSource } from '../data-source';

export class GameHistoryRepository {
    private repository: Repository<GameHistory>;

    constructor() {
        this.repository = AppDataSource.getRepository(GameHistory);
    }

    async findByUserId(userId: string): Promise<GameHistory[]> {
        return this.repository.find({ where: { userId } });
    }

    async findById(id: number): Promise<GameHistory | null> {
        return this.repository.findOne({ where: { id } });
    }

    async create(history: Partial<GameHistory>): Promise<GameHistory> {
        const newHistory = this.repository.create(history);
        return this.repository.save(newHistory);
    }

    async update(id: number, history: Partial<GameHistory>): Promise<GameHistory | null> {
        await this.repository.update(id, history);
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}