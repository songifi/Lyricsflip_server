import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Role } from '../../users/enums/role.enum';

export class RegisterDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username (3-20 characters)',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscores',
  })
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Password (8-32 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character)',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'Password too weak - must include upper, lower, number and special char',
  })
  password: string;

  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    example: Role.USER,
    description: 'User role (default: USER)',
    required: false,
  })
  @IsOptional()
  role?: Role;
}
