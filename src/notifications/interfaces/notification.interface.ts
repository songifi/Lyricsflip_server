export interface BaseNotificationPayload {
  userId: string;
  timestamp: Date;
  message: string;
}

export interface LevelUpNotificationPayload extends BaseNotificationPayload {
  newLevel: number;
  newTitle: string;
  xpGained: number;
}

export interface ChallengeCompletedNotificationPayload extends BaseNotificationPayload {
  challengeName: string;
  streakCount: number;
  reward?: string;
}

export interface GameAchievementNotificationPayload extends BaseNotificationPayload {
  achievementType: 'perfect_guess' | 'streak' | 'first_win' | 'speed_demon';
  achievementValue?: number;
  reward?: string;
}

export interface GenericNotificationPayload extends BaseNotificationPayload {
  type: 'generic';
}

export type NotificationPayload = 
  | LevelUpNotificationPayload 
  | ChallengeCompletedNotificationPayload 
  | GameAchievementNotificationPayload
  | GenericNotificationPayload; 