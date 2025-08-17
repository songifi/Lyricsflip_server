import { IsString, IsNotEmpty, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Genre } from '../entities/lyrics.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLyricsDto {
  @ApiProperty({ description: 'Lyrics content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Artist name' })
  @IsString()
  @IsNotEmpty()
  artist: string;

  @ApiProperty({ description: 'Song title' })
  @IsString()
  @IsNotEmpty()
  songTitle: string;

  @ApiProperty({ enum: Genre, description: 'Genre of the song' })
  @IsEnum(Genre)
  genre: Genre;

  @ApiProperty({ description: 'Decade of the song', minimum: 1900, maximum: new Date().getFullYear(), type: Number })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  decade: number;
}
