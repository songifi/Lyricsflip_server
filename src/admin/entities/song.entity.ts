import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Lyric } from './lyric.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column({ nullable: true })
  album: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  duration: number;

  @ManyToOne(() => Category, (category) => category.songs)
  category: Category;

  @OneToMany(() => Lyric, (lyric) => lyric.song)
  lyrics: Lyric[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
