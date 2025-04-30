// src/matchmaking/matchmaking.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameSessionService } from './game-session.service';
import {
  PlayerMatchRequest,
  MatchmakingResult,
  GameCategory,
  GameDifficulty,
  PlayerSkillLevel,
} from './types/matchmaking.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MatchmakingService {
  private readonly logger = new Logger(MatchmakingService.name);
  private queue: PlayerMatchRequest[] = [];
  private readonly MAX_SKILL_DIFFERENCE = 1; // Max skill level difference for matchmaking
  private readonly PLAYERS_PER_SESSION = 4; // Number of players needed for a full session

  constructor(private readonly gameSessionService: GameSessionService) {}

  async requestMatchmaking(
    playerId: string,
    skillLevel: PlayerSkillLevel,
    preferences: any,
  ): Promise<MatchmakingResult> {
    // Check if player is already in queue
    const existingRequest = this.queue.find((req) => req.playerId === playerId);
    if (existingRequest) {
      return {
        success: false,
        message: 'Player already in matchmaking queue',
        estimatedWaitTime: this.estimateWaitTime(existingRequest),
      };
    }

    // Create new match request
    const matchRequest: PlayerMatchRequest = {
      playerId,
      skillLevel,
      preferences,
      requestedAt: new Date(),
    };

    // Try immediate match
    const immediateMatch = await this.findMatch(matchRequest);
    if (immediateMatch.success && immediateMatch.gameSession) {
      return immediateMatch;
    }

    // Add to queue if no immediate match
    this.queue.push(matchRequest);
    this.logger.log(`Player ${playerId} added to matchmaking queue`);

    return {
      success: true,
      message: 'Added to matchmaking queue',
      estimatedWaitTime: this.estimateWaitTime(matchRequest),
    };
  }

  async cancelMatchmaking(playerId: string): Promise<boolean> {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter((req) => req.playerId !== playerId);

    const removed = initialLength > this.queue.length;
    if (removed) {
      this.logger.log(`Player ${playerId} removed from matchmaking queue`);
    }

    return removed;
  }

  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      queueBySkillLevel: {
        BEGINNER: this.queue.filter(
          (p) => p.skillLevel === PlayerSkillLevel.BEGINNER,
        ).length,
        INTERMEDIATE: this.queue.filter(
          (p) => p.skillLevel === PlayerSkillLevel.INTERMEDIATE,
        ).length,
        ADVANCED: this.queue.filter(
          (p) => p.skillLevel === PlayerSkillLevel.ADVANCED,
        ).length,
        EXPERT: this.queue.filter(
          (p) => p.skillLevel === PlayerSkillLevel.EXPERT,
        ).length,
      },
      averageWaitTime: this.calculateAverageWaitTime(),
    };
  }

  private calculateAverageWaitTime(): number {
    if (this.queue.length === 0) return 0;

    const now = new Date();
    const totalWaitTime = this.queue.reduce((sum, req) => {
      return sum + (now.getTime() - req.requestedAt.getTime()) / 1000;
    }, 0);

    return Math.round(totalWaitTime / this.queue.length);
  }

  private estimateWaitTime(request: PlayerMatchRequest): number {
    // Count players with similar skill level
    const similarSkillPlayers = this.queue.filter(
      (player) =>
        Math.abs(
          this.getSkillValue(player.skillLevel) -
            this.getSkillValue(request.skillLevel),
        ) <= this.MAX_SKILL_DIFFERENCE,
    ).length;

    // Basic wait time calculation: more players with similar skill = less wait time
    const baseWaitTime = 60; // Base wait time in seconds
    const waitTimeReduction = Math.min(45, similarSkillPlayers * 15); // Reduce wait time based on queue size

    return Math.max(15, baseWaitTime - waitTimeReduction);
  }

  private getSkillValue(skill: PlayerSkillLevel): number {
    const skillValues = {
      [PlayerSkillLevel.BEGINNER]: 1,
      [PlayerSkillLevel.INTERMEDIATE]: 2,
      [PlayerSkillLevel.ADVANCED]: 3,
      [PlayerSkillLevel.EXPERT]: 4,
    };
    return skillValues[skill];
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async processMatchmakingQueue() {
    if (this.queue.length < 2) return; // Need at least 2 players to match

    this.logger.debug(
      `Processing matchmaking queue with ${this.queue.length} players`,
    );

    // Process friend groups first
    const friendGroups = this.findFriendGroups();
    for (const group of friendGroups) {
      await this.processFriendGroup(group);
    }

    // Process remaining players by skill level
    const remainingPlayers = [...this.queue];

    // Sort by wait time (oldest first)
    remainingPlayers.sort(
      (a, b) => a.requestedAt.getTime() - b.requestedAt.getTime(),
    );

    for (const player of remainingPlayers) {
      // Skip if player was already matched in a friend group
      if (!this.queue.some((p) => p.playerId === player.playerId)) continue;

      await this.findMatch(player);
    }

    // Process timeouts - remove players who waited too long and create sessions with fewer players
    await this.processTimeouts();
  }

  private async processTimeouts() {
    const now = new Date();
    const timeoutPlayers = this.queue.filter((player) => {
      const maxWaitTime = player.preferences.maxWaitTimeSeconds || 300; // Default 5 minutes
      const waitTime = (now.getTime() - player.requestedAt.getTime()) / 1000;
      return waitTime >= maxWaitTime;
    });

    return timeoutPlayers;
  }
}
