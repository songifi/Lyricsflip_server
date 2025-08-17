import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Lyrics } from './entities/lyrics.entity';
import { LyricsService } from './lyrics.service';
import { LyricsController } from './lyrics.controller';
import { cacheConfig } from '../config/cache.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lyrics]),
    CacheModule.register({
      ttl: cacheConfig.lyricsTTL,
      // Use half of global max for lyrics-specific cache
      max: Math.floor(cacheConfig.maxItems / 2),
    }),
  ],
  providers: [LyricsService],
  controllers: [LyricsController],
  exports: [LyricsService],
})
export class LyricsModule {}
