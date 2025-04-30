import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameMode } from '../entities/game-mode.entity';

@Injectable()
export class GameModeService {
  constructor(
    @InjectRepository(GameMode)
    private readonly gameModeRepository: Repository<GameMode>,
  ) {}

  async createGameMode(data: Partial<GameMode>): Promise<GameMode> {
    const gameMode = this.gameModeRepository.create(data); // Create new game mode entity
    return this.gameModeRepository.save(gameMode); // Save to the database
  }

  async findAll(): Promise<GameMode[]> {
    return this.gameModeRepository.find(); // Retrieve all game modes
  }

  async findOne(id: number): Promise<GameMode> {
    return this.gameModeRepository.findOneBy({ id }); // Find a game mode by ID
  }

  async updateGameMode(id: number, data: Partial<GameMode>): Promise<GameMode> {
    await this.gameModeRepository.update(id, data); // Update the game mode in the database
    return this.gameModeRepository.findOneBy({ id }); // Return the updated entity
  }

  async deleteGameMode(id: number): Promise<void> {
    await this.gameModeRepository.delete(id); // Delete the game mode by ID
  }
}