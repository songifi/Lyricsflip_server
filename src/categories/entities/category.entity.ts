import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LyricSnippet } from '../../lyric-snippets/entities/lyric-snippet.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => LyricSnippet, (lyricSnippet) => lyricSnippet.category)
  lyricSnippets: LyricSnippet[];
}
