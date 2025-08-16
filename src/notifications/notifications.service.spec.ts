import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import { 
  CreateLevelUpNotificationDto, 
  CreateChallengeNotificationDto, 
  CreateAchievementNotificationDto 
} from './dto/create-notification.dto';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('emitLevelUpEvent', () => {
    it('should emit level up event with correct payload', () => {
      const dto: CreateLevelUpNotificationDto = {
        userId: 'test-user',
        newLevel: 5,
        newTitle: 'Gossip Queen',
        xpGained: 100,
      };

      service.emitLevelUpEvent(dto);

      expect(eventEmitter.emit).toHaveBeenCalledWith('user.leveled_up', {
        userId: 'test-user',
        timestamp: expect.any(Date),
        message: '🎉 You leveled up to Gossip Queen!',
        newLevel: 5,
        newTitle: 'Gossip Queen',
        xpGained: 100,
      });
    });
  });

  describe('emitChallengeCompletedEvent', () => {
    it('should emit challenge completed event with correct payload', () => {
      const dto: CreateChallengeNotificationDto = {
        userId: 'test-user',
        challengeName: 'Perfect Streak',
        streakCount: 5,
        reward: '50 tokens',
      };

      service.emitChallengeCompletedEvent(dto);

      expect(eventEmitter.emit).toHaveBeenCalledWith('user.completed_challenge', {
        userId: 'test-user',
        timestamp: expect.any(Date),
        message: '🔥 You completed Perfect Streak with 5 correct guesses in a row!',
        challengeName: 'Perfect Streak',
        streakCount: 5,
        reward: '50 tokens',
      });
    });
  });

  describe('emitAchievementEvent', () => {
    it('should emit achievement event with correct payload for perfect_guess', () => {
      const dto: CreateAchievementNotificationDto = {
        userId: 'test-user',
        achievementType: 'perfect_guess',
        achievementValue: 10,
        reward: 'Speed boost',
      };

      service.emitAchievementEvent(dto);

      expect(eventEmitter.emit).toHaveBeenCalledWith('user.achievement_unlocked', {
        userId: 'test-user',
        timestamp: expect.any(Date),
        message: '🎯 Perfect guess! (10)',
        achievementType: 'perfect_guess',
        achievementValue: 10,
        reward: 'Speed boost',
      });
    });

    it('should emit achievement event with correct payload for speed_demon', () => {
      const dto: CreateAchievementNotificationDto = {
        userId: 'test-user',
        achievementType: 'speed_demon',
        reward: 'Permanent boost',
      };

      service.emitAchievementEvent(dto);

      expect(eventEmitter.emit).toHaveBeenCalledWith('user.achievement_unlocked', {
        userId: 'test-user',
        timestamp: expect.any(Date),
        message: '⚡ Speed demon! ',
        achievementType: 'speed_demon',
        achievementValue: undefined,
        reward: 'Permanent boost',
      });
    });
  });

  describe('event handlers', () => {
    it('should handle level up event and store notification', () => {
      const payload = {
        userId: 'test-user',
        timestamp: new Date(),
        message: '🎉 You leveled up to Gossip Queen!',
        newLevel: 5,
        newTitle: 'Gossip Queen',
        xpGained: 100,
      };

      service['handleLevelUpEvent'](payload);

      const notifications = service.getAllNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0]).toEqual(payload);
    });

    it('should handle challenge completed event and store notification', () => {
      const payload = {
        userId: 'test-user',
        timestamp: new Date(),
        message: '🔥 You completed Perfect Streak with 5 correct guesses in a row!',
        challengeName: 'Perfect Streak',
        streakCount: 5,
        reward: '50 tokens',
      };

      service['handleChallengeCompletedEvent'](payload);

      const notifications = service.getAllNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0]).toEqual(payload);
    });

    it('should handle achievement event and store notification', () => {
      const payload = {
        userId: 'test-user',
        timestamp: new Date(),
        message: '🎯 Perfect guess! (10)',
        achievementType: 'perfect_guess' as const,
        achievementValue: 10,
        reward: 'Speed boost',
      };

      service['handleAchievementEvent'](payload);

      const notifications = service.getAllNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0]).toEqual(payload);
    });
  });

  describe('retrieval methods', () => {
    beforeEach(() => {
      // Add some test notifications
      service['notifications'] = [
        {
          userId: 'user1',
          timestamp: new Date(),
          message: 'Test notification 1',
          type: 'generic',
        },
        {
          userId: 'user2',
          timestamp: new Date(),
          message: 'Test notification 2',
          type: 'generic',
        },
        {
          userId: 'user1',
          timestamp: new Date(),
          message: 'Test notification 3',
          type: 'generic',
        },
      ];
    });

    it('should get all notifications', () => {
      const notifications = service.getAllNotifications();
      expect(notifications).toHaveLength(3);
    });

    it('should get notifications for specific user', () => {
      const notifications = service.getNotificationsForUser('user1');
      expect(notifications).toHaveLength(2);
      expect(notifications.every(n => n.userId === 'user1')).toBe(true);
    });

    it('should return empty array for non-existent user', () => {
      const notifications = service.getNotificationsForUser('non-existent');
      expect(notifications).toHaveLength(0);
    });
  });

  describe('clearNotifications', () => {
    it('should clear all notifications', () => {
      // Add a test notification first
      service['notifications'] = [
        {
          userId: 'test-user',
          timestamp: new Date(),
          message: 'Test notification',
          type: 'generic',
        },
      ];

      expect(service.getAllNotifications()).toHaveLength(1);

      service.clearNotifications();

      expect(service.getAllNotifications()).toHaveLength(0);
    });
  });

  describe('generateMockNotifications', () => {
    it('should generate mock notifications', () => {
      service.generateMockNotifications();

      // Verify that the event emission methods were called
      expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
      
      // Check that the correct events were emitted
      expect(eventEmitter.emit).toHaveBeenCalledWith('user.leveled_up', expect.any(Object));
      expect(eventEmitter.emit).toHaveBeenCalledWith('user.completed_challenge', expect.any(Object));
      expect(eventEmitter.emit).toHaveBeenCalledWith('user.achievement_unlocked', expect.any(Object));
    });
  });
}); 