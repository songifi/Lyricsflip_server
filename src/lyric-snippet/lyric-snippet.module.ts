import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LyricSnippet } from './entities/lyric-snippet.entity';
import { LyricSnippetService } from './services/lyric-snippet.service';
import { LyricSnippetController } from './controllers/lyric-snippet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LyricSnippet])],
  controllers: [LyricSnippetController],
  providers: [LyricSnippetService],
})
export class LyricSnippetModule {}
