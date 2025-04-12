import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShortenedUrlToCars1744471266805 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Make externalId nullable first
        await queryRunner.query(`ALTER TABLE cars MODIFY COLUMN externalId VARCHAR(255) NULL;`);

        // Add shortenedUrl column
        await queryRunner.query(`ALTER TABLE cars ADD COLUMN shortenedUrl VARCHAR(255) NULL;`);

        // Copy data from externalId to shortenedUrl
        await queryRunner.query(`UPDATE cars SET shortenedUrl = externalId;`);

        // Clear externalId
        await queryRunner.query(`UPDATE cars SET externalId = NULL;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Copy data back from shortenedUrl to externalId
        await queryRunner.query(`UPDATE cars SET externalId = shortenedUrl;`);

        // Drop shortenedUrl column
        await queryRunner.query(`ALTER TABLE cars DROP COLUMN shortenedUrl;`);
    }

}
