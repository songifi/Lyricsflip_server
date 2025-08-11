import { Injectable } from '@nestjs/common';
import { UserLevel } from '../users/entities/user.entity'

@Injectable()
export class XpLevelService {
  private readonly LEVEL_THRESHOLDS = [
    { min: 0, max: 99, level: UserLevel.GOSSIP_ROOKIE },
    { min: 100, max: 299, level: UserLevel.WORD_WHISPERER },
    { min: 300, max: 599, level: UserLevel.LYRIC_SNIPER },
    { min: 600, max: 999, level: UserLevel.BAR_GENIUS },
    { min: 1000, max: Infinity, level: UserLevel.GOSSIP_GOD },
  ];

  getLevelFromXp(xp: number): UserLevel {
    return this.LEVEL_THRESHOLDS.find(
      (threshold) => xp >= threshold.min && xp <= threshold.max,
    )?.level || UserLevel.GOSSIP_ROOKIE;
  }

  calculateXpGain(currentXp: number, correctGuesses = 1, xpPerGuess = 10) {
    const newXp = currentXp + correctGuesses * xpPerGuess;
    return {
      xp: newXp,
      level: this.getLevelFromXp(newXp),
    };
  }
}
