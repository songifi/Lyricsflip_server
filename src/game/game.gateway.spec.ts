/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from './game.gateway';
import { INestApplication } from '@nestjs/common';
import { GameService } from './game.service';
import * as socketIoClient from 'socket.io-client';

let app: INestApplication;
let client: socketIoClient.Socket;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    providers: [GameGateway, GameService],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  client = socketIoClient.io('http://localhost:3000');

  it('should join a room', (done) => {
    client.emit('joinRoom', { roomId: 'testRoom', playerName: 'player1' });
    client.on('playerJoined', (data: { playerName: string }) => {
      expect(data.playerName).toBe('player1');
      done();
    });
  });

  afterAll(() => {
    client.disconnect();
  });
});
