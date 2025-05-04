import { GameHistoryRepository } from '../repositories/GameHistoryRepository';
import { GameHistory } from '../entities/GameHistory';

export class GameHistoryService {
    private gameHistoryRepository: GameHistoryRepository;

    constructor() {
        this.gameHistoryRepository = new GameHistoryRepository();
    }

    async getUserHistory(userId: string): Promise<GameHistory[]> {
        return this.gameHistoryRepository.findByUserId(userId);
    }

    async getHistoryById(id: number): Promise<GameHistory | null> {
        return this.gameHistoryRepository.findById(id);
    }

    async createHistory(historyData: Partial<GameHistory>): Promise<GameHistory> {
        return this.gameHistoryRepository.create(historyData);
    }

    async updateHistory(id: number, historyData: Partial<GameHistory>): Promise<GameHistory | null> {
        return this.gameHistoryRepository.update(id, historyData);
    }

    async deleteHistory(id: number): Promise<void> {
        return this.gameHistoryRepository.delete(id);
    }

    // Method to link with game session completion
    async recordGameSessionCompletion(
        userId: string,
        sessionId: string,
        score: number,
        result: string
    ): Promise<GameHistory> {
        const historyData = {
            userId,
            sessionId,
            score,
            result,
        };
        return this.createHistory(historyData);
    }
}