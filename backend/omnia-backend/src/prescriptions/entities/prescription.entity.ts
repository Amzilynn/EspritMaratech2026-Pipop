import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('prescriptions')
export class Prescription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    extractedText: string;

    @Column({ type: 'text', nullable: true })
    imageUrl: string | null;

    @Column({ type: 'varchar', length: 500, nullable: true })
    notes: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;
}
