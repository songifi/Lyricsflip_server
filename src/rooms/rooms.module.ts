import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomUser } from './entities/room-user.entity';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Lyric } from '../lyrics/lyrics.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomUser, Lyric, User]),
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
