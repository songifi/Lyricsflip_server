import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  lyricId?: string;
}
