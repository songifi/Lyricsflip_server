import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { User } from './entities/user.entity';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users.' })
  findAll() {
    return this.usersService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile data.' })
  getProfile(@GetUser() user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      xp: user.xp,
      level: user.level,
      preferredGenre: user.preferredGenre,
      preferredDecade: user.preferredDecade,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  /**
   * PATCH /users/preferences - Update user preferences
   * Updates the current user's music genre and decade preferences
   */
  @UseGuards(JwtAuthGuard)
  @Patch('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({ status: 200, description: 'User preferences updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid preference data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updatePreferences(
    @GetUser() user: User,
    @Body() updatePreferencesDto: UpdateUserPreferencesDto,
  ) {
    const updatedUser = await this.usersService.updatePreferences(user.id, updatePreferencesDto);
    return {
      message: 'Preferences updated successfully',
      preferences: {
        preferredGenre: updatedUser.preferredGenre,
        preferredDecade: updatedUser.preferredDecade,
      },
    };
  }

  /**
   * GET /users/preferences - Get user preferences
   * Returns the current user's music preferences
   */
  @UseGuards(JwtAuthGuard)
  @Get('preferences')
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiResponse({ status: 200, description: 'User preferences retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getUserPreferences(@GetUser() user: User) {
    const preferences = await this.usersService.getUserPreferences(user.id);
    return {
      preferences,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User data.' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted.' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
