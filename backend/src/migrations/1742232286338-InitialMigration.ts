import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1742232286338 implements MigrationInterface {
    name = 'InitialMigration1742232286338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tracked_urls\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` longtext NOT NULL, \`description\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`car_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`brand\` varchar(255) NOT NULL, \`model\` varchar(255) NOT NULL, \`version\` varchar(255) NULL, \`color\` varchar(255) NULL, \`doorCount\` varchar(255) NULL, \`seatCount\` varchar(255) NULL, \`productionYear\` varchar(255) NULL, \`generation\` varchar(255) NULL, \`vin\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`car_specifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fuelType\` varchar(255) NULL, \`engineCapacity\` varchar(255) NULL, \`power\` varchar(255) NULL, \`bodyType\` varchar(255) NULL, \`gearbox\` varchar(255) NULL, \`drive\` varchar(255) NULL, \`mileage\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cars\` (\`id\` int NOT NULL AUTO_INCREMENT, \`externalId\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`price\` int NULL, \`pricee\` int NULL, \`priceee\` varchar(255) NULL, \`url\` varchar(255) NOT NULL, \`publishedDate\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`trackedUrlId\` int NULL, \`detailsId\` int NULL, \`specificationId\` int NULL, UNIQUE INDEX \`IDX_f3938b07f37132df20288c3fa7\` (\`externalId\`), UNIQUE INDEX \`IDX_24413af4620d16b50c4d127da6\` (\`url\`), UNIQUE INDEX \`REL_140778b240787b412a24b2972d\` (\`detailsId\`), UNIQUE INDEX \`REL_e80c1cfc74965cf923a89f9952\` (\`specificationId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`car_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`imageUrl\` longtext NOT NULL, \`offerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`cars\` ADD CONSTRAINT \`FK_c40a5dd7d73920a42c20a49e262\` FOREIGN KEY (\`trackedUrlId\`) REFERENCES \`tracked_urls\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cars\` ADD CONSTRAINT \`FK_140778b240787b412a24b2972d1\` FOREIGN KEY (\`detailsId\`) REFERENCES \`car_details\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cars\` ADD CONSTRAINT \`FK_e80c1cfc74965cf923a89f9952b\` FOREIGN KEY (\`specificationId\`) REFERENCES \`car_specifications\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`car_images\` ADD CONSTRAINT \`FK_4c2b5b6ac2e384f2ec034ea6c39\` FOREIGN KEY (\`offerId\`) REFERENCES \`cars\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car_images\` DROP FOREIGN KEY \`FK_4c2b5b6ac2e384f2ec034ea6c39\``);
        await queryRunner.query(`ALTER TABLE \`cars\` DROP FOREIGN KEY \`FK_e80c1cfc74965cf923a89f9952b\``);
        await queryRunner.query(`ALTER TABLE \`cars\` DROP FOREIGN KEY \`FK_140778b240787b412a24b2972d1\``);
        await queryRunner.query(`ALTER TABLE \`cars\` DROP FOREIGN KEY \`FK_c40a5dd7d73920a42c20a49e262\``);
        await queryRunner.query(`DROP TABLE \`car_images\``);
        await queryRunner.query(`DROP INDEX \`REL_e80c1cfc74965cf923a89f9952\` ON \`cars\``);
        await queryRunner.query(`DROP INDEX \`REL_140778b240787b412a24b2972d\` ON \`cars\``);
        await queryRunner.query(`DROP INDEX \`IDX_24413af4620d16b50c4d127da6\` ON \`cars\``);
        await queryRunner.query(`DROP INDEX \`IDX_f3938b07f37132df20288c3fa7\` ON \`cars\``);
        await queryRunner.query(`DROP TABLE \`cars\``);
        await queryRunner.query(`DROP TABLE \`car_specifications\``);
        await queryRunner.query(`DROP TABLE \`car_details\``);
        await queryRunner.query(`DROP TABLE \`tracked_urls\``);
    }

}
