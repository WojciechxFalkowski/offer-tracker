import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCarPriceHistoryAndIsActive1744405539544 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add isActive column to cars table
        await queryRunner.query(`ALTER TABLE cars ADD COLUMN isActive BOOLEAN NOT NULL DEFAULT TRUE`);

        // Create car_price_history table
        await queryRunner.query(`
            CREATE TABLE car_price_history (
                id INT NOT NULL AUTO_INCREMENT,
                carId INT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                FOREIGN KEY (carId) REFERENCES cars(id) ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop car_price_history table
        await queryRunner.query(`DROP TABLE car_price_history`);

        // Remove isActive column from cars table
        await queryRunner.query(`ALTER TABLE cars DROP COLUMN isActive`);
    }

}
