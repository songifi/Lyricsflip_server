import { IsString, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLyricDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNumber()
  startTime: number;

  @ApiProperty()
  @IsNumber()
  endTime: number;

  @ApiProperty()
  @IsUUID()
  songId: string;
}
