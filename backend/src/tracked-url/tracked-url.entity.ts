import {
    Column,
    CreateDateColumn,
    Entity,
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

    @Column({ nullable: true })
    brand: string;

    @Column({ nullable: true })
    model: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
