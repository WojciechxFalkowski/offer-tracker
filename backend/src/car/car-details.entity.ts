import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('car_details')
export class CarDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column({ nullable: true })
    version: string;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    doorCount: string;

    @Column({ nullable: true })
    seatCount: string;

    @Column({ nullable: true })
    productionYear: string;

    @Column({ nullable: true })
    generation: string;

    @Column({ nullable: true, unique: true })
    vin: string;
}
