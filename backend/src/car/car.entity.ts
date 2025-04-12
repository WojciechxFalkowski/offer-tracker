import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { CarDetails } from './car-details.entity';
import { CarImage } from './car-image.entity';
import { CarSpecification } from './car-specification.entity';
import { CarPriceHistory } from '@/car-price-history/car-price-history.entity';

@Entity('cars')
export class Car {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    externalId: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    price: number;

    @Column({ unique: true })
    url: string;

    @Column({ type: 'datetime', nullable: true })
    publishedDate: Date | null;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relacja 1:1 do szczegółów samochodu
    @OneToOne(() => CarDetails, { cascade: true, eager: true })
    @JoinColumn()
    details: CarDetails;

    // Relacja 1:1 do specyfikacji technicznej samochodu
    @OneToOne(() => CarSpecification, { cascade: true, eager: true })
    @JoinColumn()
    specification: CarSpecification;

    // Relacja 1:N do obrazów samochodu
    @OneToMany(() => CarImage, (image) => image.offer, { cascade: true, eager: true })
    images: CarImage[];

    // Relacja 1:N do historii cen
    @OneToMany(() => CarPriceHistory, priceHistory => priceHistory.car)
    priceHistory: CarPriceHistory[];
}
