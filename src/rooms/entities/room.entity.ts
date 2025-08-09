import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Lyrics } from '../../lyrics/entities/lyrics.entity';
import { RoomUser } from './room-user.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => Lyrics)
  @JoinColumn()
  lyric: Lyrics;

  @Column()
  lyricId: number;

  @OneToMany(() => RoomUser, roomUser => roomUser.room)
  roomUsers: RoomUser[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ default: false })
  isClosed: boolean;
}
