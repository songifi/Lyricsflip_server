import { Request, Response } from 'express';
import { GameHistoryService } from '../services/GameHistoryService';

export class GameHistoryController {
    private gameHistoryService: GameHistoryService;

    constructor() {
        this.gameHistoryService = new GameHistoryService();
    }

    async getUserHistory(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            const history = await this.gameHistoryService.getUserHistory(userId);
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch game history' });
        }
    }

    async getHistoryById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const history = await this.gameHistoryService.getHistoryById(id);
            if (!history) {
                res.status(404).json({ error: 'History not found' });
                return;
            }
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch history' });
        }
    }

    async createHistory(req: Request, res: Response): Promise<void> {
        try {
            const historyData = req.body;
            const newHistory = await this.gameHistoryService.createHistory(historyData);
            res.status(201).json(newHistory);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create history' });
        }
    }

    async updateHistory(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const historyData = req.body;
            const updatedHistory = await this.gameHistoryService.updateHistory(id, historyData);
            if (!updatedHistory) {
                res.status(404).json({ error: 'History not found' });
                return;
            }
            res.json(updatedHistory);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update history' });
        }
    }

    async deleteHistory(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.gameHistoryService.deleteHistory(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete history' });
        }
    }
}