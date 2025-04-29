import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from '../categories.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: MockRepository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<MockRepository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      
      repository.create.mockReturnValue(expectedCategory);
      repository.save.mockResolvedValue(expectedCategory);
      
      const result = await service.create(createCategoryDto);
      expect(result).toEqual(expectedCategory);
      expect(repository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(repository.save).toHaveBeenCalledWith(expectedCategory);
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
      
      repository.find.mockResolvedValue(expectedCategories);
      
      const result = await service.findAll();
      expect(result).toEqual(expectedCategories);
      expect(repository.find).toHaveBeenCalled();
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
      
      repository.findOne.mockResolvedValue(expectedCategory);
      
      const result = await service.findOne(categoryId);
      expect(result).toEqual(expectedCategory);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: categoryId } });
    });

    it('should throw NotFoundException if category not found', async () => {
      const categoryId = 'non-existent-id';
      
      repository.findOne.mockResolvedValue(null);
      
      await expect(service.findOne(categoryId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: categoryId } });
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const categoryId = '123e4567-e89b-12d3-a456-426614174000';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Pop Music',
      };
      
      const existingCategory = {
        id: categoryId,
        name: 'Pop Music',
        description: 'Popular music category',
      };
      
      const updatedCategory = {
        ...existingCategory,
        ...updateCategoryDto,
      };
      
      repository.findOne.mockResolvedValue(existingCategory);
      repository.save.mockResolvedValue(updatedCategory);
      
      const result = await service.update(categoryId, updateCategoryDto);
      expect(result).toEqual(updatedCategory);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: categoryId } });
      expect(repository.save).toHaveBeenCalledWith(updatedCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      const categoryId = 'non-existent-id';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Pop Music',
      };
      
      repository.findOne.mockResolvedValue(null);
      
      await expect(service.update(categoryId, updateCategoryDto)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: categoryId } });
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const categoryId = '123e4567-e89b-12d3-a456-426614174000';
      
      repository.delete.mockResolvedValue({ affected: 1 });
      
      await service.remove(categoryId);
      expect(repository.delete).toHaveBeenCalledWith(categoryId);
    });

    it('should throw NotFoundException if category not found', async () => {
      const categoryId = 'non-existent-id';
      
      repository.delete.mockResolvedValue({ affected: 0 });
      
      await expect(service.remove(categoryId)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(categoryId);
    });
  });
});
