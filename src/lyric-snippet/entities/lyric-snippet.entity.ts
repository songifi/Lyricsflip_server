import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class LyricSnippet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  songName: string;

  @Column()
  artist: string;

  @Column()
  snippetText: string;

  @Column()
  answer: string;

  @Column()
  category: string;
}
