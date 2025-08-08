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
}
