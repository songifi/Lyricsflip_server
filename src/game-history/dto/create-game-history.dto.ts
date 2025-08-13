import { IsEnum, IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { GuessType } from '../../game/dto/guess.dto';

export class CreateGameHistoryDto {
  @IsUUID()
  @IsNotEmpty()
  playerId: string;

  @IsNumber()
  @IsNotEmpty()
  lyricId: number;

  @IsUUID()
  @IsOptional()
  gameSessionId?: string;

  @IsEnum(GuessType)
  @IsNotEmpty()
  guessType: GuessType;

  @IsString()
  @IsNotEmpty()
  guessValue: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;

  @IsNumber()
  @IsOptional()
  pointsAwarded?: number;

  @IsNumber()
  @IsOptional()
  xpChange?: number;

  @IsNumber()
  @IsOptional()
  wagerAmount?: number;
}
