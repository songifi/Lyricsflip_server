import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWagersTable1755077437000 implements MigrationInterface {
  name = 'CreateWagersTable1755077437000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."wager_status_enum" AS ENUM('pending', 'staked', 'won', 'lost', 'refunded')
    `);

    await queryRunner.query(`
      CREATE TABLE "wagers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "sessionId" uuid NOT NULL,
        "playerAId" uuid NOT NULL,
        "playerBId" uuid NOT NULL,
        "amount" integer NOT NULL,
        "totalPot" integer NOT NULL,
        "status" "public"."wager_status_enum" NOT NULL DEFAULT 'pending',
        "winnerId" uuid,
        "resultMessage" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "resolvedAt" TIMESTAMP,
        CONSTRAINT "PK_wagers" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "wagers" 
      ADD CONSTRAINT "FK_wagers_player_a" 
      FOREIGN KEY ("playerAId") REFERENCES "users"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "wagers" 
      ADD CONSTRAINT "FK_wagers_player_b" 
      FOREIGN KEY ("playerBId") REFERENCES "users"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "wagers" 
      ADD CONSTRAINT "FK_wagers_winner" 
      FOREIGN KEY ("winnerId") REFERENCES "users"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_wagers_session_id" ON "wagers" ("sessionId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_wagers_session_id"`);

    await queryRunner.query(
      `ALTER TABLE "wagers" DROP CONSTRAINT "FK_wagers_winner"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wagers" DROP CONSTRAINT "FK_wagers_player_b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wagers" DROP CONSTRAINT "FK_wagers_player_a"`,
    );

    await queryRunner.query(`DROP TABLE "wagers"`);

    await queryRunner.query(`DROP TYPE "public"."wager_status_enum"`);
  }
}
