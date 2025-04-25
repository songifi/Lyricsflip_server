import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from '../../enums/role.enum';

export class UserResponseDto {
  @Expose()
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique UUID identifier for the user',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username',
    minLength: 3,
    maxLength: 20,
  })
  username: string;

  @Expose()
  @ApiProperty({
    example: 'user@example.com',
    description: "User's email address",
    format: 'email',
  })
  email: string;

  @Expose()
  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    example: Role.USER,
    description: 'User role',
  })
  role: Role;

  @Expose()
  @ApiProperty({
    example: '2023-05-15T10:00:00.000Z',
    description: 'Date when the user was created',
    type: Date,
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2023-05-16T15:30:00.000Z',
    description: 'Date when the user was last updated',
    type: Date,
    required: false,
  })
  updatedAt?: Date;
}
