import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { 
  CreateLevelUpNotificationDto, 
  CreateChallengeNotificationDto, 
  CreateAchievementNotificationDto 
} from './dto/create-notification.dto';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            emitLevelUpEvent: jest.fn(),
            emitChallengeCompletedEvent: jest.fn(),
            emitAchievementEvent: jest.fn(),
            generateMockNotifications: jest.fn(),
            getAllNotifications: jest.fn(),
            getNotificationsForUser: jest.fn(),
            clearNotifications: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('emitMockLevelUp', () => {
    it('should emit level up notification', async () => {
      const dto: CreateLevelUpNotificationDto = {
        userId: 'test-user',
        newLevel: 5,
        newTitle: 'Gossip Queen',
        xpGained: 100,
      };

      const result = await controller.emitMockLevelUp(dto);

      expect(service.emitLevelUpEvent).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'Level up notification emitted successfully' });
    });
  });

  describe('emitMockChallengeCompleted', () => {
    it('should emit challenge completed notification', async () => {
      const dto: CreateChallengeNotificationDto = {
        userId: 'test-user',
        challengeName: 'Perfect Streak',
        streakCount: 5,
        reward: '50 tokens',
      };

      const result = await controller.emitMockChallengeCompleted(dto);

      expect(service.emitChallengeCompletedEvent).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'Challenge completed notification emitted successfully' });
    });
  });

  describe('emitMockAchievement', () => {
    it('should emit achievement notification', async () => {
      const dto: CreateAchievementNotificationDto = {
        userId: 'test-user',
        achievementType: 'perfect_guess',
        achievementValue: 10,
        reward: 'Speed boost',
      };

      const result = await controller.emitMockAchievement(dto);

      expect(service.emitAchievementEvent).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'Achievement notification emitted successfully' });
    });
  });

  describe('generateMockData', () => {
    it('should generate mock notifications', async () => {
      const result = await controller.generateMockData();

      expect(service.generateMockNotifications).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Mock notifications generated successfully' });
    });
  });

  describe('getAllNotifications', () => {
    it('should return all notifications', async () => {
      const mockNotifications = [
        { userId: 'user1', message: 'Test 1', timestamp: new Date(), type: 'generic' as const },
        { userId: 'user2', message: 'Test 2', timestamp: new Date(), type: 'generic' as const },
      ];

      jest.spyOn(service, 'getAllNotifications').mockReturnValue(mockNotifications);

      const result = await controller.getAllNotifications();

      expect(service.getAllNotifications).toHaveBeenCalled();
      expect(result).toEqual({ notifications: mockNotifications });
    });
  });

  describe('getUserNotifications', () => {
    it('should return notifications for specific user', async () => {
      const userId = 'test-user';
      const mockNotifications = [
        { userId, message: 'Test 1', timestamp: new Date(), type: 'generic' as const },
        { userId, message: 'Test 2', timestamp: new Date(), type: 'generic' as const },
      ];

      jest.spyOn(service, 'getNotificationsForUser').mockReturnValue(mockNotifications);

      const result = await controller.getUserNotifications(userId);

      expect(service.getNotificationsForUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ notifications: mockNotifications });
    });
  });

  describe('clearNotifications', () => {
    it('should clear all notifications', async () => {
      const result = await controller.clearNotifications();

      expect(service.clearNotifications).toHaveBeenCalled();
      expect(result).toEqual({ message: 'All notifications cleared' });
    });
  });

  describe('testLevelUp', () => {
    it('should emit test level up notification', async () => {
      const result = await controller.testLevelUp();

      expect(service.emitLevelUpEvent).toHaveBeenCalledWith({
        userId: 'test-user-123',
        newLevel: 10,
        newTitle: 'Lyric Master',
        xpGained: 250,
      });
      expect(result).toEqual({ message: 'Test level up notification emitted' });
    });
  });

  describe('testChallenge', () => {
    it('should emit test challenge notification', async () => {
      const result = await controller.testChallenge();

      expect(service.emitChallengeCompletedEvent).toHaveBeenCalledWith({
        userId: 'test-user-123',
        challengeName: 'Speed Demon',
        streakCount: 10,
        reward: '100 tokens + Speed boost',
      });
      expect(result).toEqual({ message: 'Test challenge notification emitted' });
    });
  });

  describe('testAchievement', () => {
    it('should emit test achievement notification', async () => {
      const result = await controller.testAchievement();

      expect(service.emitAchievementEvent).toHaveBeenCalledWith({
        userId: 'test-user-123',
        achievementType: 'speed_demon',
        achievementValue: 5,
        reward: 'Permanent speed boost',
      });
      expect(result).toEqual({ message: 'Test achievement notification emitted' });
    });
  });
}); 