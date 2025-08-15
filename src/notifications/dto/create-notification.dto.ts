import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateLevelUpNotificationDto {
  @IsString()
  userId: string;

  @IsNumber()
  newLevel: number;

  @IsString()
  newTitle: string;

  @IsNumber()
  xpGained: number;
}

export class CreateChallengeNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  challengeName: string;

  @IsNumber()
  streakCount: number;

  @IsOptional()
  @IsString()
  reward?: string;
}

export class CreateAchievementNotificationDto {
  @IsString()
  userId: string;

  @IsEnum(['perfect_guess', 'streak', 'first_win', 'speed_demon'])
  achievementType: 'perfect_guess' | 'streak' | 'first_win' | 'speed_demon';

  @IsOptional()
  @IsNumber()
  achievementValue?: number;

  @IsOptional()
  @IsString()
  reward?: string;
} 