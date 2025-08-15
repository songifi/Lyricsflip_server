import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    return result;
  }

  /**
   * Returns the leaderboard: top users sorted by a field.
   * @param limit number of users to return
   * @param offset offset for pagination
   * @param sort sort field (xp, level, username)
   * @param order sort order (ASC, DESC)
   */
  async getLeaderboard(
    limit = 10,
    offset = 0,
    sort = 'xp',
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    if (limit < 1 || offset < 0)
      throw new BadRequestException('Invalid limit or offset');
    const validSorts = ['xp', 'level', 'username'];
    if (!validSorts.includes(sort))
      throw new BadRequestException('Invalid sort field');
    if (!['ASC', 'DESC'].includes(order))
      throw new BadRequestException('Invalid order');

    const cacheKey = `leaderboard:${sort}:${order}:${limit}:${offset}`;
    const cached = await this.cacheManager.get<any>(cacheKey);
    if (cached) return cached;

    const [users, total] = await this.userRepository.findAndCount({
      order: { [sort]: order },
      take: limit,
      skip: offset,
      select: ['id', 'username', 'xp', 'level'],
    });
    const result = {
      data: users.map((user, idx) => ({
        ...user,
        rank: offset + idx + 1,
      })),
      meta: {
        total,
        limit,
        offset,
        sort,
        order,
      },
    };
    await this.cacheManager.set(cacheKey, result, 30); // cache for 30s
    return result;
  }
}
