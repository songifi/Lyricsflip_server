import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Registered email ',
  })
  @IsEmail()
  email: string; 

  @ApiProperty({
    example: 'Password123!',
    description: 'Account password',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
