import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('car_specifications')
export class CarSpecification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    fuelType: string;

    @Column({ nullable: true })
    engineCapacity: string;

    @Column({ nullable: true })
    power: string;

    @Column({ nullable: true })
    bodyType: string;

    @Column({ nullable: true })
    gearbox: string;

    @Column({ nullable: true })
    drive: string;

    @Column({ nullable: true })
    mileage: string;
}
