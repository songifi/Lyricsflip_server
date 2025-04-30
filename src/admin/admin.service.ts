import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { Category } from './entities/category.entity';
import { Lyric } from './entities/lyric.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateLyricDto } from './dto/create-lyric.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Lyric)
    private lyricRepository: Repository<Lyric>,
  ) {}

  // Song CRUD operations
  async createSong(createSongDto: CreateSongDto): Promise<Song> {
    const category = await this.categoryRepository.findOne({
      where: { id: createSongDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const song = this.songRepository.create({
      ...createSongDto,
      category,
    });
    return this.songRepository.save(song);
  }

  async findAllSongs(): Promise<Song[]> {
    return this.songRepository.find({
      relations: ['category', 'lyrics'],
    });
  }

  async findSongById(id: string): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: { id },
      relations: ['category', 'lyrics'],
    });
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    return song;
  }

  async updateSong(
    id: string,
    updateSongDto: Partial<CreateSongDto>,
  ): Promise<Song> {
    const song = await this.findSongById(id);
    if (updateSongDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateSongDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      song.category = category;
    }
    Object.assign(song, updateSongDto);
    return this.songRepository.save(song);
  }

  async removeSong(id: string): Promise<void> {
    const song = await this.findSongById(id);
    await this.songRepository.remove(song);
  }

  // Category CRUD operations
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['songs'],
    });
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['songs'],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: Partial<CreateCategoryDto>,
  ): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoryRepository.remove(category);
  }

  // Lyric CRUD operations
  async createLyric(createLyricDto: CreateLyricDto): Promise<Lyric> {
    const song = await this.songRepository.findOne({
      where: { id: createLyricDto.songId },
    });
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    const lyric = this.lyricRepository.create({
      ...createLyricDto,
      song,
    });
    return this.lyricRepository.save(lyric);
  }

  async findAllLyrics(): Promise<Lyric[]> {
    return this.lyricRepository.find({
      relations: ['song'],
    });
  }

  async findLyricById(id: string): Promise<Lyric> {
    const lyric = await this.lyricRepository.findOne({
      where: { id },
      relations: ['song'],
    });
    if (!lyric) {
      throw new NotFoundException('Lyric not found');
    }
    return lyric;
  }

  async updateLyric(
    id: string,
    updateLyricDto: Partial<CreateLyricDto>,
  ): Promise<Lyric> {
    const lyric = await this.findLyricById(id);
    if (updateLyricDto.songId) {
      const song = await this.songRepository.findOne({
        where: { id: updateLyricDto.songId },
      });
      if (!song) {
        throw new NotFoundException('Song not found');
      }
      lyric.song = song;
    }
    Object.assign(lyric, updateLyricDto);
    return this.lyricRepository.save(lyric);
  }

  async removeLyric(id: string): Promise<void> {
    const lyric = await this.findLyricById(id);
    await this.lyricRepository.remove(lyric);
  }
}
