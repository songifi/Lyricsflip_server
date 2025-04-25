/* eslint-disable prettier/prettier */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { JoinRoomDto } from './dto/join-room.dto';
import { StartGameDto } from './dto/start-game.dto';
import { SendAnswerDto } from './dto/send-answer.dto';
import { NextRoundDto } from './dto/next-round.dto';
import { AnnounceWinnerDto } from './dto/announce-winner.dto';

@WebSocketGateway({ cors: true }) // Enabling CORS for the client-side to connect
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Handle client disconnection logic (e.g., remove from game room)
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, playerName } = data;
    this.gameService.addPlayerToRoom(roomId, playerName, client.id);
    client.join(roomId);
    this.server.to(roomId).emit('playerJoined', { playerName });
  }

  @SubscribeMessage('startGame')
  handleStartGame(@MessageBody() data: StartGameDto) {
    const { roomId } = data;
    this.gameService.startGame(roomId);
    this.server
      .to(roomId)
      .emit('gameStarted', { message: 'The game has started!' });
  }

  @SubscribeMessage('sendAnswer')
  handleSendAnswer(
    @MessageBody() data: SendAnswerDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, answer } = data;
    const isCorrect = this.gameService.checkAnswer(roomId, answer);
    this.server
      .to(roomId)
      .emit('answerResult', { playerId: client.id, isCorrect });
  }

  @SubscribeMessage('nextRound')
  handleNextRound(@MessageBody() data: NextRoundDto) {
    const { roomId } = data;
    this.gameService.nextRound(roomId);
    this.server
      .to(roomId)
      .emit('roundStarted', { message: 'Next round has started!' });
  }

  @SubscribeMessage('announceWinner')
  handleAnnounceWinner(@MessageBody() data: AnnounceWinnerDto) {
    const { roomId, winnerName } = data;
    this.server.to(roomId).emit('winnerAnnounced', { winnerName });
  }
}
