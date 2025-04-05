import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTrackedUrlRelation1712320000000 implements MigrationInterface {
    name = 'RemoveTrackedUrlRelation1712320000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First check if the column exists
        const columnExists = await queryRunner.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'cars' 
            AND COLUMN_NAME = 'trackedUrlId'
        `);

        if (columnExists.length > 0) {
            // Get the actual foreign key name
            const foreignKey = await queryRunner.query(`
                SELECT CONSTRAINT_NAME 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_NAME = 'cars' 
                AND COLUMN_NAME = 'trackedUrlId' 
                AND REFERENCED_TABLE_NAME = 'tracked_urls'
            `);

            if (foreignKey.length > 0) {
                // Drop foreign key constraint
                await queryRunner.query(`ALTER TABLE \`cars\` DROP FOREIGN KEY \`${foreignKey[0].CONSTRAINT_NAME}\``);
            }

            // Drop the column
            await queryRunner.query(`ALTER TABLE \`cars\` DROP COLUMN \`trackedUrlId\``);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add the column back
        await queryRunner.query(`ALTER TABLE \`cars\` ADD \`trackedUrlId\` int NULL`);

        // Add foreign key constraint back
        await queryRunner.query(`ALTER TABLE \`cars\` ADD CONSTRAINT \`FK_cars_trackedUrlId\` FOREIGN KEY (\`trackedUrlId\`) REFERENCES \`tracked_urls\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
} 