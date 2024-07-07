import { MigrationInterface, QueryRunner } from "typeorm";

export class AddViewTable1720267329033 implements MigrationInterface {
    name = 'AddViewTable1720267329033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid, CONSTRAINT "PK_c2a8a36a99453e5ac5ddf15cbf7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "region" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_views" ADD CONSTRAINT "FK_a05ca4e99f3345db11cfe91ee6e" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_views" DROP CONSTRAINT "FK_a05ca4e99f3345db11cfe91ee6e"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "region"`);
        await queryRunner.query(`DROP TABLE "post_views"`);
    }

}
