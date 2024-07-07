import { MigrationInterface, QueryRunner } from "typeorm";

export class EditedRole1720124614862 implements MigrationInterface {
    name = 'EditedRole1720124614862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."posts_brand_enum" RENAME TO "posts_brand_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."posts_brand_enum" AS ENUM('BMW', 'DAEWOO')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "brand" TYPE "public"."posts_brand_enum" USING "brand"::"text"::"public"."posts_brand_enum"`);
        await queryRunner.query(`DROP TYPE "public"."posts_brand_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('customer', 'seller', 'carDealershipManager', 'manager', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."brands_brand_enum" RENAME TO "brands_brand_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."brands_brand_enum" AS ENUM('BMW', 'DAEWOO')`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "brand" TYPE "public"."brands_brand_enum" USING "brand"::"text"::"public"."brands_brand_enum"`);
        await queryRunner.query(`DROP TYPE "public"."brands_brand_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."brands_brand_enum_old" AS ENUM('bmw', 'daewoo')`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "brand" TYPE "public"."brands_brand_enum_old" USING "brand"::"text"::"public"."brands_brand_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."brands_brand_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."brands_brand_enum_old" RENAME TO "brands_brand_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('customer', 'seller', 'carDealershipManager', 'manager', 'admin,')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."posts_brand_enum_old" AS ENUM('bmw', 'daewoo')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "brand" TYPE "public"."posts_brand_enum_old" USING "brand"::"text"::"public"."posts_brand_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."posts_brand_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."posts_brand_enum_old" RENAME TO "posts_brand_enum"`);
    }

}
