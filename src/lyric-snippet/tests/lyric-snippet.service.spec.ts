// test/lyric-snippet.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { LyricSnippetService } from '../services/lyric-snippet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LyricSnippet } from '../entities/lyric-snippet.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('LyricSnippetService', () => {
  let service: LyricSnippetService;
  let repo: Repository<LyricSnippet>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LyricSnippetService,
        {
          provide: getRepositoryToken(LyricSnippet),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LyricSnippetService>(LyricSnippetService);
    repo = module.get<Repository<LyricSnippet>>(getRepositoryToken(LyricSnippet));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a lyric snippet', async () => {
    const dto = {
      songName: 'Song A',
      artist: 'Artist A',
      snippetText: 'Lyrics...',
      answer: 'Answer',
      category: 'Pop',
    };
    const created = { id: '1', ...dto };

    mockRepository.create.mockReturnValue(created);
    mockRepository.save.mockResolvedValue(created);

    const result = await service.create(dto);
    expect(result).toEqual(created);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(created);
  });

  it('should return all lyric snippets', async () => {
    const mockSnippets = [
      { id: '1', songName: 'A', artist: 'B', snippetText: 'C', answer: 'D', category: 'Pop' },
    ];
    mockRepository.find.mockResolvedValue(mockSnippets);

    const result = await service.findAll();
    expect(result).toEqual(mockSnippets);
  });

  it('should return snippets by category', async () => {
    const category = 'Pop';
    const snippets = [{ id: '1', category }];
    mockRepository.find.mockResolvedValue(snippets);

    const result = await service.findByCategory(category);
    expect(result).toEqual(snippets);
    expect(mockRepository.find).toHaveBeenCalledWith({ where: { category } });
  });

  it('should update a snippet', async () => {
    const updateDto = { snippetText: 'Updated lyrics' };
    const id = '1';

    mockRepository.update.mockResolvedValue({ affected: 1 });

    const result = await service.update(id, updateDto);
    expect(result).toBeUndefined();
    expect(mockRepository.update).toHaveBeenCalledWith(id, updateDto);
  });

  it('should throw NotFoundException if update affects 0 rows', async () => {
    mockRepository.update.mockResolvedValue({ affected: 0 });

    await expect(service.update('fake-id', {})).rejects.toThrow(NotFoundException);
  });

  it('should delete a snippet', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    await service.remove('1');
    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if delete affects 0 rows', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove('fake-id')).rejects.toThrow(NotFoundException);
  });
});
