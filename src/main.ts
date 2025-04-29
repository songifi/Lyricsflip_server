// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set up global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  await app.listen(3000);
}
bootstrap();Id = await this.gameSessionService.createSession(
        playerIds,
        mostCommonCategory, 
        mostCommonDifficulty
      );
      
      // Remove these players from queue
      this.queue = this.queue.filter(p => !playerIds.includes(p.playerId));
    }
  }

  private getMostCommonPreference<T>(preferences: T[]): T {
    const counts = preferences.reduce((acc, pref) => {
      acc[String(pref)] = (acc[String(pref)] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const entries = Object.entries(counts);
    entries.sort((a, b) => b[1] - a[1]);
    
    return entries[0][0] as unknown as T;
  }

  private findFriendGroups(): PlayerMatchRequest[][] {
    const groups: PlayerMatchRequest[][] = [];
    const processed = new Set<string>();
    
    for (const player of this.queue) {
      if (processed.has(player.playerId)) continue;
      
      const friendIds = player.preferences.withFriendIds || [];
      if (friendIds.length === 0) continue;
      
      // Find all friends in queue
      const group = [player];
      processed.add(player.playerId);
      
      for (const friendId of friendIds) {
        const friend = this.queue.find(p => p.playerId === friendId);
        if (friend && !processed.has(friendId)) {
          group.push(friend);
          processed.add(friendId);
        }
      }
      
      if (group.length > 1) {
        groups.push(group);
      }
    }
    
    return groups;
  }

  private async processFriendGroup(group: PlayerMatchRequest[]) {
    // If group size is at least 2, create a session
    if (group.length >= 2) {
      const playerIds = group.map(p => p.playerId);
      
      // Find common preferences
      const categories = this.findCommonPreferences(
        group.map(p => p.preferences.categories || [])
      );
      
      const difficulty = this.findCommonDifficulty(
        group.map(p => p.preferences.difficulty)
      );
      
      // Create session with friends
      if (group.length >= this.PLAYERS_PER_SESSION) {
        // Full session
        const sessionId = await this.gameSessionService.createSession(
          playerIds.slice(0, this.PLAYERS_PER_SESSION),
          categories[0] || GameCategory.ACTION,
          difficulty || GameDifficulty.MEDIUM
        );
        
        // Remove matched players from queue
        this.queue = this.queue.filter(
          p => !playerIds.slice(0, this.PLAYERS_PER_SESSION).includes(p.playerId)
        );
      } else {
        // Try to fill with compatible players
        const neededPlayers = this.PLAYERS_PER_SESSION - group.length;
        const compatiblePlayers = this.findCompatiblePlayers(group[0], neededPlayers);
        
        if (compatiblePlayers.length === neededPlayers) {
          const allPlayerIds = [...playerIds, ...compatiblePlayers.map(p => p.playerId)];
          
          const sessionId = await this.gameSessionService.createSession(
            allPlayerIds,
            categories[0] || GameCategory.ACTION,
            difficulty || GameDifficulty.MEDIUM
          );
          
          // Remove matched players from queue
          this.queue = this.queue.filter(p => !allPlayerIds.includes(p.playerId));
        }
      }
    }
  }

  private findCommonPreferences(preferencesArrays: GameCategory[][]): GameCategory[] {
    if (preferencesArrays.length === 0) return [GameCategory.ACTION];
    
    // Start with the first array's preferences
    let common = [...preferencesArrays[0]];
    
    // Find intersection with each subsequent array
    for (let i = 1; i < preferencesArrays.length; i++) {
      common = common.filter(pref => preferencesArrays[i].includes(pref));
    }
    
    // If no common preferences, use the most frequent one
    if (common.length === 0) {
      const allPreferences = preferencesArrays.flat();
      return [this.getMostCommonPreference(allPreferences)];
    }
    
    return common;
  }

  private findCommonDifficulty(difficulties: (GameDifficulty | undefined)[]): GameDifficulty {
    // Filter out undefined values
    const definedDifficulties = difficulties.filter(Boolean) as GameDifficulty[];
    
    if (definedDifficulties.length === 0) {
      return GameDifficulty.MEDIUM;
    }
    
    // If all are the same, return that difficulty
    const allSame = definedDifficulties.every(d => d === definedDifficulties[0]);
    if (allSame) return definedDifficulties[0];
    
    // Otherwise return the most common
    return this.getMostCommonPreference(definedDifficulties);
  }

  private findCompatiblePlayers(request: PlayerMatchRequest, count: number): PlayerMatchRequest[] {
    const compatible = this.queue.filter(p => {
      // Skip if it's the same player or one of their requested friends
      if (p.playerId === request.playerId) return false;
      if (request.preferences.withFriendIds?.includes(p.playerId)) return false;
      
      // Check skill level compatibility
      const skillDifference = Math.abs(
        this.getSkillValue(p.skillLevel) - this.getSkillValue(request.skillLevel)
      );
      if (skillDifference > this.MAX_SKILL_DIFFERENCE) return false;
      
      // Check category compatibility (at least one in common)
      const requestCategories = request.preferences.categories || Object.values(GameCategory);
      const playerCategories = p.preferences.categories || Object.values(GameCategory);
      const hasCommonCategory = requestCategories.some(cat => playerCategories.includes(cat));
      if (!hasCommonCategory) return false;
      
      // Check difficulty compatibility
      if (request.preferences.difficulty && 
          p.preferences.difficulty && 
          request.preferences.difficulty !== p.preferences.difficulty) {
        return false;
      }
      
      return true;
    });
    
    // Sort by wait time (oldest first)
    compatible.sort((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime());
    
    return compatible.slice(0, count);
  }

  async findMatch(request: PlayerMatchRequest): Promise<MatchmakingResult> {
    // Find potential matches based on skill level and preferences
    const potentialMatches = this.findCompatiblePlayers(request, this.PLAYERS_PER_SESSION - 1);
    
    if (potentialMatches.length >= this.PLAYERS_PER_SESSION - 1) {
      // We have enough players for a full session
      const matchedPlayers = potentialMatches.slice(0, this.PLAYERS_PER_SESSION - 1);
      const playerIds = [request.playerId, ...matchedPlayers.map(p => p.playerId)];
      
      // Determine session category and difficulty
      let category = request.preferences.categories?.[0] || GameCategory.ACTION;
      let difficulty = request.preferences.difficulty || GameDifficulty.MEDIUM;
      
      // Create game session
      const sessionId = await this.gameSessionService.createSession(
        playerIds,
        category,
        difficulty
      );
      
      const session = await this.gameSessionService.getSession(sessionId);
      
      // Remove matched players from queue
      this.queue = this.queue.filter(p => !playerIds.includes(p.playerId));
      
      this.logger.log(`Created match for players: ${playerIds.join(', ')}`);
      
      return {
        success: true,
        message: 'Match found!',
        gameSession: session,
      };
    }
    
    return {
      success: false,
      message: 'No immediate match available, added to queue',
      estimatedWaitTime: this.estimateWaitTime(request),
    };
  }
}
