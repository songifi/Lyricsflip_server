import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';

// Mock bcrypt for testing
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

const mockUser = {
  id: 'test-id',
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: Role.USER,
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue({
        ...createUserDto,
        id: 'new-id',
        password: 'hashedPassword',
        role: Role.USER,
      } as User);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...createUserDto,
        id: 'new-id',
        password: 'hashedPassword',
        role: Role.USER,
      } as User);

      const result = await service.create(createUserDto);
      expect(result).toEqual({
        ...createUserDto,
        id: 'new-id',
        password: 'hashedPassword',
        role: Role.USER,
      });
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('should throw conflict exception if username exists', async () => {
      const createUserDto = {
        username: 'testuser',
        email: 'new@example.com',
        password: 'password123',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockUser] as User[]);
      const users = await service.findAll();
      expect(users).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should find and return a user by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);
      const user = await service.findOne('test-id');
      expect(user).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('wrong-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const updateUserDto = { username: 'updatedusername' };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(mockUser as User) // For findOne
        .mockResolvedValueOnce(null); // For username check

      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockUser,
        username: 'updatedusername',
      } as User);

      const result = await service.update('test-id', updateUserDto);
      expect(result.username).toEqual('updatedusername');
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });
      await service.remove('test-id');
      expect(repository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw an error if user to delete is not found', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0, raw: [] });
      await expect(service.remove('wrong-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
