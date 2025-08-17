import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMultiplayerSupportToGameSessions1755077436000
  implements MigrationInterface
{
  name = 'AddMultiplayerSupportToGameSessions1755077436000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."game_mode_enum" AS ENUM('single_player', 'multiplayer', 'wagered')
    `);

    await queryRunner.query(`
      ALTER TYPE "public"."game_session_status_enum" 
      ADD VALUE 'waiting_for_player'
    `);

    await queryRunner.query(`
      ALTER TABLE "game_sessions" 
      ADD COLUMN "playerTwoId" uuid,
      ADD COLUMN "playerTwoScore" integer NOT NULL DEFAULT 0,
      ADD COLUMN "mode" "public"."game_mode_enum" NOT NULL DEFAULT 'single_player',
      ADD COLUMN "winnerId" uuid,
      ADD COLUMN "wagerAmount" integer,
      ADD COLUMN "hasWager" boolean NOT NULL DEFAULT false,
      ADD COLUMN "completedAt" TIMESTAMP
    `);

    await queryRunner.query(`
      ALTER TABLE "game_sessions" 
      ADD CONSTRAINT "FK_game_sessions_player_two" 
      FOREIGN KEY ("playerTwoId") REFERENCES "users"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "game_sessions" 
      ADD CONSTRAINT "FK_game_sessions_winner" 
      FOREIGN KEY ("winnerId") REFERENCES "users"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "game_sessions" 
      DROP CONSTRAINT "FK_game_sessions_winner"
    `);

    await queryRunner.query(`
      ALTER TABLE "game_sessions" 
      DROP CONSTRAINT "FK_game_sessions_player_two"
    `);

    await queryRunner.query(`
      ALTER TABLE "game_sessions" 
      DROP COLUMN "completedAt",
      DROP COLUMN "hasWager",
      DROP COLUMN "wagerAmount",
      DROP COLUMN "winnerId",
      DROP COLUMN "mode",
      DROP COLUMN "playerTwoScore",
      DROP COLUMN "playerTwoId"
    `);

    await queryRunner.query(`DROP TYPE "public"."game_mode_enum"`);
  }
}
