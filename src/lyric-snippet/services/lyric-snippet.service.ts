import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LyricSnippet } from '../entities/lyric-snippet.entity';
import { CreateLyricSnippetDto } from '../dto/create-lyric-snippet.dto';

@Injectable()
export class LyricSnippetService {
  constructor(
    @InjectRepository(LyricSnippet)
    private readonly snippetRepo: Repository<LyricSnippet>,
  ) {}

  async create(dto: CreateLyricSnippetDto): Promise<LyricSnippet> {
    const snippet = this.snippetRepo.create(dto);
    return await this.snippetRepo.save(snippet);
  }

  async update(id: string, dto: Partial<CreateLyricSnippetDto>): Promise<LyricSnippet> {
    const snippet = await this.snippetRepo.findOne({ where: { id } });
    if (!snippet) throw new NotFoundException('Snippet not found');
    Object.assign(snippet, dto);
    return this.snippetRepo.save(snippet);
  }

  findAll(): Promise<LyricSnippet[]> {
    return this.snippetRepo.find();
  }

  findByCategory(category: string): Promise<LyricSnippet[]> {
    return this.snippetRepo.find({ where: { category } });
  }

  async delete(id: string): Promise<void> {
    const res = await this.snippetRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Snippet not found');
  }
}
