import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto, SearchType } from './dto/search-query.dto';
import { SearchResponse } from './dto/search-response.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() searchQueryDto: SearchQueryDto): Promise<SearchResponse> {
    return this.searchService.search(searchQueryDto);
  }

  @Get('users')
  async searchUsers(@Query() query: Omit<SearchQueryDto, 'type'>): Promise<SearchResponse> {
    return this.searchService.search({
      ...query,
      type: SearchType.USER,
    });
  }

  @Get('songs')
  async searchSongs(@Query() query: Omit<SearchQueryDto, 'type'>): Promise<SearchResponse> {
    return this.searchService.search({
      ...query,
      type: SearchType.SONG,
    });
  }

  @Get('sessions')
  async searchSessions(@Query() query: Omit<SearchQueryDto, 'type'>): Promise<SearchResponse> {
    return this.searchService.search({
      ...query,
      type: SearchType.SESSION,
    });
  }
}