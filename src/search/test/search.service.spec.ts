import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchService } from '../search.service';
import { User } from '../../users/entities/user.entity';
import { Song } from '../../songs/entities/song.entity';
import { Session } from '../../sessions/entities/session.entity';
import { SearchType } from '../dto/search-query.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T>(): MockRepository<T> => ({
  findAndCount: jest.fn(),
});

describe('SearchService', () => {
  let service: SearchService;
  let userRepository: MockRepository<User>;
  let songRepository: MockRepository<Song>;
  let sessionRepository: MockRepository<Session>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
        {
          provide: getRepositoryToken(Song),
          useValue: createMockRepository<Song>(),
        },
        {
          provide: getRepositoryToken(Session),
          useValue: createMockRepository<Session>(),
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    userRepository = module.get(getRepositoryToken(User));
    songRepository = module.get(getRepositoryToken(Song));
    sessionRepository = module.get(getRepositoryToken(Session));
  });

  describe('searchUsers', () => {
    it('should search users by username', async () => {
      const mockUsers = [{ id: 1, username: 'testuser' }];
      userRepository.findAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await service.search({
        type: SearchType.USER,
        query: 'test',
        page: 1,
        limit: 10,
      });

      expect(userRepository.findAndCount).toHaveBeenCalledWith({
        where: { username: expect.any(Object) },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        items: mockUsers,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('searchSongs', () => {
    it('should search songs by title or artist', async () => {
      const mockSongs = [{ id: 1, title: 'Test Song', artist: 'Test Artist' }];
      songRepository.findAndCount.mockResolvedValue([mockSongs, 1]);

      const result = await service.search({
        type: SearchType.SONG,
        query: 'test',
        page: 1,
        limit: 10,
      });

      expect(songRepository.findAndCount).toHaveBeenCalledWith({
        where: expect.any(Array),
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        items: mockSongs,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('searchSessions', () => {
    it('should search sessions by status', async () => {
      const mockSessions = [{ id: 1, name: 'Test Session', status: 'active' }];
      sessionRepository.findAndCount.mockResolvedValue([mockSessions, 1]);

      const result = await service.search({
        type: SearchType.SESSION,
        status: 'active',
        page: 1,
        limit: 10,
      });

      expect(sessionRepository.findAndCount).toHaveBeenCalledWith({
        where: { status: 'active' },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        items: mockSessions,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });
});