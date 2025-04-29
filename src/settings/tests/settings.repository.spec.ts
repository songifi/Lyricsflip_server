import { Test, TestingModule } from '@nestjs/testing';
import { SettingsRepository } from '../settings.repository';
import { Repository } from 'typeorm';
import { Settings, NotificationType } from '../entities/settings.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SettingsRepository', () => {
  let repository: SettingsRepository;
  let typeOrmRepository: Repository<Settings>;

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
        SettingsRepository,
        {
          provide: getRepositoryToken(Settings),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<SettingsRepository>(SettingsRepository);
    typeOrmRepository = module.get<Repository<Settings>>(getRepositoryToken(Settings));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should find settings by user id', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(mockSettings as Settings);

      const result = await repository.findByUserId('user-uuid');
      expect(result).toEqual(mockSettings);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-uuid' },
      });
    });
  });

  describe('create', () => {
    it('should create new settings', async () => {
      const createSettingsDto = {
        preferredCategories: ['sports', 'science'],
        notificationPreferences: NotificationType.EMAIL,
      };

      jest.spyOn(typeOrmRepository, 'create').mockReturnValue({
        ...mockSettings,
        ...createSettingsDto,
      } as Settings);

      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue({
        ...mockSettings,
        ...createSettingsDto,
      } as Settings);

      const result = await repository.create('user-uuid', createSettingsDto);
      
      expect(result).toEqual({
        ...mockSettings,
        ...createSettingsDto,
      });
      
      expect(typeOrmRepository.create).toHaveBeenCalledWith({
        userId: 'user-uuid',
        ...createSettingsDto,
      });
      
      expect(typeOrmRepository.save).toHaveBeenCalled();
    });
  });