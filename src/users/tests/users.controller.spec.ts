import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { Role } from '../enums/role.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 'test-id',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: Role.USER,
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      jest.spyOn(service, 'create').mockResolvedValue({
        ...createUserDto,
        id: 'new-id',
        password: 'hashedPassword',
        role: Role.USER,
      } as any);

      const result = await controller.create(createUserDto);
      expect(result).toEqual({
        ...createUserDto,
        id: 'new-id',
        password: 'hashedPassword',
        role: Role.USER,
      });
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockUser] as any);
      
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as any);
      
      const result = await controller.findOne('test-id');
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('test-id');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { username: 'updateduser' };
      
      jest.spyOn(service, 'update').mockResolvedValue({
        ...mockUser,
        username: 'updateduser',
      } as any);
      
      const result = await controller.update('test-id', updateUserDto);
      expect(result.username).toEqual('updateduser');
      expect(service.update).toHaveBeenCalledWith('test-id', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      
      await controller.remove('test-id');
      expect(service.remove).toHaveBeenCalledWith('test-id');
    });
  });
});
