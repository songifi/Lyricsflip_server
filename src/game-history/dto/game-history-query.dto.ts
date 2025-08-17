import { IsOptional, IsNumberString, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { GuessType } from '../../game/dto/guess.dto';

export class GameHistoryQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';

  @IsOptional()
  @IsEnum(GuessType)
  guessType?: GuessType;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isCorrect?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumberString()
  lyricId?: string;
}
