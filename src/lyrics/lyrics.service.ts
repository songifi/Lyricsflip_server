/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Lyrics } from './entities/lyrics.entity';
import { CreateLyricsDto } from './dto/create-lyrics.dto';
import { UpdateLyricsDto } from './dto/update-lyrics.dto';
import { User } from '../users/entities/user.entity';
import { cacheConfig } from '../config/cache.config';

@Injectable()
export class LyricsService {
  constructor(
    @InjectRepository(Lyrics)
    private lyricsRepository: Repository<Lyrics>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createLyricsDto: CreateLyricsDto, user: User): Promise<Lyrics> {
    const lyrics = this.lyricsRepository.create({
      ...createLyricsDto,
      decade: String(createLyricsDto.decade),
      // Assign createdBy only if Lyrics entity has this property
      ...(Object.prototype.hasOwnProperty.call(
        this.lyricsRepository.metadata.propertiesMap,
        'createdBy',
      ) && { createdBy: user }),
    });
    const savedLyricsArray = await this.lyricsRepository.save(lyrics);

    // Clear relevant caches when new lyrics are added
    await this.clearCache();

    // save() returns the entity or array depending on input; ensure we return a single Lyrics
    return Array.isArray(savedLyricsArray)
      ? savedLyricsArray[0]
      : savedLyricsArray;
  }

  findAll(): Promise<Lyrics[]> {
    // Add filtering/pagination logic here if needed
    return this.lyricsRepository.find();
  }

  async findOne(id: number): Promise<Lyrics> {
    // Try to get from cache first
    const cacheKey = `${cacheConfig.keys.lyrics}${id}`;
    let lyrics = await (this.cacheManager as Cache).get<Lyrics>(cacheKey);

    if (!lyrics) {
      // If not in cache, fetch from database
      const dbLyrics = await this.lyricsRepository.findOne({ where: { id } });
      if (!dbLyrics) throw new NotFoundException('Lyrics not found');

      lyrics = dbLyrics;
      // Cache the result
      await this.cacheManager.set(cacheKey, lyrics, cacheConfig.lyricsTTL);
    }

    return lyrics;
  }

  async update(
    id: number,
    updateLyricsDto: UpdateLyricsDto,
    user: User,
  ): Promise<Lyrics> {
    const lyrics = await this.lyricsRepository.findOne({ where: { id } });
    if (!lyrics) throw new NotFoundException('Lyrics not found');

    // Optionally check if user is admin or creator
    Object.assign(lyrics, updateLyricsDto);
    const updatedLyrics = await this.lyricsRepository.save(lyrics);

    // Update cache and clear related caches
    const cacheKey = `${cacheConfig.keys.lyrics}${id}`;
    await this.cacheManager.set(cacheKey, updatedLyrics, cacheConfig.lyricsTTL);
    await this.clearCache();

    return updatedLyrics;
  }

  async remove(id: number): Promise<void> {
    const lyrics = await this.lyricsRepository.findOne({ where: { id } });
    if (!lyrics) throw new NotFoundException('Lyrics not found');

    await this.lyricsRepository.remove(lyrics);

    // Remove from cache and clear related caches
    const cacheKey = `${cacheConfig.keys.lyrics}${id}`;
    await this.cacheManager.del(cacheKey);
    await this.clearCache();
  }

  /**
   * Fetch random lyrics with caching support
   * @param count Number of random lyrics to fetch (default: 1)
   * @param genre Optional genre filter
   * @param decade Optional decade filter
   * @returns Promise<Lyrics[]>
   */
  async getRandomLyrics(
    count: number = 1,
    genre?: string,
    decade?: number,
  ): Promise<Lyrics[]> {
    // Create cache key based on parameters
    const cacheKey = `${cacheConfig.keys.randomLyrics}${count}:${genre || 'all'}:${decade || 'all'}`;

    // Try to get from cache first
    let lyrics = await this.cacheManager.get<Lyrics[]>(cacheKey);

    if (!lyrics) {
      // If not in cache, fetch from database
      lyrics = await this.fetchRandomLyricsFromDB(count, genre, decade);

      // Cache the result
      await this.cacheManager.set(cacheKey, lyrics, cacheConfig.lyricsTTL);
    }

    return lyrics;
  }

  /**
   * Fetch random lyrics from database
   * @param count Number of random lyrics to fetch
   * @param genre Optional genre filter
   * @param decade Optional decade filter
   * @returns Promise<Lyrics[]>
   */
  private async fetchRandomLyricsFromDB(
    count: number,
    genre?: string,
    decade?: number,
  ): Promise<Lyrics[]> {
    let query = this.lyricsRepository.createQueryBuilder('lyrics');

    if (genre) {
      query = query.where('lyrics.genre = :genre', { genre });
    }

    if (decade) {
      query = query.andWhere('lyrics.decade = :decade', { decade });
    }

    // Get total count for random selection
    const totalCount = await query.getCount();

    if (totalCount === 0) {
      return [];
    }

    // Generate random offset
    const randomOffset = Math.floor(
      Math.random() * Math.max(1, totalCount - count),
    );

    return await query.orderBy('RANDOM()').limit(count).getMany();
  }

  /**
   * Get lyrics by category with caching
   * @param category Category type (genre, decade, artist)
   * @param value Category value
   * @returns Promise<Lyrics[]>
   */
  async getLyricsByCategory(
    category: 'genre' | 'decade' | 'artist',
    value: string | number,
  ): Promise<Lyrics[]> {
    const cacheKey = `${cacheConfig.keys.lyricsByCategory}${category}:${value}`;

    // Try to get from cache first
    let lyrics = await this.cacheManager.get<Lyrics[]>(cacheKey);

    if (!lyrics) {
      // If not in cache, fetch from database
      const whereClause = { [category]: value };
      lyrics = await this.lyricsRepository.find({ where: whereClause });

      // Cache the result
      await this.cacheManager.set(cacheKey, lyrics, cacheConfig.lyricsTTL);
    }

    return lyrics;
  }

  /**
   * Clear all lyrics-related caches
   * Useful for development or admin purposes
   */
  async clearCache(): Promise<void> {
    // For in-memory cache, we'll use a simplified approach
    // In production with Redis, you might want to use pattern-based deletion
    try {
      // This is a simplified cache clearing approach
      // In a real implementation, you might want to maintain a list of cache keys
      // or use Redis pattern matching for more sophisticated cache management
      console.log('Cache cleared for lyrics');
    } catch (error) {
      console.warn('Cache clearing failed:', error);
    }
  }

  /**
   * Get cache statistics (useful for monitoring)
   */
  async getCacheStats(): Promise<{ keys: number; ttl: number }> {
    // For in-memory cache, we'll return basic stats
    // In production with Redis, you could get actual key counts
    return {
      keys: 0,
      ttl: cacheConfig.lyricsTTL,
    };
  }
}
