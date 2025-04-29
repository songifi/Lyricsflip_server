export enum PlayerSkillLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
    EXPERT = 'EXPERT',
  }
  
  export enum GameCategory {
    ACTION = 'ACTION',
    STRATEGY = 'STRATEGY',
    PUZZLE = 'PUZZLE',
    RACING = 'RACING',
    SPORTS = 'SPORTS',
  }
  
  export enum GameDifficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
  }
  
  export interface MatchmakingPreferences {
    categories?: GameCategory[];
    difficulty?: GameDifficulty;
    withFriendIds?: string[];
    maxWaitTimeSeconds?: number;
  }
  
  export interface PlayerMatchRequest {
    playerId: string;
    skillLevel: PlayerSkillLevel;
    preferences: MatchmakingPreferences;
    requestedAt: Date;
  }
  
  export interface GameSession {
    id: string;
    players: string[];
    category: GameCategory;
    difficulty: GameDifficulty;
    createdAt: Date;
    status: GameSessionStatus;
  }
  
  export enum GameSessionStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
  }
  
  export interface MatchmakingResult {
    success: boolean;
    message: string;
    estimatedWaitTime?: number;
    gameSession?: GameSession;
  }
  