import { IsString, IsNotEmpty, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Genre } from '../entities/lyrics.entity';

export class CreateLyricsDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  artist: string;

  @IsString()
  @IsNotEmpty()
  songTitle: string;

  @IsEnum(Genre)
  genre: Genre;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  decade: number;
}
