import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { Lyric } from '../../lyrics/lyrics.entity';
import { RoomUser } from './room-user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lyric, lyric => lyric.rooms, { eager: true })
  lyric: Lyric;

  @OneToMany(() => RoomUser, ru => ru.room, { cascade: true })
  participants: RoomUser[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
