import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { VisitBeneficiaire } from './visit-beneficiaire.entity';

@Entity('aids')
export class Aid {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string; // medicament, food, etc.

    @Column({ nullable: true })
    natureIntervention: string; // Distribution, Consultation, Support

    @Column({ default: false })
    isRecurring: boolean;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    valeurEstimee: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateDistribution: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantite: number;

    @Column({ nullable: true })
    unite: string;

    @ManyToOne(() => VisitBeneficiaire, (vb) => vb.aids, { onDelete: 'CASCADE' })
    visitBeneficiaire: VisitBeneficiaire;
}
