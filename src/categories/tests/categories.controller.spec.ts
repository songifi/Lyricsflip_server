import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Pop Music',
        description: 'Popular music category',
      };
      
      const expectedCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createCategoryDto,
      };
      
      jest.spyOn(service, 'create').mockResolvedValue(expectedCategory);
      
      const result = await controller.create(createCategoryDto);
      expect(result).toEqual(expectedCategory);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const expectedCategories = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Pop Music',
          description: 'Popular music category',
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174000',
          name: 'Rock Music',
          description: 'Rock music category',
        },
      ];
      
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedCategories);
      
      const result = await controller.findAll();
      expect(result).toEqual(expectedCategories);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const categoryId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedCategory = {
        id: categoryId,
        name: 'Pop Music',
        description: 'Popular music category',
      };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedCategory);
      
      const result = await controller.findOne(categoryId);
      expect(result).toEqual(expectedCategory);
      expect(service.findOne).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const categoryId = '123e4567-e89b-12d3-a456-426614174000';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Pop Music',
      };
      
      const updatedCategory = {
        id: categoryId,
        name: 'Updated Pop Music',
        description: 'Popular music category',
      };
      
      jest.spyOn(service, 'update').mockResolvedValue(updatedCategory);
      
      const result = await controller.update(categoryId, updateCategoryDto);
      expect(result).toEqual(updatedCategory);
      expect(service.update).toHaveBeenCalledWith(categoryId, updateCategoryDto);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const categoryId = '123e4567-e89b-12d3-a456-426614174000';
      
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      
      await controller.remove(categoryId);
      expect(service.remove).toHaveBeenCalledWith(categoryId);
    });
  });
});
