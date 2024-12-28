import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1735345476154 implements MigrationInterface {
    name = 'Default1735345476154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "documents" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "path" nvarchar(255) NOT NULL, "folderId" int, "studentId" int, CONSTRAINT "UQ_ac51aa5181ee2036f5ca482857c" UNIQUE ("id"), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "folders" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "parentFolderId" int, "studentId" int, CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "userId" int, CONSTRAINT "UQ_7d7f07271ad4ce999880713f05e" UNIQUE ("id"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_e0208b4f964e609959aff431bf" ON "students" ("userId") WHERE "userId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "teachers" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "subject" nvarchar(255) NOT NULL, "userId" int, CONSTRAINT "UQ_a8d4f83be3abe4c687b0a0093c8" UNIQUE ("id"), CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_4d8041cbc103a5142fa2f2afad" ON "teachers" ("userId") WHERE "userId" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_cf0a9fa48053d1f93da40713cc1" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_c4e6583ef1c84c8999ef780296c" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_d33cb81c88bba50eacc6eb26951" FOREIGN KEY ("parentFolderId") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_87b6abe77c833048fea9ab578b8" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_e0208b4f964e609959aff431bf9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teachers" ADD CONSTRAINT "FK_4d8041cbc103a5142fa2f2afad4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teachers" DROP CONSTRAINT "FK_4d8041cbc103a5142fa2f2afad4"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_e0208b4f964e609959aff431bf9"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_87b6abe77c833048fea9ab578b8"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_d33cb81c88bba50eacc6eb26951"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_c4e6583ef1c84c8999ef780296c"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_cf0a9fa48053d1f93da40713cc1"`);
        await queryRunner.query(`DROP INDEX "REL_4d8041cbc103a5142fa2f2afad" ON "teachers"`);
        await queryRunner.query(`DROP TABLE "teachers"`);
        await queryRunner.query(`DROP INDEX "REL_e0208b4f964e609959aff431bf" ON "students"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "folders"`);
        await queryRunner.query(`DROP TABLE "documents"`);
    }

}
