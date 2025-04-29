// src/game-session/repositories/game-session.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameSession } from '../entities/game-session.entity';
import { User } from '../../users/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { CreateGameSessionDto } from '../dto/create-game-session.dto';

@Injectable()
export class GameSessionRepository {
  constructor(
    @InjectRepository(GameSession)
    private gameSessionRepo: Repository<GameSession>,
  ) {}

  async create(creator: User, dto: CreateGameSessionDto): Promise<GameSession> {
    const session = this.gameSessionRepo.create({
      players: [creator],
      maxPlayers: dto.maxPlayers || 4,
      isPrivate: dto.isPrivate || false,
      inviteCode: dto.isPrivate ? uuid().substring(0, 8) : null,
      currentRound: 0,
    });
    
    return this.gameSessionRepo.save(session);
  }

  async findById(id: string): Promise<GameSession> {
    return this.gameSessionRepo.findOne({ 
      where: { id },
      relations: ['players', 'winner', 'rounds']
    });
  }

  async findByInviteCode(code: string): Promise<GameSession> {
    return this.gameSessionRepo.findOne({ 
      where: { inviteCode: code },
      relations: ['players', 'winner']
    });
  }

  async findPendingSessions(): Promise<GameSession[]> {
    return this.gameSessionRepo.find({
      where: { status: GameSessionStatus.PENDING },
      relations: ['players']
    });
  }

  async update(session: GameSession): Promise<GameSession> {
    return this.gameSessionRepo.save(session);
  }

  async addPlayer(session: GameSession, player: User): Promise<GameSession> {
    if (!session.players.find(p => p.id === player.id)) {
      session.players.push(player);
      return this.gameSessionRepo.save(session);
    }
    return session;
  }

  async updateStatus(
    sessionId: string, 
    status: GameSessionStatus, 
    winnerId?: string
  ): Promise<GameSession> {
    const session = await this.findById(sessionId);
    session.status = status;
    
    if (winnerId) {
      session.winnerId = winnerId;
      session.winner = session.players.find(p => p.id === winnerId);
    }
    
    return this.gameSessionRepo.save(session);
  }
}
