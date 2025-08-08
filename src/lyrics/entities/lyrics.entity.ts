import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum Genre {
  Afrobeats = 'Afrobeats',
  HipHop = 'Hip-Hop',
  Pop = 'Pop',
  Other = 'Other',
}

@Entity()
export class Lyrics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column()
  artist: string;

  @Column()
  songTitle: string;

  @Column({ type: 'enum', enum: Genre, default: Genre.Other })
  genre: Genre;

  @Column()
  decade: number;

  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
