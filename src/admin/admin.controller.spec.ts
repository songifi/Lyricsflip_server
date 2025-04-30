import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateSongDto } from './dto/create-song.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateLyricDto } from './dto/create-lyric.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockAdminService = {
    createSong: jest.fn(),
    findAllSongs: jest.fn(),
    findSongById: jest.fn(),
    updateSong: jest.fn(),
    removeSong: jest.fn(),
    createCategory: jest.fn(),
    findAllCategories: jest.fn(),
    findCategoryById: jest.fn(),
    updateCategory: jest.fn(),
    removeCategory: jest.fn(),
    createLyric: jest.fn(),
    findAllLyrics: jest.fn(),
    findLyricById: jest.fn(),
    updateLyric: jest.fn(),
    removeLyric: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSong', () => {
    it('should create a song', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        artist: 'Test Artist',
        categoryId: 'category-id',
      };

      const expectedResult = { id: 'song-id', ...createSongDto };
      mockAdminService.createSong.mockResolvedValue(expectedResult);

      const result = await controller.createSong(createSongDto);

      expect(result).toEqual(expectedResult);
      expect(service.createSong).toHaveBeenCalledWith(createSongDto);
    });
  });

  describe('findAllSongs', () => {
    it('should return an array of songs', async () => {
      const expectedResult = [
        { id: '1', title: 'Song 1' },
        { id: '2', title: 'Song 2' },
      ];

      mockAdminService.findAllSongs.mockResolvedValue(expectedResult);

      const result = await controller.findAllSongs();

      expect(result).toEqual(expectedResult);
      expect(service.findAllSongs).toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
      };

      const expectedResult = { id: 'category-id', ...createCategoryDto };
      mockAdminService.createCategory.mockResolvedValue(expectedResult);

      const result = await controller.createCategory(createCategoryDto);

      expect(result).toEqual(expectedResult);
      expect(service.createCategory).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('createLyric', () => {
    it('should create a lyric', async () => {
      const createLyricDto: CreateLyricDto = {
        content: 'Test Lyric',
        startTime: 0,
        endTime: 10,
        songId: 'song-id',
      };

      const expectedResult = { id: 'lyric-id', ...createLyricDto };
      mockAdminService.createLyric.mockResolvedValue(expectedResult);

      const result = await controller.createLyric(createLyricDto);

      expect(result).toEqual(expectedResult);
      expect(service.createLyric).toHaveBeenCalledWith(createLyricDto);
    });
  });
});
