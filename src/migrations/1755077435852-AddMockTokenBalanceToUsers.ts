import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMockTokenBalanceToUsers1755077435852
  implements MigrationInterface
{
  name = 'AddMockTokenBalanceToUsers1755077435852';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "mockTokenBalance" integer NOT NULL DEFAULT 100
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "mockTokenBalance"
    `);
  }
}
