import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lyrics } from './entities/lyrics.entity';
import { LyricsService } from './lyrics.service';
import { LyricsController } from './lyrics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lyrics])],
  providers: [LyricsService],
  controllers: [LyricsController],
})
export class LyricsModule {}
