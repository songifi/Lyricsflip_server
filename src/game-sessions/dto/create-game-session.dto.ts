import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { GameCategory, GameSessionStatus } from '../entities/game-session.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameSessionDto {
  @ApiProperty({ enum: GameCategory, description: 'Game category' })
  @IsNotEmpty()
  @IsEnum(GameCategory)
  category: GameCategory;

  @ApiProperty({ description: 'Score', required: false, minimum: 0, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @ApiProperty({ enum: GameSessionStatus, description: 'Session status', required: false })
  @IsOptional()
  @IsEnum(GameSessionStatus)
  status?: GameSessionStatus;
}
