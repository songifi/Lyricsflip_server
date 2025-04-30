import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatroomMessage } from './entities/chatroom-message.entity';
import { Chatroom } from './entities/chatroom.entity';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(ChatroomMessage)
    private readonly messageRepository: Repository<ChatroomMessage>,
    @InjectRepository(Chatroom)
    private readonly roomRepository: Repository<Chatroom>,
  ) {}

  async getRoomMessages(roomId: string): Promise<ChatroomMessage[]> {
    return this.messageRepository.find({
      where: { chatroom: { id: roomId } },
      order: { timestamp: 'ASC' },
    });
  }

  async getRoom(roomId: string): Promise<Chatroom | null> {
    return this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['chatroom_messages'],
    });
  }
}
