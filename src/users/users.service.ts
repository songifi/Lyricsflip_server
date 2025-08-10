import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id: String(id) } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  /**
   * Returns the leaderboard: top users sorted by XP.
   * @param limit number of users to return
   * @param offset offset for pagination
   */
  async getLeaderboard(limit = 10, offset = 0) {
    if (limit < 1 || offset < 0) throw new BadRequestException('Invalid limit or offset');
    const [users, total] = await this.userRepository.findAndCount({
      order: { xp: 'DESC' },
      take: limit,
      skip: offset,
      select: ['id', 'username', 'xp', 'level'],
    });
    // Add rank to each user
    return users.map((user, idx) => ({
      ...user,
      rank: offset + idx + 1,
    }));
  }
}
