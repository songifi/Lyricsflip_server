import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { ChatroomMessage } from './entities/chatroom-message.entity';
import { Chatroom } from './entities/chatroom.entity';

describe('ChatroomController', () => {
  let app: INestApplication;
  let service: ChatroomService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [ChatroomMessage, Chatroom],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ChatroomMessage, Chatroom]),
      ],
      controllers: [ChatroomController],
      providers: [ChatroomService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = moduleFixture.get<ChatroomService>(ChatroomService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear database before each test
    const messageRepo = moduleFixture.get('ChatroomMessageRepository');
    const roomRepo = moduleFixture.get('ChatRoomRepository');
    await messageRepo.clear();
    await roomRepo.clear();
  });

  describe('GET /chatroom/:roomId/messages', () => {
    it('should return empty array for non-existent room', async () => {
      const response = await request(app.getHttpServer())
        .get('/chatroom/non-existent/messages')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return messages for a room', async () => {
      const roomId = 'test-room';
      await service.getRoomMessages(roomId); // This will create the room

      // Create test messages
      const messageRepo = moduleFixture.get('ChatroomMessageRepository');
      await messageRepo.save([
        {
          content: 'Message 1',
          senderId: 'user1',
          senderName: 'User 1',
          room: { id: roomId },
        },
        {
          content: 'Message 2',
          senderId: 'user2',
          senderName: 'User 2',
          room: { id: roomId },
        },
      ]);

      const response = await request(app.getHttpServer())
        .get(`/chatroom/${roomId}/messages`)
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].content).toBe('Message 1');
      expect(response.body[1].content).toBe('Message 2');
    });
  });
});
