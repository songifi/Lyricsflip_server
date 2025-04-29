import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from '../settings.service';
import { SettingsRepository } from '../settings.repository';
import { NotFoundException } from '@nestjs/common';
import { NotificationType } from '../entities/settings.entity';

describe('SettingsService', () => {
  let service: SettingsService;
  let repository: SettingsRepository;

  const mockSettingsRepository = {
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockSettings = {
    id: 'settings-uuid',
    userId: 'user-uuid',
    preferredCategories: ['sports', 'science'],
    notificationPreferences: NotificationType.ALL,
    soundEnabled: true,
    language: 'en',
    itemsPerPage: 10,
    autoPlayEnabled: true,
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: SettingsRepository,
          useValue: mockSettingsRepository,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    repository = module.get<SettingsRepository>(SettingsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSettingsByUserId', () => {
    it('should return settings for a user', async () => {
      mockSettingsRepository.findByUserId.mockResolvedValue(mockSettings);

      const result = await service.getSettingsByUserId('user-uuid');
      expect(result).toEqual(mockSettings);
      expect(mockSettingsRepository.findByUserId).toHaveBeenCalledWith('user-uuid');
    });

    it('should throw NotFoundException if settings not found', async () => {
      mockSettingsRepository.findByUserId.mockResolvedValue(null);

      await expect(service.getSettingsByUserId('user-uuid')).rejects.toThrow(
        new NotFoundException('Settings for user with ID "user-uuid" not found'),
      );
    });
  });

  describe('createSettings', () => {
    it('should create and return settings', async () => {
      const createSettingsDto = {
        preferredCategories: ['sports', 'science'],
        notificationPreferences: NotificationType.ALL,
      };

      mockSettingsRepository.create.mockResolvedValue({
        ...mockSettings,
        ...createSettingsDto,
      });

      const result = await service.createSettings('user-uuid', createSettingsDto);
      
      expect(result).toEqual({
        ...mockSettings,
        ...createSettingsDto,
      });
      
      expect(mockSettingsRepository.create).toHaveBeenCalledWith(
        'user-uuid',
        createSettingsDto,
      );
    });
  });

  describe('updateSettings', () => {
    it('should update and return settings', async () => {
      const updateSettingsDto = {
        preferredCategories: ['history', 'art'],
        soundEnabled: false,
      };

      const updatedSettings = {
        ...mockSettings,
        ...updateSettingsDto,
      };

      mockSettingsRepository.update.mockResolvedValue(updatedSettings);

      const result = await service.updateSettings('user-uuid', updateSettingsDto);
      
      expect(result).toEqual(updatedSettings);
      expect(mockSettingsRepository.update).toHaveBeenCalledWith(
        'user-uuid',
        updateSettingsDto,
      );
    });
  });

  describe('getOrCreateSettings', () => {
    it('should return existing settings if found', async () => {
      mockSettingsRepository.findByUserId.mockResolvedValue(mockSettings);

      const result = await service.getOrCreateSettings('user-uuid');
      
      expect(result).toEqual(mockSettings);
      expect(mockSettingsRepository.findByUserId).toHaveBeenCalledWith('user-uuid');
      expect(mockSettingsRepository.create).not.toHaveBeenCalled();
    });

    it('should create new settings if not found', async () => {
      mockSettingsRepository.findByUserId.mockResolvedValue(null);
      mockSettingsRepository.create.mockResolvedValue(mockSettings);

      const result = await service.getOrCreateSettings('user-uuid');
      
      expect(result).toEqual(mockSettings);
      expect(mockSettingsRepository.findByUserId).toHaveBeenCalledWith('user-uuid');
      expect(mockSettingsRepository.create).toHaveBeenCalledWith('user-uuid', {});
    });
  });

  describe('deleteSettings', () => {
    it('should delete settings for a user', async () => {
      mockSettingsRepository.delete.mockResolvedValue(undefined);

      await service.deleteSettings('user-uuid');
      expect(mockSettingsRepository.delete).toHaveBeenCalledWith('user-uuid');
    });
  });

  describe('filterCategoriesByUserPreferences', () => {
    it('should return all categories if no preferences set', async () => {
      const settingsWithNoPreferences = {
        ...mockSettings,
        preferredCategories: [],
      };
      
      mockSettingsRepository.findByUserId.mockResolvedValue(settingsWithNoPreferences);
      
      const allCategories = ['sports', 'history', 'science', 'art', 'entertainment'];
      const result = await service.filterCategoriesByUserPreferences('user-uuid', allCategories);
      
      expect(result).toEqual(allCategories);
    });

    it('should filter categories based on user preferences', async () => {
      mockSettingsRepository.findByUserId.mockResolvedValue(mockSettings);
      
      const allCategories = ['sports', 'history', 'science', 'art', 'entertainment'];
      const result = await service.filterCategoriesByUserPreferences('user-uuid', allCategories);
      
      expect(result).toEqual(['sports', 'science']);
    });

    it('should create default settings and return all categories if no settings found', async () => {
      mockSettingsRepository.findByUserId.mockResolvedValue(null);
      mockSettingsRepository.create.mockResolvedValue({
        ...mockSettings,
        preferredCategories: [],
      });
      
      const allCategories = ['sports', 'history', 'science', 'art', 'entertainment'];
      const result = await service.filterCategoriesByUserPreferences('user-uuid', allCategories);
      
      expect(result).toEqual(allCategories);
      expect(mockSettingsRepository.create).toHaveBeenCalledWith('user-uuid', {});
    });
  });
});