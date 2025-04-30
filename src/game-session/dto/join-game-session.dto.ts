// src/game-session/dto/join-game-session.dto.ts
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class JoinGameSessionDto {
  @IsNotEmpty()
  @IsUUID()
  sessionId: string;

  @IsOptional()
  @IsString()
  inviteCode?: string;
}