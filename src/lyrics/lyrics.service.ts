import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lyrics } from './entities/lyrics.entity';
import { CreateLyricsDto } from './dto/create-lyrics.dto';
import { UpdateLyricsDto } from './dto/update-lyrics.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LyricsService {
  constructor(
    @InjectRepository(Lyrics)
    private lyricsRepository: Repository<Lyrics>,
  ) {}

  async create(createLyricsDto: CreateLyricsDto, user: User): Promise<Lyrics> {
    const lyrics = this.lyricsRepository.create({ ...createLyricsDto, createdBy: user });
    return this.lyricsRepository.save(lyrics);
  }

  findAll(filter?: any): Promise<Lyrics[]> {
    // Add filtering/pagination logic here if needed
    return this.lyricsRepository.find({ where: filter });
  }

  async findOne(id: string): Promise<Lyrics> {
    const lyrics = await this.lyricsRepository.findOne({ where: { id } });
    if (!lyrics) throw new NotFoundException('Lyrics not found');
    return lyrics;
  }

  async update(id: string, updateLyricsDto: UpdateLyricsDto, user: User): Promise<Lyrics> {
    const lyrics = await this.lyricsRepository.findOne({ where: { id } });
    if (!lyrics) throw new NotFoundException('Lyrics not found');
    // Optionally check if user is admin or creator
    Object.assign(lyrics, updateLyricsDto);
    return this.lyricsRepository.save(lyrics);
  }

  async remove(id: string): Promise<void> {
    const lyrics = await this.lyricsRepository.findOne({ where: { id } });
    if (!lyrics) throw new NotFoundException('Lyrics not found');
    await this.lyricsRepository.remove(lyrics);
  }
}
