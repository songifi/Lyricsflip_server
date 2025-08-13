import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum GuessType {
  ARTIST = 'artist',
  SONG_TITLE = 'songTitle',
}

export class GuessDto {
  @IsNumber()
  @IsNotEmpty()
  lyricId: number;

  @IsEnum(GuessType)
  @IsNotEmpty()
  guessType: GuessType;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  guessValue: string;
}
