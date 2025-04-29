import { IsNotEmpty } from 'class-validator';

export class CreateLyricSnippetDto {
  @IsNotEmpty() songName: string;
  @IsNotEmpty() artist: string;
  @IsNotEmpty() snippetText: string;
  @IsNotEmpty() answer: string;
  @IsNotEmpty() category: string;
}
