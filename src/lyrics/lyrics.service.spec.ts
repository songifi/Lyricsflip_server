import { Test, TestingModule } from '@nestjs/testing';
import { LyricsService } from './lyrics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lyrics } from './entities/lyrics.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Genre } from './entities/lyrics.entity'; // Import Genre enum

const mockLyrics = {
  id: 'uuid-1',
  content: 'Sample lyrics',
  artist: 'Artist',
  songTitle: 'Song',
  genre: Genre.Pop, // Use enum value
  decade: 2010,
  createdBy: { id: 'user-1', role: 'admin' },
  createdAt: new Date(),
};

const mockUser = { id: 'user-1', role: 'admin' } as User;

const lyricsArray = [mockLyrics];

const repoMockFactory = () => ({
  create: jest.fn().mockImplementation(dto => ({ ...dto })),
  save: jest.fn().mockResolvedValue(mockLyrics),
  find: jest.fn().mockResolvedValue(lyricsArray),
  findOne: jest.fn().mockResolvedValue(mockLyrics),
  remove: jest.fn().mockResolvedValue(undefined),
});

describe('LyricsService', () => {
  let service: LyricsService;
  let repo: Repository<Lyrics>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LyricsService,
        { provide: getRepositoryToken(Lyrics), useFactory: repoMockFactory },
      ],
    }).compile();

    service = module.get<LyricsService>(LyricsService);
    repo = module.get<Repository<Lyrics>>(getRepositoryToken(Lyrics));
  });

  it('should create lyrics', async () => {
    const dto = { ...mockLyrics };
    expect(await service.create(dto, mockUser)).toEqual(mockLyrics);
    expect(repo.create).toHaveBeenCalledWith({ ...dto, createdBy: mockUser });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should find all lyrics', async () => {
    expect(await service.findAll({})).toEqual(lyricsArray);
    expect(repo.find).toHaveBeenCalledWith({ where: {} });
  });

  it('should find one lyrics', async () => {
    expect(await service.findOne('uuid-1')).toEqual(mockLyrics);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
  });

  it('should throw NotFoundException if lyrics not found', async () => {
    repo.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
  });

  it('should update lyrics', async () => {
    const updateDto = { content: 'Updated' };
    repo.findOne = jest.fn().mockResolvedValue(mockLyrics);
    repo.save = jest.fn().mockResolvedValue({ ...mockLyrics, ...updateDto });
    expect(await service.update('uuid-1', updateDto, mockUser)).toEqual({ ...mockLyrics, ...updateDto });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if update lyrics not found', async () => {
    repo.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.update('bad-id', {}, mockUser)).rejects.toThrow(NotFoundException);
  });

  it('should remove lyrics', async () => {
    repo.findOne = jest.fn().mockResolvedValue(mockLyrics);
    repo.remove = jest.fn().mockResolvedValue(undefined);
    await expect(service.remove('uuid-1')).resolves.toBeUndefined();
    expect(repo.remove).toHaveBeenCalledWith(mockLyrics);
  });

  it('should throw NotFoundException if remove lyrics not found', async () => {
    repo.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
  });
});
