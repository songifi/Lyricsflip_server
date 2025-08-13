import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GameSession } from '../../game-sessions/entities/game-session.entity';

export enum WagerStatus {
  PENDING = 'pending',
  STAKED = 'staked',
  WON = 'won',
  LOST = 'lost',
  REFUNDED = 'refunded',
}

@Entity('wagers')
export class Wager {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'playerAId' })
  playerA: User;

  @Column({ type: 'uuid' })
  playerAId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'playerBId' })
  playerB: User;

  @Column({ type: 'uuid' })
  playerBId: string;

  @Column({ type: 'int' })
  amount: number; // Amount each player stakes

  @Column({ type: 'int' })
  totalPot: number; // Total amount in the pot (amount * 2)

  @Column({
    type: 'enum',
    enum: WagerStatus,
    default: WagerStatus.PENDING,
  })
  status: WagerStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'winnerId' })
  winner: User;

  @Column({ type: 'uuid', nullable: true })
  winnerId: string;

  @Column({ type: 'text', nullable: true })
  resultMessage: string; // Message to display to users about wager result

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date; // When the wager was resolved (won/lost/refunded)
}
