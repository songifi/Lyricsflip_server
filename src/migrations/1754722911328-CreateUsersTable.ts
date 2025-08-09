import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1754722911328 implements MigrationInterface {
    name = 'CreateUsersTable1754722911328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "username" character varying NOT NULL, "name" character varying(255), "passwordHash" character varying NOT NULL, "xp" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLoginAt" TIMESTAMP, "role" character varying(20) NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "lyrics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "artist" character varying NOT NULL, "songTitle" character varying NOT NULL, "genre" "public"."lyrics_genre_enum" NOT NULL DEFAULT 'Other', "decade" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid, CONSTRAINT "UQ_39199a2ed0b32fe3e32c1201913" UNIQUE ("content"), CONSTRAINT "UQ_3aae76a3d3748ee1e91ae525e5e" UNIQUE ("artist"), CONSTRAINT "UQ_f9be8b83b46bd9e45e2ed9a4465" UNIQUE ("songTitle"), CONSTRAINT "PK_f7c5de22ef94f309591c5554f0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lyrics" ADD CONSTRAINT "FK_11b6fbc73460d1fc82acf848400" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lyrics" DROP CONSTRAINT "FK_11b6fbc73460d1fc82acf848400"`);
        await queryRunner.query(`DROP TABLE "lyrics"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
