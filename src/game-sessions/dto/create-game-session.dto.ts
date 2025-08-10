import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { GameCategory, GameSessionStatus } from '../entities/game-session.entity';

export class CreateGameSessionDto {
  @IsNotEmpty()
  @IsEnum(GameCategory)
  category: GameCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsEnum(GameSessionStatus)
  status?: GameSessionStatus;
}
