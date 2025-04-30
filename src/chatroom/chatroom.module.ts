import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomGateway } from './chatroom.gateway';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { Chatroom } from './entities/chatroom.entity';
import { ChatroomMessage } from './entities/chatroom-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chatroom, ChatroomMessage])],
  providers: [ChatroomGateway, ChatroomService],
  controllers: [ChatroomController],
})
export class ChatroomModule {}
