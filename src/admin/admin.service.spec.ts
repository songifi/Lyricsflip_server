import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminService } from './admin.service';
import { Song } from './entities/song.entity';
import { Category } from './entities/category.entity';
import { Lyric } from './entities/lyric.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateLyricDto } from './dto/create-lyric.dto';
import { NotFoundException } from '@nestjs/common';

describe('AdminService', () => {
  let service: AdminService;
  let songRepository: Repository<Song>;
  let categoryRepository: Repository<Category>;
  let lyricRepository: Repository<Lyric>;

  const mockSongRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockLyricRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Song),
          useValue: mockSongRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(Lyric),
          useValue: mockLyricRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    songRepository = module.get<Repository<Song>>(getRepositoryToken(Song));
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    lyricRepository = module.get<Repository<Lyric>>(getRepositoryToken(Lyric));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSong', () => {
    it('should create a song successfully', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        artist: 'Test Artist',
        categoryId: 'category-id',
      };

      const mockCategory = { id: 'category-id', name: 'Test Category' };
      const mockSong = { id: 'song-id', ...createSongDto };

      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockSongRepository.create.mockReturnValue(mockSong);
      mockSongRepository.save.mockResolvedValue(mockSong);

      const result = await service.createSong(createSongDto);

      expect(result).toEqual(mockSong);
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: createSongDto.categoryId },
      });
      expect(mockSongRepository.create).toHaveBeenCalledWith({
        ...createSongDto,
        category: mockCategory,
      });
      expect(mockSongRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when category not found', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        artist: 'Test Artist',
        categoryId: 'non-existent-category',
      };

      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.createSong(createSongDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllSongs', () => {
    it('should return an array of songs', async () => {
      const mockSongs = [
        { id: '1', title: 'Song 1' },
        { id: '2', title: 'Song 2' },
      ];

      mockSongRepository.find.mockResolvedValue(mockSongs);

      const result = await service.findAllSongs();

      expect(result).toEqual(mockSongs);
      expect(mockSongRepository.find).toHaveBeenCalledWith({
        relations: ['category', 'lyrics'],
      });
    });
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
      };

      const mockCategory = { id: 'category-id', ...createCategoryDto };

      mockCategoryRepository.create.mockReturnValue(mockCategory);
      mockCategoryRepository.save.mockResolvedValue(mockCategory);

      const result = await service.createCategory(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(
        createCategoryDto,
      );
      expect(mockCategoryRepository.save).toHaveBeenCalled();
    });
  });

  describe('createLyric', () => {
    it('should create a lyric successfully', async () => {
      const createLyricDto: CreateLyricDto = {
        content: 'Test Lyric',
        startTime: 0,
        endTime: 10,
        songId: 'song-id',
      };

      const mockSong = { id: 'song-id', title: 'Test Song' };
      const mockLyric = { id: 'lyric-id', ...createLyricDto };

      mockSongRepository.findOne.mockResolvedValue(mockSong);
      mockLyricRepository.create.mockReturnValue(mockLyric);
      mockLyricRepository.save.mockResolvedValue(mockLyric);

      const result = await service.createLyric(createLyricDto);

      expect(result).toEqual(mockLyric);
      expect(mockSongRepository.findOne).toHaveBeenCalledWith({
        where: { id: createLyricDto.songId },
      });
      expect(mockLyricRepository.create).toHaveBeenCalledWith({
        ...createLyricDto,
        song: mockSong,
      });
      expect(mockLyricRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when song not found', async () => {
      const createLyricDto: CreateLyricDto = {
        content: 'Test Lyric',
        startTime: 0,
        endTime: 10,
        songId: 'non-existent-song',
      };

      mockSongRepository.findOne.mockResolvedValue(null);

      await expect(service.createLyric(createLyricDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
