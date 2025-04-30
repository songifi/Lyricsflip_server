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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateSongDto } from './dto/create-song.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateLyricDto } from './dto/create-lyric.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Song endpoints
  @Post('songs')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new song' })
  @ApiResponse({ status: 201, description: 'Song created successfully' })
  createSong(@Body() createSongDto: CreateSongDto) {
    return this.adminService.createSong(createSongDto);
  }

  @Get('songs')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all songs' })
  @ApiResponse({ status: 200, description: 'Return all songs' })
  findAllSongs() {
    return this.adminService.findAllSongs();
  }

  @Get('songs/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a song by id' })
  @ApiResponse({ status: 200, description: 'Return the song' })
  findSongById(@Param('id') id: string) {
    return this.adminService.findSongById(id);
  }

  @Patch('songs/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a song' })
  @ApiResponse({ status: 200, description: 'Song updated successfully' })
  updateSong(
    @Param('id') id: string,
    @Body() updateSongDto: Partial<CreateSongDto>,
  ) {
    return this.adminService.updateSong(id, updateSongDto);
  }

  @Delete('songs/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a song' })
  @ApiResponse({ status: 200, description: 'Song deleted successfully' })
  removeSong(@Param('id') id: string) {
    return this.adminService.removeSong(id);
  }

  // Category endpoints
  @Post('categories')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.adminService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories' })
  findAllCategories() {
    return this.adminService.findAllCategories();
  }

  @Get('categories/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({ status: 200, description: 'Return the category' })
  findCategoryById(@Param('id') id: string) {
    return this.adminService.findCategoryById(id);
  }

  @Patch('categories/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<CreateCategoryDto>,
  ) {
    return this.adminService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  removeCategory(@Param('id') id: string) {
    return this.adminService.removeCategory(id);
  }

  // Lyric endpoints
  @Post('lyrics')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new lyric' })
  @ApiResponse({ status: 201, description: 'Lyric created successfully' })
  createLyric(@Body() createLyricDto: CreateLyricDto) {
    return this.adminService.createLyric(createLyricDto);
  }

  @Get('lyrics')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all lyrics' })
  @ApiResponse({ status: 200, description: 'Return all lyrics' })
  findAllLyrics() {
    return this.adminService.findAllLyrics();
  }

  @Get('lyrics/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a lyric by id' })
  @ApiResponse({ status: 200, description: 'Return the lyric' })
  findLyricById(@Param('id') id: string) {
    return this.adminService.findLyricById(id);
  }

  @Patch('lyrics/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a lyric' })
  @ApiResponse({ status: 200, description: 'Lyric updated successfully' })
  updateLyric(
    @Param('id') id: string,
    @Body() updateLyricDto: Partial<CreateLyricDto>,
  ) {
    return this.adminService.updateLyric(id, updateLyricDto);
  }

  @Delete('lyrics/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a lyric' })
  @ApiResponse({ status: 200, description: 'Lyric deleted successfully' })
  removeLyric(@Param('id') id: string) {
    return this.adminService.removeLyric(id);
  }
}
