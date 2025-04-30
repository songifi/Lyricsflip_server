/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  private rooms: Record<
    string,
    {
      players: { playerName: string; clientId: string }[];
      round: number;
      winner: string | null;
    }
  > = {}; // roomId -> { players: [], round: 1, winner: null }

  addPlayerToRoom(roomId: string, playerName: string, clientId: string) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = { players: [], round: 1, winner: null };
    }
    this.rooms[roomId].players.push({ playerName, clientId });
  }

  startGame(roomId: string) {
    if (!this.rooms[roomId]) {
      throw new Error(`Room ${roomId} does not exist`);
    }
    this.rooms[roomId].round = 1;
    this.rooms[roomId].winner = null;
  }

  checkAnswer(roomId: string, answer: string) {
    // This is where the correct answer logic would go
    const correctAnswer = '42'; // Example answer
    return answer === correctAnswer;
  }

  nextRound(roomId: string) {
    if (!this.rooms[roomId]) {
      throw new Error(`Room ${roomId} does not exist`);
    }
    this.rooms[roomId].round++;
  }
}
