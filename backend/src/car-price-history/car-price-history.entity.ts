import { Car } from '@/car/car.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('car_price_history')
export class CarPriceHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    carId: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Car, car => car.priceHistory)
    @JoinColumn({ name: 'carId' })
    car: Car;
} 