import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBrandAndModelToTrackedUrl1712320000001 implements MigrationInterface {
    name = 'AddBrandAndModelToTrackedUrl1712320000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tracked_urls\` ADD \`brand\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracked_urls\` ADD \`model\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tracked_urls\` DROP COLUMN \`model\``);
        await queryRunner.query(`ALTER TABLE \`tracked_urls\` DROP COLUMN \`brand\``);
    }
} 