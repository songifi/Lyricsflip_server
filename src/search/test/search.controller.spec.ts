import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from '../search.controller';
import { SearchService } from '../search.service';
import { SearchType } from '../dto/search-query.dto';

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;

  beforeEach(async () => {
    const mockSearchService = {
      search: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  describe('search', () => {
    it('should call searchService.search with correct parameters', async () => {
      const mockResponse = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      
      jest.spyOn(service, 'search').mockResolvedValue(mockResponse);

      const query = {
        type: SearchType.USER,
        query: 'test',
        page: 1,
        limit: 10,
      };

      const result = await controller.search(query);

      expect(service.search).toHaveBeenCalledWith(query);
      expect(result).toBe(mockResponse);
    });
  });

  describe('searchUsers', () => {
    it('should call searchService.search with USER type', async () => {
      const mockResponse = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      
      jest.spyOn(service, 'search').mockResolvedValue(mockResponse);

      const query = {
        query: 'test',
        page: 1,
        limit: 10,
      };

      const result = await controller.searchUsers(query);

      expect(service.search).toHaveBeenCalledWith({
        ...query,
        type: SearchType.USER,
      });
      expect(result).toBe(mockResponse);
    });
  });
});