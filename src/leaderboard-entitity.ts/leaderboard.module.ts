import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { PlayerStats } from './leaderboard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerStats])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService], 
export class LeaderboardModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    }),
    LeaderboardModule,
    
  ],
  
})
export class AppModule {}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePlayerStatsTable1619712345678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'player_stats',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'totalScore',
            type: 'int',
            default: 0,
          },
          {
            name: 'gamesPlayed',
            type: 'int',
            default: 0,
          },
          {
            name: 'wins',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        indices: [
          {
            name: 'IDX_PLAYER_STATS_USER_ID',
            columnNames: ['userId'],
            isUnique: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('player_stats');
  }
}