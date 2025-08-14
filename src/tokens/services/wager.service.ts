import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Wager, WagerStatus } from '../entities/wager.entity';
import { User } from '../../users/entities/user.entity';
import {
  ITokenService,
  TOKEN_SERVICE,
  TokenTransactionResult,
} from '../interfaces/token.interface';

export interface CreateWagerDto {
  sessionId: string;
  playerAId: string;
  playerBId: string;
  amount: number;
}

export interface WagerResult {
  success: boolean;
  wager?: Wager;
  message?: string;
}

@Injectable()
export class WagerService {
  private readonly logger = new Logger(WagerService.name);

  constructor(
    @InjectRepository(Wager)
    private readonly wagerRepository: Repository<Wager>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  /**
   * Creates a new wager between two players
   */
  async createWager(createWagerDto: CreateWagerDto): Promise<WagerResult> {
    const { sessionId, playerAId, playerBId, amount } = createWagerDto;

    this.logger.debug(
      `Creating wager for session ${sessionId} between players ${playerAId} and ${playerBId} for ${amount} tokens each`,
    );

    try {
      // Validate players exist
      const [playerA, playerB] = await Promise.all([
        this.userRepository.findOne({ where: { id: playerAId } }),
        this.userRepository.findOne({ where: { id: playerBId } }),
      ]);

      if (!playerA) {
        throw new NotFoundException(`Player A with ID ${playerAId} not found`);
      }

      if (!playerB) {
        throw new NotFoundException(`Player B with ID ${playerBId} not found`);
      }

      // Check if both players have sufficient tokens
      const [playerAHasSufficient, playerBHasSufficient] = await Promise.all([
        this.tokenService.hasSufficientTokens(playerAId, amount),
        this.tokenService.hasSufficientTokens(playerBId, amount),
      ]);

      if (!playerAHasSufficient) {
        return {
          success: false,
          message: `Player ${playerA.username} has insufficient tokens for this wager`,
        };
      }

      if (!playerBHasSufficient) {
        return {
          success: false,
          message: `Player ${playerB.username} has insufficient tokens for this wager`,
        };
      }

      // Check if wager already exists for this session
      const existingWager = await this.wagerRepository.findOne({
        where: { sessionId },
      });

      if (existingWager) {
        return {
          success: false,
          message: 'Wager already exists for this session',
        };
      }

      return await this.wagerRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          // Stake tokens for both players
          const [playerAStakeResult, playerBStakeResult] = await Promise.all([
            this.tokenService.stakeTokens(playerAId, amount),
            this.tokenService.stakeTokens(playerBId, amount),
          ]);

          if (!playerAStakeResult.success || !playerBStakeResult.success) {
            throw new BadRequestException(
              'Failed to stake tokens for one or both players',
            );
          }

          // Create the wager
          const wager = transactionalEntityManager.create(Wager, {
            sessionId,
            playerA,
            playerAId,
            playerB,
            playerBId,
            amount,
            totalPot: amount * 2,
            status: WagerStatus.STAKED,
          });

          const savedWager = await transactionalEntityManager.save(wager);

          this.logger.debug(
            `Successfully created wager ${savedWager.id} with total pot of ${savedWager.totalPot} tokens`,
          );

          return {
            success: true,
            wager: savedWager,
            message: `Wager created! Each player staked ${amount} tokens. Total pot: ${amount * 2} tokens`,
          };
        },
      );
    } catch (error) {
      this.logger.error(`Error creating wager:`, error.stack);
      return {
        success: false,
        message: `Failed to create wager: ${error.message}`,
      };
    }
  }

  /**
   * Resolves a wager with a winner
   */
  async resolveWagerWithWinner(
    sessionId: string,
    winnerId: string,
  ): Promise<WagerResult> {
    this.logger.debug(
      `Resolving wager for session ${sessionId} with winner ${winnerId}`,
    );

    try {
      const wager = await this.wagerRepository.findOne({
        where: { sessionId },
        relations: ['playerA', 'playerB'],
      });

      if (!wager) {
        throw new NotFoundException(`Wager for session ${sessionId} not found`);
      }

      if (wager.status !== WagerStatus.STAKED) {
        return {
          success: false,
          message: `Wager is already resolved with status: ${wager.status}`,
        };
      }

      // Validate winner is one of the players
      if (winnerId !== wager.playerAId && winnerId !== wager.playerBId) {
        throw new BadRequestException(
          'Winner must be one of the wagering players',
        );
      }

      return await this.wagerRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          // Release tokens to winner
          const releaseResult = await this.tokenService.releaseToWinner(
            winnerId,
            wager.totalPot,
          );

          if (!releaseResult.success) {
            throw new BadRequestException(
              `Failed to release tokens to winner: ${releaseResult.message}`,
            );
          }

          // Update wager status
          wager.winnerId = winnerId;
          wager.winner =
            winnerId === wager.playerAId ? wager.playerA : wager.playerB;
          wager.status = WagerStatus.WON;
          wager.resolvedAt = new Date();
          wager.resultMessage = releaseResult.message || 'Wager resolved';

          const updatedWager = await transactionalEntityManager.save(wager);

          this.logger.debug(
            `Successfully resolved wager ${wager.id} with winner ${winnerId}`,
          );

          return {
            success: true,
            wager: updatedWager,
            message: releaseResult.message,
          };
        },
      );
    } catch (error) {
      this.logger.error(
        `Error resolving wager for session ${sessionId}:`,
        error.stack,
      );
      return {
        success: false,
        message: `Failed to resolve wager: ${error.message}`,
      };
    }
  }

  /**
   * Resolves a wager as a draw (refunds both players)
   */
  async resolveWagerAsDraw(sessionId: string): Promise<WagerResult> {
    this.logger.debug(`Resolving wager for session ${sessionId} as a draw`);

    try {
      const wager = await this.wagerRepository.findOne({
        where: { sessionId },
        relations: ['playerA', 'playerB'],
      });

      if (!wager) {
        throw new NotFoundException(`Wager for session ${sessionId} not found`);
      }

      if (wager.status !== WagerStatus.STAKED) {
        return {
          success: false,
          message: `Wager is already resolved with status: ${wager.status}`,
        };
      }

      return await this.wagerRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          // Refund tokens to both players
          const [playerARefundResult, playerBRefundResult] = await Promise.all([
            this.tokenService.refundStake(wager.playerAId, wager.amount),
            this.tokenService.refundStake(wager.playerBId, wager.amount),
          ]);

          if (!playerARefundResult.success || !playerBRefundResult.success) {
            throw new BadRequestException(
              'Failed to refund tokens to one or both players',
            );
          }

          // Update wager status
          wager.status = WagerStatus.REFUNDED;
          wager.resolvedAt = new Date();
          wager.resultMessage = `Draw! Each player received their ${wager.amount} tokens back.`;

          const updatedWager = await transactionalEntityManager.save(wager);

          this.logger.debug(
            `Successfully resolved wager ${wager.id} as a draw`,
          );

          return {
            success: true,
            wager: updatedWager,
            message: wager.resultMessage,
          };
        },
      );
    } catch (error) {
      this.logger.error(
        `Error resolving wager as draw for session ${sessionId}:`,
        error.stack,
      );
      return {
        success: false,
        message: `Failed to resolve wager as draw: ${error.message}`,
      };
    }
  }

  /**
   * Gets wager details for a session
   */
  async getWagerBySessionId(sessionId: string): Promise<Wager | null> {
    try {
      return await this.wagerRepository.findOne({
        where: { sessionId },
        relations: ['playerA', 'playerB', 'winner'],
      });
    } catch (error) {
      this.logger.error(
        `Error getting wager for session ${sessionId}:`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Gets all wagers for a user
   */
  async getUserWagers(userId: string, limit: number = 10): Promise<Wager[]> {
    try {
      return await this.wagerRepository
        .createQueryBuilder('wager')
        .leftJoinAndSelect('wager.playerA', 'playerA')
        .leftJoinAndSelect('wager.playerB', 'playerB')
        .leftJoinAndSelect('wager.winner', 'winner')
        .where('wager.playerAId = :userId OR wager.playerBId = :userId', {
          userId,
        })
        .orderBy('wager.createdAt', 'DESC')
        .limit(limit)
        .getMany();
    } catch (error) {
      this.logger.error(
        `Error getting wagers for user ${userId}:`,
        error.stack,
      );
      return [];
    }
  }
}
