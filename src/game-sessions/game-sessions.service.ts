import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameSession, GameSessionStatus } from './entities/game-session.entity';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { UpdateGameSessionDto } from './dto/update-game-session.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class GameSessionsService {
  constructor(
    @InjectRepository(GameSession)
    private readonly gameSessionRepository: Repository<GameSession>,
  ) {}

  async create(createGameSessionDto: CreateGameSessionDto, player: User): Promise<GameSession> {
    const gameSession = this.gameSessionRepository.create({
      ...createGameSessionDto,
      player,
    });
    return this.gameSessionRepository.save(gameSession);
  }

  async findAll(): Promise<GameSession[]> {
    return this.gameSessionRepository.find({
      relations: ['player'],
    });
  }

  async findOne(id: string): Promise<GameSession> {
    const gameSession = await this.gameSessionRepository.findOne({
      where: { id },
      relations: ['player'],
    });

    if (!gameSession) {
      throw new NotFoundException(`Game session with ID "${id}" not found`);
    }

    return gameSession;
  }

  async update(id: string, updateGameSessionDto: UpdateGameSessionDto): Promise<GameSession> {
    const gameSession = await this.findOne(id);
    Object.assign(gameSession, updateGameSessionDto);
    return this.gameSessionRepository.save(gameSession);
  }

  async remove(id: string): Promise<void> {
    const result = await this.gameSessionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Game session with ID "${id}" not found`);
    }
  }

  async getTopScores(limit: number = 10): Promise<GameSession[]> {
    return this.gameSessionRepository.find({
      where: { status: GameSessionStatus.COMPLETED },
      order: { score: 'DESC' },
      take: limit,
      relations: ['player'],
    });
  }

  async getRecentGames(userId: string, limit: number = 5): Promise<GameSession[]> {
    return this.gameSessionRepository.find({
      where: { player: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['player'],
    });
  }

  async updateGameStatus(id: string, status: GameSessionStatus): Promise<GameSession> {
    const gameSession = await this.findOne(id);
    gameSession.status = status;
    return this.gameSessionRepository.save(gameSession);
  }

  async updateScore(id: string, score: number): Promise<GameSession> {
    const gameSession = await this.findOne(id);
    gameSession.score = score;
    if (score > 0) {
      gameSession.status = GameSessionStatus.COMPLETED;
    }
    return this.gameSessionRepository.save(gameSession);
  }
}
