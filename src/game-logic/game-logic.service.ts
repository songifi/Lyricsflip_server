import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { XpLevelService } from '../xp-level/xp-level.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GameLogicService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly xpLevelService: XpLevelService,
  ) {}

  async handleCorrectGuess(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const { xp, level } = this.xpLevelService.calculateXpGain(user.xp, 1);
    user.xp = xp;
    user.level = level as unknown as number;

    await this.userRepo.save(user);
    return { xp, level };
  }
}
