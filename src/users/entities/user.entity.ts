import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { GameSession } from '../../game-sessions/entities/game-session.entity';
import { Role } from 'src/auth/roles/role.enum';

export enum UserLevel {
  GOSSIP_ROOKIE = 'Gossip Rookie',
  WORD_WHISPERER = 'Word Whisperer',
  LYRIC_SNIPER = 'Lyric Sniper',
  BAR_GENIUS = 'Bar Genius',
  GOSSIP_GOD = 'Gossip God',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column()
  @Exclude() // Exclude password from serialization
  passwordHash: string;

  @Column({ default: 0 })
  xp: number; // total experience points

  @Column({ default: 1 })
  level: number; // numeric level (1 = Rookie, etc.)

  @Column({
    type: 'enum',
    enum: UserLevel,
    default: UserLevel.GOSSIP_ROOKIE,
  })
  levelTitle: UserLevel; // human-readable title

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({
    type: 'varchar',
    length: 20,
    enum: Role,
    default: Role.User,
  }) // Default role for new users
  role: Role; // 'user' or 'admin'

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 100 })
  mockTokenBalance: number; // Starting balance of 100 mock tokens

  @OneToMany(() => GameSession, (gameSession) => gameSession.player)
  gameSessions: GameSession[];
}
