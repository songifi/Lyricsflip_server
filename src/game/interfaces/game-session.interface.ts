import { SessionStats } from './game-response.interface';

export interface GameSession {
  sessionId: string;
  playerId?: string;
  startTime: Date;
  lastActivity: Date;
  shownLyricIds: number[];
  stats: SessionStats;
  gameMode: 'artist' | 'songTitle' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
}
