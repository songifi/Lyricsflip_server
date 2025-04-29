import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  songId: number;

  @Column()
  category: string;

  @Column('int')
  score: number;

  @Column({ type: 'timestamptz' })
  playedAt: Date;
}
