import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Beneficiaire } from '../../beneficiaires/entities/beneficiaire.entity';
import { Visit } from '../../visits/entities/visit.entity';

@Entity('medication_records')
export class MedicationRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    rawOcrText: string;

    @Column({ type: 'jsonb' })
    medications: any; // Array of structured medication data

    @Column({ nullable: true })
    imageUrl: string; // Reference to stored image if needed

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User)
    createdBy: User;

    @ManyToOne(() => Beneficiaire)
    beneficiaire: Beneficiaire;

    @ManyToOne(() => Visit, { nullable: true })
    visit: Visit;
}
