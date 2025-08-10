import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum GameSessionStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum GameCategory {
  AFROBEATS = 'Afrobeats',
  NINETIES_RNB = '90s R&B',
  HIP_HOP = 'Hip Hop',
  POP = 'Pop',
  ROCK = 'Rock',
}

@Entity('game_sessions')
export class GameSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.gameSessions)
  player: User;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({
    type: 'enum',
    enum: GameCategory,
  })
  category: GameCategory;

  @Column({
    type: 'enum',
    enum: GameSessionStatus,
    default: GameSessionStatus.IN_PROGRESS,
  })
  status: GameSessionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
