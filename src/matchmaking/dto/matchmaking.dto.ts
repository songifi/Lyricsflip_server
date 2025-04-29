// src/matchmaking/dto/matchmaking.dto.ts
import { IsEnum, IsString, IsOptional, IsArray, IsUUID, ValidateNested, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PlayerSkillLevel, GameCategory, GameDifficulty } from '../types/matchmaking.types';

export class MatchmakingPreferencesDto {
  @IsOptional()
  @IsArray()
  @IsEnum(GameCategory, { each: true })
  categories?: GameCategory[];

  @IsOptional()
  @IsEnum(GameDifficulty)
  difficulty?: GameDifficulty;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  withFriendIds?: string[];

  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(600)
  maxWaitTimeSeconds?: number;
}

export class MatchRequestDto {
  @IsString()
  playerId: string;

  @IsEnum(PlayerSkillLevel)
  skillLevel: PlayerSkillLevel;

  @ValidateNested()
  @Type(() => MatchmakingPreferencesDto)
  preferences: MatchmakingPreferencesDto;
}

