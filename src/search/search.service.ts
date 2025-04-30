import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Song } from '../songs/entities/song.entity';
import { Session } from '../sessions/entities/session.entity';
import { SearchQueryDto, SearchType } from './dto/search-query.dto';
import { PaginatedResponse, SearchResponse } from './dto/search-response.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async search(searchQueryDto: SearchQueryDto): Promise<SearchResponse> {
    const { type, query, status, page = 1, limit = 10 } = searchQueryDto;
    const skip = (page - 1) * limit;

    switch (type) {
      case SearchType.USER:
        return this.searchUsers(query, page, limit, skip);
      case SearchType.SONG:
        return this.searchSongs(query, page, limit, skip);
      case SearchType.SESSION:
        return this.searchSessions(query, status, page, limit, skip);
    }
  }

  private async searchUsers(
    query: string,
    page: number,
    limit: number,
    skip: number,
  ): Promise<PaginatedResponse<User>> {
    const where = query ? { username: Like(`%${query}%`) } : {};
    
    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
    });

    return this.paginateResponse(users, total, page, limit);
  }

  private async searchSongs(
    query: string,
    page: number,
    limit: number,
    skip: number,
  ): Promise<PaginatedResponse<Song>> {
    const where = query
      ? [
          { title: Like(`%${query}%`) },
          { artist: Like(`%${query}%`) },
        ]
      : {};
    
    const [songs, total] = await this.songRepository.findAndCount({
      where,
      skip,
      take: limit,
    });

    return this.paginateResponse(songs, total, page, limit);
  }

  private async searchSessions(
    query: string,
    status: string,
    page: number,
    limit: number,
    skip: number,
  ): Promise<PaginatedResponse<Session>> {
    let where = {};
    
    if (status) {
      where = { ...where, status };
    }
    
    if (query) {
      where = { ...where, name: Like(`%${query}%`) };
    }
    
    const [sessions, total] = await this.sessionRepository.findAndCount({
      where,
      skip,
      take: limit,
    });

    return this.paginateResponse(sessions, total, page, limit);
  }

  private paginateResponse<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}