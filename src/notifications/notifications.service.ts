import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { 
  NotificationPayload, 
  LevelUpNotificationPayload, 
  ChallengeCompletedNotificationPayload,
  GameAchievementNotificationPayload 
} from './interfaces/notification.interface';
import { 
  CreateLevelUpNotificationDto, 
  CreateChallengeNotificationDto, 
  CreateAchievementNotificationDto 
} from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private notifications: NotificationPayload[] = [];

  constructor(private eventEmitter: EventEmitter2) {}

  // Event emission methods
  emitLevelUpEvent(dto: CreateLevelUpNotificationDto): void {
    const payload: LevelUpNotificationPayload = {
      userId: dto.userId,
      timestamp: new Date(),
      message: `🎉 You leveled up to ${dto.newTitle}!`,
      newLevel: dto.newLevel,
      newTitle: dto.newTitle,
      xpGained: dto.xpGained,
    };

    this.logger.log(`Emitting level up event for user ${dto.userId}`);
    this.eventEmitter.emit('user.leveled_up', payload);
  }

  emitChallengeCompletedEvent(dto: CreateChallengeNotificationDto): void {
    const payload: ChallengeCompletedNotificationPayload = {
      userId: dto.userId,
      timestamp: new Date(),
      message: `🔥 You completed ${dto.challengeName} with ${dto.streakCount} correct guesses in a row!`,
      challengeName: dto.challengeName,
      streakCount: dto.streakCount,
      reward: dto.reward,
    };

    this.logger.log(`Emitting challenge completed event for user ${dto.userId}`);
    this.eventEmitter.emit('user.completed_challenge', payload);
  }

  emitAchievementEvent(dto: CreateAchievementNotificationDto): void {
    const achievementMessages = {
      perfect_guess: '🎯 Perfect guess!',
      streak: '🔥 Streak achieved!',
      first_win: '🏆 First win!',
      speed_demon: '⚡ Speed demon!',
    };

    const payload: GameAchievementNotificationPayload = {
      userId: dto.userId,
      timestamp: new Date(),
      message: `${achievementMessages[dto.achievementType]} ${dto.achievementValue ? `(${dto.achievementValue})` : ''}`,
      achievementType: dto.achievementType,
      achievementValue: dto.achievementValue,
      reward: dto.reward,
    };

    this.logger.log(`Emitting achievement event for user ${dto.userId}`);
    this.eventEmitter.emit('user.achievement_unlocked', payload);
  }

  // Event listeners
  @OnEvent('user.leveled_up')
  handleLevelUpEvent(payload: LevelUpNotificationPayload): void {
    this.logger.log(`🎉 Level up notification: ${payload.message}`);
    this.storeNotification(payload);
  }

  @OnEvent('user.completed_challenge')
  handleChallengeCompletedEvent(payload: ChallengeCompletedNotificationPayload): void {
    this.logger.log(`🔥 Challenge completed notification: ${payload.message}`);
    this.storeNotification(payload);
  }

  @OnEvent('user.achievement_unlocked')
  handleAchievementEvent(payload: GameAchievementNotificationPayload): void {
    this.logger.log(`🏆 Achievement notification: ${payload.message}`);
    this.storeNotification(payload);
  }

  // Storage methods
  private storeNotification(notification: NotificationPayload): void {
    this.notifications.push(notification);
    this.logger.log(`Stored notification: ${notification.message}`);
  }

  // Retrieval methods
  getNotificationsForUser(userId: string): NotificationPayload[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  getAllNotifications(): NotificationPayload[] {
    return [...this.notifications];
  }

  clearNotifications(): void {
    this.notifications = [];
    this.logger.log('All notifications cleared');
  }

  // Mock data generation
  generateMockNotifications(): void {
    const mockUserId = 'mock-user-123';
    
    // Generate level up notification
    this.emitLevelUpEvent({
      userId: mockUserId,
      newLevel: 5,
      newTitle: 'Gossip Queen',
      xpGained: 100,
    });

    // Generate challenge notification
    this.emitChallengeCompletedEvent({
      userId: mockUserId,
      challengeName: 'Perfect Streak',
      streakCount: 5,
      reward: '50 tokens',
    });

    // Generate achievement notification
    this.emitAchievementEvent({
      userId: mockUserId,
      achievementType: 'perfect_guess',
      achievementValue: 10,
      reward: 'Speed boost',
    });
  }
} 