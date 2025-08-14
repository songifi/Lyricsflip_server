import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { RandomLyricOptionsDto } from './random-lyrics-option.dto';

export class MultipleLyricsDto extends RandomLyricOptionsDto {
  @IsNumber()
  @Min(1)
  @Max(20) // Reasonable limit to prevent abuse
  @Type(() => Number)
  count: number;
}
