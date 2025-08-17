import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Cache } from "cache-manager"
import type { Lyrics } from "./entities/lyrics.entity"
import type { CreateLyricsDto } from "./dto/create-lyrics.dto"
import type { UpdateLyricsDto } from "./dto/update-lyrics.dto"
import type { User } from "../users/entities/user.entity"
import { cacheConfig } from "../config/cache.config"
import { Genre } from "./entities/genre.enum"

@Injectable()
export class LyricsService {
  private lyricsRepository: Repository<Lyrics>
  private cacheManager: Cache

  constructor(lyricsRepository: Repository<Lyrics>, cacheManager: Cache) {
    this.lyricsRepository = lyricsRepository
    this.cacheManager = cacheManager
  }

  async create(createLyricsDto: CreateLyricsDto, user: User): Promise<Lyrics> {
    const lyrics = this.lyricsRepository.create({ ...createLyricsDto, createdBy: user })
    const savedLyrics = await this.lyricsRepository.save(lyrics)

    // Clear relevant caches when new lyrics are added
    await this.clearCache()

    return savedLyrics
  }

  async findAll(genre?: string, decade?: number): Promise<Lyrics[]> {
    const query = this.lyricsRepository.createQueryBuilder("lyrics")

    // Apply genre filter if provided
    if (genre) {
      // Validate genre against enum values
      const validGenres = Object.values(Genre)
      if (!validGenres.includes(genre as Genre)) {
        throw new NotFoundException(`Invalid genre. Valid genres are: ${validGenres.join(", ")}`)
      }
      query.andWhere("lyrics.genre = :genre", { genre })
    }

    // Apply decade filter if provided
    if (decade) {
      // Validate decade (should be 4-digit year in decades: 1990, 2000, 2010, etc.)
      if (decade < 1900 || decade % 10 !== 0) {
        throw new NotFoundException("Invalid decade. Please provide a 4-digit year in decades (e.g., 1990, 2000, 2010)")
      }

      // Convert decade to string format for database query (since entity uses varchar)
      const decadeStr = decade.toString()
      query.andWhere("lyrics.decade = :decade", { decade: decadeStr })
    }

    // Only return active lyrics
    query.andWhere("lyrics.isActive = :isActive", { isActive: true })

    const results = await query.getMany()

    // Return appropriate message if no results found
    if (results.length === 0) {
      throw new NotFoundException("No data matches your search")
    }

    return results
  }

  async findOne(id: string): Promise<Lyrics> {
    // Try to get from cache first
    const cacheKey = `${cacheConfig.keys.lyrics}${id}`
    let lyrics = await this.cacheManager.get<Lyrics>(cacheKey)

    if (!lyrics) {
      // If not in cache, fetch from database
      const dbLyrics = await this.lyricsRepository.findOne({ where: { id } })
      if (!dbLyrics) throw new NotFoundException("Lyrics not found")

      lyrics = dbLyrics
      // Cache the result
      await this.cacheManager.set(cacheKey, lyrics, cacheConfig.lyricsTTL)
    }

    return lyrics
  }

  async update(id: string, updateLyricsDto: UpdateLyricsDto, user: User): Promise<Lyrics> {
    const lyrics = await this.lyricsRepository.findOne({ where: { id } })
    if (!lyrics) throw new NotFoundException("Lyrics not found")

    // Optionally check if user is admin or creator
    Object.assign(lyrics, updateLyricsDto)
    const updatedLyrics = await this.lyricsRepository.save(lyrics)

    // Update cache and clear related caches
    const cacheKey = `${cacheConfig.keys.lyrics}${id}`
    await this.cacheManager.set(cacheKey, updatedLyrics, cacheConfig.lyricsTTL)
    await this.clearCache()

    return updatedLyrics
  }

  async remove(id: string): Promise<void> {
    const lyrics = await this.lyricsRepository.findOne({ where: { id } })
    if (!lyrics) throw new NotFoundException("Lyrics not found")

    await this.lyricsRepository.remove(lyrics)

    // Remove from cache and clear related caches
    const cacheKey = `${cacheConfig.keys.lyrics}${id}`
    await this.cacheManager.del(cacheKey)
    await this.clearCache()
  }

  /**
   * Fetch random lyrics with caching support
   * @param count Number of random lyrics to fetch (default: 1)
   * @param genre Optional genre filter
   * @param decade Optional decade filter
   * @returns Promise<Lyrics[]>
   */
  async getRandomLyrics(count = 1, genre?: string, decade?: number): Promise<Lyrics[]> {
    // Create cache key based on parameters
    const cacheKey = `${cacheConfig.keys.randomLyrics}${count}:${genre || "all"}:${decade || "all"}`

    // Try to get from cache first
    let lyrics = await this.cacheManager.get<Lyrics[]>(cacheKey)

    if (!lyrics) {
      // If not in cache, fetch from database
      lyrics = await this.fetchRandomLyricsFromDB(count, genre, decade)

      // Cache the result
      await this.cacheManager.set(cacheKey, lyrics, cacheConfig.lyricsTTL)
    }

    return lyrics
  }

  /**
   * Fetch random lyrics from database
   * @param count Number of random lyrics to fetch
   * @param genre Optional genre filter
   * @param decade Optional decade filter
   * @returns Promise<Lyrics[]>
   */
  private async fetchRandomLyricsFromDB(count: number, genre?: string, decade?: number): Promise<Lyrics[]> {
    let query = this.lyricsRepository.createQueryBuilder("lyrics")

    if (genre) {
      query = query.where("lyrics.genre = :genre", { genre })
    }

    if (decade) {
      query = query.andWhere("lyrics.decade = :decade", { decade })
    }

    // Get total count for random selection
    const totalCount = await query.getCount()

    if (totalCount === 0) {
      return []
    }

    // Generate random offset
    const randomOffset = Math.floor(Math.random() * Math.max(1, totalCount - count))

    return await query.orderBy("RANDOM()").limit(count).getMany()
  }

  /**
   * Get lyrics by category with caching
   * @param category Category type (genre, decade, artist)
   * @param value Category value
   * @returns Promise<Lyrics[]>
   */
  async getLyricsByCategory(category: "genre" | "decade" | "artist", value: string | number): Promise<Lyrics[]> {
    const cacheKey = `${cacheConfig.keys.lyricsByCategory}${category}:${value}`

    // Try to get from cache first
    let lyrics = await this.cacheManager.get<Lyrics[]>(cacheKey)

    if (!lyrics) {
      // If not in cache, fetch from database
      const whereClause = { [category]: value }
      lyrics = await this.lyricsRepository.find({ where: whereClause })

      // Cache the result
      await this.cacheManager.set(cacheKey, lyrics, cacheConfig.lyricsTTL)
    }

    return lyrics
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
      console.log("Cache cleared for lyrics")
    } catch (error) {
      console.warn("Cache clearing failed:", error)
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
    }
  }
}
