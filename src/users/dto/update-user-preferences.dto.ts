import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { MusicGenre, MusicDecade } from '../entities/user.entity';

export class UpdateUserPreferencesDto {
  @ApiProperty({
    description: 'User\'s preferred music genre',
    enum: MusicGenre,
    required: false,
    example: MusicGenre.POP,
  })
  @IsOptional()
  @IsEnum(MusicGenre, { message: 'Invalid music genre' })
  preferredGenre?: MusicGenre;

  @ApiProperty({
    description: 'User\'s preferred music decade',
    enum: MusicDecade,
    required: false,
    example: MusicDecade.NINETIES,
  })
  @IsOptional()
  @IsEnum(MusicDecade, { message: 'Invalid music decade' })
  preferredDecade?: MusicDecade;
}
