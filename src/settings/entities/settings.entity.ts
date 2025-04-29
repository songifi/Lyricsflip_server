import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  NONE = 'none',
  EMAIL = 'email',
  PUSH = 'push',
  ALL = 'all',
}

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('simple-array', { nullable: true })
  preferredCategories: string[];

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.ALL,
  })
  notificationPreferences: NotificationType;

  @Column({ default: true })
  soundEnabled: boolean;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: 10 })
  itemsPerPage: number;

  @Column({ default: true })
  autoPlayEnabled: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}