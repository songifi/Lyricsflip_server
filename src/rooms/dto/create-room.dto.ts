import { IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  lyricId: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string; // ISO date string
}
