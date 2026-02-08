import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Beneficiaire } from '../../beneficiaires/entities/beneficiaire.entity';

@Entity('planning')
export class Planning {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    dateTournee: string;

    @Column({ nullable: true })
    zone: string;

    @Column({ default: 'Planifiée' }) // Planifiée, Effectuée, Annulée
    status: string;

    @ManyToOne(() => User, { nullable: true })
    assignedBenevole: User;

    @ManyToOne(() => Beneficiaire, { nullable: true })
    beneficiaire: Beneficiaire;

    @CreateDateColumn()
    createdAt: Date;
}
