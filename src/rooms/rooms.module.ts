import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';
import { RoomUser } from './entities/room-user.entity';
import { Lyrics } from '../lyrics/entities/lyrics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomUser, Lyrics]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
