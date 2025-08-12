import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { LyricsModule } from '../lyrics/lyrics.module';

@Module({
  imports: [UsersModule, LyricsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
