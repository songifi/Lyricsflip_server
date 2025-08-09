import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { LyricsService } from './lyrics.service';
import { CreateLyricsDto } from './dto/create-lyrics.dto';
import { UpdateLyricsDto } from './dto/update-lyrics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('lyrics')
@Controller('lyrics')
export class LyricsController {
  constructor(private readonly lyricsService: LyricsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new lyrics' })
  @ApiResponse({ status: 201, description: 'Lyrics created.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createLyricsDto: CreateLyricsDto, @Request() req) {
    return this.lyricsService.create(createLyricsDto, req.user);
  }

  @ApiOperation({ summary: 'Get all lyrics' })
  @ApiQuery({ name: 'artist', required: false })
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'decade', required: false })
  @Get()
  findAll(@Query() query: any) {
    return this.lyricsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get random lyrics' })
  @ApiQuery({ name: 'count', required: false, description: 'Number of random lyrics to fetch (default: 1)' })
  @ApiQuery({ name: 'genre', required: false, description: 'Filter by genre' })
  @ApiQuery({ name: 'decade', required: false, description: 'Filter by decade' })
  @Get('random')
  getRandomLyrics(
    @Query('count') count?: string,
    @Query('genre') genre?: string,
    @Query('decade') decade?: string,
  ) {
    const countNum = count ? parseInt(count, 10) : 1;
    const decadeNum = decade ? parseInt(decade, 10) : undefined;
    return this.lyricsService.getRandomLyrics(countNum, genre, decadeNum);
  }

  @ApiOperation({ summary: 'Get lyrics by genre' })
  @ApiQuery({ name: 'genre', required: true, description: 'Genre to filter by' })
  @Get('genre/:genre')
  getLyricsByGenre(@Param('genre') genre: string) {
    return this.lyricsService.getLyricsByCategory('genre', genre);
  }

  @ApiOperation({ summary: 'Get lyrics by decade' })
  @ApiQuery({ name: 'decade', required: true, description: 'Decade to filter by' })
  @Get('decade/:decade')
  getLyricsByDecade(@Param('decade') decade: string) {
    const decadeNum = parseInt(decade, 10);
    return this.lyricsService.getLyricsByCategory('decade', decadeNum);
  }

  @ApiOperation({ summary: 'Get lyrics by artist' })
  @ApiQuery({ name: 'artist', required: true, description: 'Artist to filter by' })
  @Get('artist/:artist')
  getLyricsByArtist(@Param('artist') artist: string) {
    return this.lyricsService.getLyricsByCategory('artist', artist);
  }

  @ApiOperation({ summary: 'Get lyrics by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lyricsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lyrics' })
  @ApiResponse({ status: 200, description: 'Lyrics updated.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLyricsDto: UpdateLyricsDto, @Request() req) {
    return this.lyricsService.update(id, updateLyricsDto, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete lyrics' })
  @ApiResponse({ status: 204, description: 'Lyrics deleted.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lyricsService.remove(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear lyrics cache (Admin only)' })
  @ApiResponse({ status: 200, description: 'Cache cleared successfully.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('cache/clear')
  clearCache() {
    return this.lyricsService.clearCache();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cache statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Cache statistics retrieved.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('cache/stats')
  getCacheStats() {
    return this.lyricsService.getCacheStats();
  }
}
