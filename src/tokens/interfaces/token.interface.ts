export interface TokenTransactionResult {
  success: boolean;
  newBalance?: number;
  message?: string;
}

export interface ITokenService {
  /**
   * Stakes tokens for a user in a game session
   * @param userId - The user's ID
   * @param amount - Amount of tokens to stake
   * @returns Promise<TokenTransactionResult>
   */
  stakeTokens(userId: string, amount: number): Promise<TokenTransactionResult>;

  /**
   * Releases staked tokens to the winner
   * @param winnerId - The winner's user ID
   * @param totalAmount - Total amount to release to winner
   * @returns Promise<TokenTransactionResult>
   */
  releaseToWinner(
    winnerId: string,
    totalAmount: number,
  ): Promise<TokenTransactionResult>;

  /**
   * Refunds staked tokens to a user
   * @param userId - The user's ID
   * @param amount - Amount to refund
   * @returns Promise<TokenTransactionResult>
   */
  refundStake(userId: string, amount: number): Promise<TokenTransactionResult>;

  /**
   * Gets user's current token balance
   * @param userId - The user's ID
   * @returns Promise<number>
   */
  getUserBalance(userId: string): Promise<number>;

  /**
   * Checks if user has sufficient tokens for a stake
   * @param userId - The user's ID
   * @param amount - Amount to check
   * @returns Promise<boolean>
   */
  hasSufficientTokens(userId: string, amount: number): Promise<boolean>;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
