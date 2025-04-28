import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Song } from './song.entity';

@Entity('lyrics')
export class Lyric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({ type: 'float' })
  startTime: number;

  @Column({ type: 'float' })
  endTime: number;

  @ManyToOne(() => Song, (song) => song.lyrics)
  song: Song;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
