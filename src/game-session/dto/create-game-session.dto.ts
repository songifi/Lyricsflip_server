// src/game-session/dto/create-game-session.dto.ts
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateGameSessionDto {
  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(8)
  maxPlayers?: number;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}