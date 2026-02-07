import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('resources')
export class Resource {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    category: string; // Food, Medical, Clothing, Hygiene, etc.

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    quantity: number;

    @Column()
    unit: string; // kg, liters, units, boxes

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    minThreshold: number; // For low stock alerts

    @Column({ nullable: true })
    location: string; // E.g., Warehouse A, Shelf B-12

    @Column({ type: 'date', nullable: true })
    expiryDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
