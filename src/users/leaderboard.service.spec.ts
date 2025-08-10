import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService - Leaderboard', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUsers = [
    { id: '1', username: 'alice', xp: 100, level: 2 },
    { id: '2', username: 'bob', xp: 80, level: 1 },
    { id: '3', username: 'carol', xp: 60, level: 1 },
  ];

  const repoMock = {
    findAndCount: jest.fn().mockResolvedValue([[...mockUsers], mockUsers.length]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repoMock,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should return leaderboard with rank', async () => {
    const leaderboard = await service.getLeaderboard(3, 0);
    expect(leaderboard).toHaveLength(3);
    expect(leaderboard[0]).toMatchObject({ username: 'alice', xp: 100, rank: 1 });
    expect(leaderboard[1]).toMatchObject({ username: 'bob', xp: 80, rank: 2 });
    expect(leaderboard[2]).toMatchObject({ username: 'carol', xp: 60, rank: 3 });
  });

  it('should throw error for invalid limit', async () => {
    await expect(service.getLeaderboard(0, 0)).rejects.toThrow();
  });
});
