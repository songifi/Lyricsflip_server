import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToUserEmail1754626322434 implements MigrationInterface {
    name = 'AddIndexToUserEmail1754626322434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
    }

}
