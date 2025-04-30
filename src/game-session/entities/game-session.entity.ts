// src/game-session/entities/game-session.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Round } from '../../rounds/entities/round.entity';
import { GameMode } from 'src/game-mode/entities/game-mode.entity';

export enum GameSessionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('game_sessions')
export class GameSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'game_session_players',
    joinColumn: { name: 'session_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  players: User[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  currentRound: number;

  @Column({ nullable: true })
  winnerId: string;

  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  winner: User;

  @Column({
    type: 'enum',
    enum: GameSessionStatus,
    default: GameSessionStatus.PENDING,
  })
  status: GameSessionStatus;

  @OneToMany(() => Round, round => round.gameSession)
  rounds: Round[];

  @Column({ default: 4 })
  maxPlayers: number;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ nullable: true })
  inviteCode: string;

  @ManyToOne(() => GameMode, { eager: true })
  gameMode: GameMode; 

}


