import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Song } from './entities/song.entity';
import { Category } from './entities/category.entity';
import { Lyric } from './entities/lyric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Category, Lyric])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
