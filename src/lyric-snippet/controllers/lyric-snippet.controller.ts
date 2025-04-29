import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { LyricSnippetService } from '../services/lyric-snippet.service';
import { CreateLyricSnippetDto } from '../dto/create-lyric-snippet.dto';

@Controller('lyrics')
export class LyricSnippetController {
  constructor(private readonly lyricService: LyricSnippetService) {}

  @Post()
  create(@Body() dto: CreateLyricSnippetDto) {
    return this.lyricService.create(dto);
  }

  @Get()
  findAll() {
    return this.lyricService.findAll();
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.lyricService.findByCategory(category);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateLyricSnippetDto>) {
    return this.lyricService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.lyricService.delete(id);
  }
}
