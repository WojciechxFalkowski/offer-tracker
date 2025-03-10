import { Car } from 'src/car/car.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('tracked_urls')
export class TrackedUrl {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'longtext' })
    url: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Car, (car) => car.trackedUrl, { cascade: true })
    offers: Car[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
