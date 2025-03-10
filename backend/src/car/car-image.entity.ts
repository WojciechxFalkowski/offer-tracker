import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Car } from './car.entity';

@Entity('car_images')
export class CarImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'longtext' })
    imageUrl: string;

    @ManyToOne(() => Car, (offer) => offer.images)
    offer: Car;
}
