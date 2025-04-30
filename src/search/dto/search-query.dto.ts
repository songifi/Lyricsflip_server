import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SearchType {
  USER = 'user',
  SONG = 'song',
  SESSION = 'session',
}

export class SearchQueryDto {
  @IsEnum(SearchType)
  type: SearchType;

  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}