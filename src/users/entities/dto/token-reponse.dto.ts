import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class TokenResponseDto {
  @Expose()
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @Expose()
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token',
    required: false,
  })
  refreshToken?: string;

  @Expose()
  @ApiProperty({
    example: 3600,
    description: 'Access token lifetime in seconds',
  })
  expiresIn: number;

  @Expose()
  @ApiProperty({
    example: 'bearer',
    description: 'Token type',
  })
  tokenType: string = 'bearer';

  @Expose()
  @ApiProperty({
    type: UserResponseDto,
    description: 'Authenticated user information',
  })
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
