import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSongDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  artist: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  album?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty()
  @IsUUID()
  categoryId: string;
}
