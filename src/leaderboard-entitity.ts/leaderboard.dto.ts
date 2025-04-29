import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SortBy {
  SCORE = 'totalScore',
  GAMES = 'gamesPlayed',
  WINS = 'wins',
}

export enum TimePeriod {
  ALL = 'all',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export class LeaderboardQueryDto {
  @ApiProperty({ enum: SortBy, default: SortBy.SCORE })
  @IsEnum(SortBy)
  @IsOptional()
  sortBy: SortBy = SortBy.SCORE;

  @ApiProperty({ enum: TimePeriod, default: TimePeriod.ALL })
  @IsEnum(TimePeriod)
  @IsOptional()
  timePeriod: TimePeriod = TimePeriod.ALL;

  @ApiProperty({ default: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiProperty({ default: 10, minimum: 1, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 10;
}

export class LeaderboardEntryDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  totalScore: number;

  @ApiProperty()
  gamesPlayed: number;

  @ApiProperty()
  wins: number;

  @ApiProperty()
  rank: number;
}

export class PaginatedLeaderboardResponseDto {
  @ApiProperty({ type: [LeaderboardEntryDto] })
  data: LeaderboardEntryDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;
}
