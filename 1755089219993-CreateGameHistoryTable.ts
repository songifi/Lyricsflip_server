import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGameHistoryTable1755089219993 implements MigrationInterface {
    name = 'CreateGameHistoryTable1755089219993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."game_sessions_category_enum" AS ENUM('Afrobeats', '90s R&B', 'Hip Hop', 'Pop', 'Rock')`);
        await queryRunner.query(`CREATE TYPE "public"."game_sessions_mode_enum" AS ENUM('single_player', 'multiplayer', 'wagered')`);
        await queryRunner.query(`CREATE TYPE "public"."game_sessions_status_enum" AS ENUM('waiting_for_player', 'in_progress', 'completed', 'abandoned')`);
        await queryRunner.query(`CREATE TABLE "game_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "playerTwoId" uuid, "score" integer NOT NULL DEFAULT '0', "playerTwoScore" integer NOT NULL DEFAULT '0', "category" "public"."game_sessions_category_enum" NOT NULL, "mode" "public"."game_sessions_mode_enum" NOT NULL DEFAULT 'single_player', "status" "public"."game_sessions_status_enum" NOT NULL DEFAULT 'in_progress', "winnerId" uuid, "wagerAmount" integer, "hasWager" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "completedAt" TIMESTAMP, "playerId" uuid, CONSTRAINT "PK_e25fa82d55744e55000c3288fdc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_leveltitle_enum" AS ENUM('Gossip Rookie', 'Word Whisperer', 'Lyric Sniper', 'Bar Genius', 'Gossip God')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "username" character varying NOT NULL, "name" character varying(255), "passwordHash" character varying NOT NULL, "xp" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '1', "levelTitle" "public"."users_leveltitle_enum" NOT NULL DEFAULT 'Gossip Rookie', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLoginAt" TIMESTAMP, "role" character varying(20) NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, "mockTokenBalance" integer NOT NULL DEFAULT '100', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."wagers_status_enum" AS ENUM('pending', 'staked', 'won', 'lost', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "wagers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionId" uuid NOT NULL, "playerAId" uuid NOT NULL, "playerBId" uuid NOT NULL, "amount" integer NOT NULL, "totalPot" integer NOT NULL, "status" "public"."wagers_status_enum" NOT NULL DEFAULT 'pending', "winnerId" uuid, "resultMessage" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "resolvedAt" TIMESTAMP, CONSTRAINT "PK_2a22416f9356af58909ae940bb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."lyrics_genre_enum" AS ENUM('Afrobeats', 'Hip-Hop', 'Pop', 'Other')`);
        await queryRunner.query(`CREATE TABLE "lyrics" ("id" SERIAL NOT NULL, "content" text NOT NULL, "artist" character varying NOT NULL, "lyricSnippet" text NOT NULL, "songTitle" character varying(200) NOT NULL, "category" character varying(50), "genre" "public"."lyrics_genre_enum" NOT NULL DEFAULT 'Other', "decade" character varying(10) NOT NULL, "difficulty" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "timesUsed" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid NOT NULL, CONSTRAINT "UQ_4f0ed33e3fa900864b7523c5563" UNIQUE ("artist", "songTitle"), CONSTRAINT "PK_f7c5de22ef94f309591c5554f0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d14fb81820a5ebfc89df735201" ON "lyrics" ("category") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2d5f0b6948cd8f9c8b288e483" ON "lyrics" ("genre") `);
        await queryRunner.query(`CREATE INDEX "IDX_acaad25bc17807f76cea53b163" ON "lyrics" ("decade") `);
        await queryRunner.query(`CREATE TYPE "public"."game_history_guesstype_enum" AS ENUM('artist', 'songTitle')`);
        await queryRunner.query(`CREATE TABLE "game_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "playerId" uuid NOT NULL, "lyricId" integer NOT NULL, "gameSessionId" uuid, "guessType" "public"."game_history_guesstype_enum" NOT NULL, "guessValue" character varying(200) NOT NULL, "isCorrect" boolean NOT NULL, "pointsAwarded" integer NOT NULL DEFAULT '0', "xpChange" integer NOT NULL DEFAULT '0', "wagerAmount" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0e74b90c56b815ed54e90a29f1a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_54d592c33eee3f06a10aee8634" ON "game_history" ("playerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ed6f230775ab9828edf585b6fe" ON "game_history" ("lyricId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f9154e4f1451ad1bf37732d23" ON "game_history" ("gameSessionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d37db6e0872941f431472c64d1" ON "game_history" ("isCorrect") `);
        await queryRunner.query(`CREATE INDEX "IDX_2b2126d153baaa3f5c73f0c0ca" ON "game_history" ("createdAt") `);
        await queryRunner.query(`ALTER TABLE "game_sessions" ADD CONSTRAINT "FK_15cde5fb27498c38d3e6be4192b" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_sessions" ADD CONSTRAINT "FK_dc0de8724b56bcde2bed53228cf" FOREIGN KEY ("playerTwoId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_sessions" ADD CONSTRAINT "FK_05fc1fa1e3c6d734c07ea753aa6" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wagers" ADD CONSTRAINT "FK_23053e7556c275c08c36cc6e7ab" FOREIGN KEY ("playerAId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wagers" ADD CONSTRAINT "FK_9a822637150835af40ce9ea7a56" FOREIGN KEY ("playerBId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wagers" ADD CONSTRAINT "FK_eea91b8d8ca8f757286d9b6e031" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lyrics" ADD CONSTRAINT "FK_11b6fbc73460d1fc82acf848400" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_history" ADD CONSTRAINT "FK_54d592c33eee3f06a10aee86348" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_history" ADD CONSTRAINT "FK_ed6f230775ab9828edf585b6fee" FOREIGN KEY ("lyricId") REFERENCES "lyrics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_history" ADD CONSTRAINT "FK_8f9154e4f1451ad1bf37732d230" FOREIGN KEY ("gameSessionId") REFERENCES "game_sessions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_history" DROP CONSTRAINT "FK_8f9154e4f1451ad1bf37732d230"`);
        await queryRunner.query(`ALTER TABLE "game_history" DROP CONSTRAINT "FK_ed6f230775ab9828edf585b6fee"`);
        await queryRunner.query(`ALTER TABLE "game_history" DROP CONSTRAINT "FK_54d592c33eee3f06a10aee86348"`);
        await queryRunner.query(`ALTER TABLE "lyrics" DROP CONSTRAINT "FK_11b6fbc73460d1fc82acf848400"`);
        await queryRunner.query(`ALTER TABLE "wagers" DROP CONSTRAINT "FK_eea91b8d8ca8f757286d9b6e031"`);
        await queryRunner.query(`ALTER TABLE "wagers" DROP CONSTRAINT "FK_9a822637150835af40ce9ea7a56"`);
        await queryRunner.query(`ALTER TABLE "wagers" DROP CONSTRAINT "FK_23053e7556c275c08c36cc6e7ab"`);
        await queryRunner.query(`ALTER TABLE "game_sessions" DROP CONSTRAINT "FK_05fc1fa1e3c6d734c07ea753aa6"`);
        await queryRunner.query(`ALTER TABLE "game_sessions" DROP CONSTRAINT "FK_dc0de8724b56bcde2bed53228cf"`);
        await queryRunner.query(`ALTER TABLE "game_sessions" DROP CONSTRAINT "FK_15cde5fb27498c38d3e6be4192b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b2126d153baaa3f5c73f0c0ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d37db6e0872941f431472c64d1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f9154e4f1451ad1bf37732d23"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ed6f230775ab9828edf585b6fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54d592c33eee3f06a10aee8634"`);
        await queryRunner.query(`DROP TABLE "game_history"`);
        await queryRunner.query(`DROP TYPE "public"."game_history_guesstype_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_acaad25bc17807f76cea53b163"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a2d5f0b6948cd8f9c8b288e483"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d14fb81820a5ebfc89df735201"`);
        await queryRunner.query(`DROP TABLE "lyrics"`);
        await queryRunner.query(`DROP TYPE "public"."lyrics_genre_enum"`);
        await queryRunner.query(`DROP TABLE "wagers"`);
        await queryRunner.query(`DROP TYPE "public"."wagers_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_leveltitle_enum"`);
        await queryRunner.query(`DROP TABLE "game_sessions"`);
        await queryRunner.query(`DROP TYPE "public"."game_sessions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."game_sessions_mode_enum"`);
        await queryRunner.query(`DROP TYPE "public"."game_sessions_category_enum"`);
    }

}
