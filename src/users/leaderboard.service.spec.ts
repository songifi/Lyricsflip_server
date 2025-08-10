
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('UsersService - Leaderboard', () => {
  let service: UsersService;
  let repo: Repository<User>;
  let cache: any;

  const mockUsers = [
    { id: '1', username: 'alice', xp: 100, level: 2 },
    { id: '2', username: 'bob', xp: 80, level: 1 },
    { id: '3', username: 'carol', xp: 60, level: 1 },
  ];

  const repoMock = {
    findAndCount: jest.fn().mockResolvedValue([[...mockUsers], mockUsers.length]),
  };
  const cacheMock = {
    get: jest.fn().mockResolvedValue(undefined),
    set: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repoMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheMock,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    cache = module.get(CACHE_MANAGER);
    cacheMock.get.mockClear();
    cacheMock.set.mockClear();
  });

  it('should return leaderboard with rank and meta', async () => {
    const leaderboard = await service.getLeaderboard(3, 0, 'xp', 'DESC');
    expect(leaderboard.data).toHaveLength(3);
    expect(leaderboard.data[0]).toMatchObject({ username: 'alice', xp: 100, rank: 1 });
    expect(leaderboard.meta).toMatchObject({ total: 3, limit: 3, offset: 0, sort: 'xp', order: 'DESC' });
    expect(cacheMock.set).toHaveBeenCalled();
  });

  it('should throw error for invalid limit', async () => {
    await expect(service.getLeaderboard(0, 0)).rejects.toThrow();
  });
});
