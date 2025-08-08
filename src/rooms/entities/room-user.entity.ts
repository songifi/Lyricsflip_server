import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Room } from './room.entity';

@Entity()
@Unique(['user', 'room'])
export class RoomUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.rooms, { eager: true })
  user: User;

  @ManyToOne(() => Room, room => room.participants)
  room: Room;

  @Column({ default: false })
  hasGuessed: boolean;

  @Column({ type: 'text', nullable: true })
  guess: string | null;

  @Column({ default: 0 })
  score: number;
}
