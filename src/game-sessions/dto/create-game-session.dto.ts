import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsString,
  IsBoolean,
} from 'class-validator';
import {
  GameCategory,
  GameSessionStatus,
  GameMode,
} from '../entities/game-session.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameSessionDto {
  @ApiProperty({ enum: GameCategory, description: 'Game category' })
  @IsNotEmpty()
  @IsEnum(GameCategory)
  category: GameCategory;

  @ApiProperty({ enum: GameMode, description: 'Game mode', required: false })
  @IsOptional()
  @IsEnum(GameMode)
  mode?: GameMode;

  @ApiProperty({
    description: 'Player Two ID for multiplayer games',
    required: false,
  })
  @IsOptional()
  @IsString()
  playerTwoId?: string;

  @ApiProperty({
    description: 'Score',
    required: false,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @ApiProperty({
    enum: GameSessionStatus,
    description: 'Session status',
    required: false,
  })
  @IsOptional()
  @IsEnum(GameSessionStatus)
  status?: GameSessionStatus;

  @ApiProperty({
    description: 'Wager amount for wagered games',
    required: false,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  wagerAmount?: number;

  @ApiProperty({
    description: 'Whether this session has a wager',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasWager?: boolean;
}
