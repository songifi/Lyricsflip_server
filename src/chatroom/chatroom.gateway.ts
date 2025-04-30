import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatroomMessage } from './entities/chatroom-message.entity';
import { Chatroom } from './entities/chatroom.entity';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateMessageDto } from './entities/dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChatroomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(ChatroomMessage)
    private readonly messageRepository: Repository<ChatroomMessage>,
    @InjectRepository(Chatroom)
    private readonly roomRepository: Repository<Chatroom>,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    client.emit('joinedRoom', roomId);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    client.emit('leftRoom', roomId);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, createMessageDto: CreateMessageDto) {
    const { roomId, content, senderId, senderName } = createMessageDto;

    // Find or create room
    let room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      room = this.roomRepository.create({ id: roomId, name: `Room-${roomId}` });
      await this.roomRepository.save(room);
    }

    // Create and save message
    const message = this.messageRepository.create({
      content,
      senderId,
      senderName,
      room,
    });
    await this.messageRepository.save(message);

    // Broadcast to room
    this.server.to(roomId).emit('newMessage', message);
  }
}
