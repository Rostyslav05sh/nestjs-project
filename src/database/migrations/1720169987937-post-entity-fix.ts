import { MigrationInterface, QueryRunner } from "typeorm";

export class PostEntityFix1720169987937 implements MigrationInterface {
    name = 'PostEntityFix1720169987937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."posts_brand_enum" RENAME TO "posts_brand_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."posts_brand_enum" AS ENUM('bmw', 'daewoo')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "brand" TYPE "public"."posts_brand_enum" USING "brand"::"text"::"public"."posts_brand_enum"`);
        await queryRunner.query(`DROP TYPE "public"."posts_brand_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."brands_brand_enum" RENAME TO "brands_brand_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."brands_brand_enum" AS ENUM('bmw', 'daewoo')`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "brand" TYPE "public"."brands_brand_enum" USING "brand"::"text"::"public"."brands_brand_enum"`);
        await queryRunner.query(`DROP TYPE "public"."brands_brand_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."brands_brand_enum_old" AS ENUM('bmv', 'daewoo')`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "brand" TYPE "public"."brands_brand_enum_old" USING "brand"::"text"::"public"."brands_brand_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."brands_brand_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."brands_brand_enum_old" RENAME TO "brands_brand_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."posts_brand_enum_old" AS ENUM('bmv', 'daewoo')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "brand" TYPE "public"."posts_brand_enum_old" USING "brand"::"text"::"public"."posts_brand_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."posts_brand_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."posts_brand_enum_old" RENAME TO "posts_brand_enum"`);
    }

}
