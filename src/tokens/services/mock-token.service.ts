import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  ITokenService,
  TokenTransactionResult,
} from '../interfaces/token.interface';

@Injectable()
export class MockTokenService implements ITokenService {
  private readonly logger = new Logger(MockTokenService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Stakes tokens for a user in a game session
   * Deducts tokens from user balance and holds them in escrow (conceptually)
   */
  async stakeTokens(
    userId: string,
    amount: number,
  ): Promise<TokenTransactionResult> {
    this.logger.debug(`Staking ${amount} tokens for user ${userId}`);

    try {
      return await this.userRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const user = await transactionalEntityManager.findOne(User, {
            where: { id: userId },
          });

          if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
          }

          if (user.mockTokenBalance < amount) {
            return {
              success: false,
              message: `Insufficient tokens. Balance: ${user.mockTokenBalance}, Required: ${amount}`,
            };
          }

          // Deduct tokens from user balance
          user.mockTokenBalance -= amount;
          await transactionalEntityManager.save(user);

          this.logger.debug(
            `Successfully staked ${amount} tokens for user ${userId}. New balance: ${user.mockTokenBalance}`,
          );

          return {
            success: true,
            newBalance: user.mockTokenBalance,
            message: `Successfully staked ${amount} tokens`,
          };
        },
      );
    } catch (error) {
      this.logger.error(
        `Error staking tokens for user ${userId}:`,
        error.stack,
      );
      return {
        success: false,
        message: `Failed to stake tokens: ${error.message}`,
      };
    }
  }

  /**
   * Releases staked tokens to the winner
   * Adds the total wagered amount to winner's balance
   */
  async releaseToWinner(
    winnerId: string,
    totalAmount: number,
  ): Promise<TokenTransactionResult> {
    this.logger.debug(`Releasing ${totalAmount} tokens to winner ${winnerId}`);

    try {
      return await this.userRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const winner = await transactionalEntityManager.findOne(User, {
            where: { id: winnerId },
          });

          if (!winner) {
            throw new NotFoundException(`Winner with ID ${winnerId} not found`);
          }

          // Add tokens to winner's balance
          winner.mockTokenBalance += totalAmount;
          await transactionalEntityManager.save(winner);

          this.logger.debug(
            `Successfully released ${totalAmount} tokens to winner ${winnerId}. New balance: ${winner.mockTokenBalance}`,
          );

          return {
            success: true,
            newBalance: winner.mockTokenBalance,
            message: `You won ${totalAmount} tokens!`,
          };
        },
      );
    } catch (error) {
      this.logger.error(
        `Error releasing tokens to winner ${winnerId}:`,
        error.stack,
      );
      return {
        success: false,
        message: `Failed to release tokens: ${error.message}`,
      };
    }
  }

  /**
   * Refunds staked tokens to a user
   * Returns the staked amount back to user's balance
   */
  async refundStake(
    userId: string,
    amount: number,
  ): Promise<TokenTransactionResult> {
    this.logger.debug(`Refunding ${amount} tokens to user ${userId}`);

    try {
      return await this.userRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const user = await transactionalEntityManager.findOne(User, {
            where: { id: userId },
          });

          if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
          }

          // Refund tokens to user balance
          user.mockTokenBalance += amount;
          await transactionalEntityManager.save(user);

          this.logger.debug(
            `Successfully refunded ${amount} tokens to user ${userId}. New balance: ${user.mockTokenBalance}`,
          );

          return {
            success: true,
            newBalance: user.mockTokenBalance,
            message: `Wager refunded: ${amount} tokens`,
          };
        },
      );
    } catch (error) {
      this.logger.error(
        `Error refunding tokens for user ${userId}:`,
        error.stack,
      );
      return {
        success: false,
        message: `Failed to refund tokens: ${error.message}`,
      };
    }
  }

  /**
   * Gets user's current token balance
   */
  async getUserBalance(userId: string): Promise<number> {
    this.logger.debug(`Getting balance for user ${userId}`);

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return user.mockTokenBalance;
    } catch (error) {
      this.logger.error(
        `Error getting balance for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Checks if user has sufficient tokens for a stake
   */
  async hasSufficientTokens(userId: string, amount: number): Promise<boolean> {
    this.logger.debug(
      `Checking if user ${userId} has sufficient tokens (${amount})`,
    );

    try {
      const balance = await this.getUserBalance(userId);
      const hasSufficient = balance >= amount;

      this.logger.debug(
        `User ${userId} balance: ${balance}, Required: ${amount}, Sufficient: ${hasSufficient}`,
      );
      return hasSufficient;
    } catch (error) {
      this.logger.error(
        `Error checking sufficient tokens for user ${userId}:`,
        error.stack,
      );
      return false;
    }
  }
}
