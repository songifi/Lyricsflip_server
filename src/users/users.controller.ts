import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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

  /**
   * GET /leaderboard - Returns the top users by XP, level, or username
   * Query params: limit, offset, sort, order
   */
  @Get('/leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of users to return (default 10)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination (default 0)' })
  @ApiQuery({ name: 'sort', required: false, type: String, enum: ['xp', 'level', 'username'], description: 'Sort field (default xp)' })
  @ApiQuery({ name: 'order', required: false, type: String, enum: ['ASC', 'DESC'], description: 'Sort order (default DESC)' })
  @ApiResponse({ status: 200, description: 'Leaderboard data with pagination metadata.' })
  async getLeaderboard(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    const lim = limit ? parseInt(limit, 10) : 10;
    const off = offset ? parseInt(offset, 10) : 0;
    const sortField = sort || 'xp';
    const sortOrder = (order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    return this.usersService.getLeaderboard(lim, off, sortField, sortOrder as 'ASC' | 'DESC');
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
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User data.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
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
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
