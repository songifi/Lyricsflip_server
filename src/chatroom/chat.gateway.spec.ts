import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomGateway } from './chatroom.gateway';
import { ChatroomMessage } from './entities/chatroom-message.entity';
import { Chatroom } from './entities/chatroom.entity';
import { CreateMessageDto } from './entities/dto/create-message.dto';
import { Repository } from 'typeorm';

describe('ChatroomGateway', () => {
  let app: INestApplication;
  let gateway: ChatroomGateway;
  let messageRepository: Repository<ChatroomMessage>;
  let roomRepository: Repository<Chatroom>;
  let clientSocket: Socket;

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
      providers: [ChatroomGateway],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(0); // 0 means random port
    const httpServer = app.getHttpServer();

    gateway = moduleFixture.get<ChatroomGateway>(ChatroomGateway);
    messageRepository = moduleFixture.get('ChatroomMessageRepository');
    roomRepository = moduleFixture.get('ChatRoomRepository');

    // Initialize WebSocket client
    clientSocket = io(`http://localhost:${httpServer.address().port}/chatroom`, {
      autoConnect: false,
      transports: ['websocket'],
    });
  });

  afterAll(async () => {
    clientSocket.disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await messageRepository.clear();
    await roomRepository.clear();
    clientSocket.connect();
  });

  afterEach(() => {
    clientSocket.disconnect();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('joinRoom', () => {
    it('should allow client to join a room', (done) => {
      const testRoomId = 'test-room';

      clientSocket.emit('joinRoom', testRoomId);
      clientSocket.on('joinedRoom', (roomId) => {
        expect(roomId).toBe(testRoomId);
        done();
      });
    });
  });

  describe('sendMessage', () => {
    it('should create and broadcast a message', (done) => {
      const testRoomId = 'test-room';
      const testMessage: CreateMessageDto = {
        roomId: testRoomId,
        content: 'Hello world',
        senderId: 'user1',
        senderName: 'Test User',
      };

      clientSocket.emit('joinRoom', testRoomId);

      clientSocket.on('newMessage', (message) => {
        expect(message.content).toBe(testMessage.content);
        expect(message.senderId).toBe(testMessage.senderId);
        expect(message.senderName).toBe(testMessage.senderName);
        done();
      });

      setTimeout(() => {
        clientSocket.emit('sendMessage', testMessage);
      }, 100);
    });

    it('should create a new room if not exists', async () => {
      const testRoomId = 'new-room';
      const testMessage: CreateMessageDto = {
        roomId: testRoomId,
        content: 'Hello world',
        senderId: 'user1',
        senderName: 'Test User',
      };

      clientSocket.emit('sendMessage', testMessage);

      // Wait for the message to be processed
      await new Promise((resolve) => setTimeout(resolve, 100));

      const room = await roomRepository.findOne({ where: { id: testRoomId } });
      expect(room).toBeDefined();
    });
  });
});
