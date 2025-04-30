// src/game-session/dto/game-session-response.dto.ts
export class GameSessionResponseDto {
    id: string;
    players: any[];
    createdAt: Date;
    currentRound: number;
    winner: any;
    status: GameSessionStatus;
    maxPlayers: number;
    isPrivate: boolean;
    inviteCode?: string;
  }

  