import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovepriceeAndPriceee1742236311073 implements MigrationInterface {
    name = 'RemovepriceeAndPriceee1742236311073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cars\` DROP COLUMN \`pricee\``);
        await queryRunner.query(`ALTER TABLE \`cars\` DROP COLUMN \`priceee\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cars\` ADD \`priceee\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`cars\` ADD \`pricee\` int NULL`);
    }

}
