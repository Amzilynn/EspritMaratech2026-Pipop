import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VisitBeneficiaire } from './visit-beneficiaire.entity';

@Entity('visits')
export class Visit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    date: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @ManyToOne(() => User, (user) => user.visits, { onDelete: 'SET NULL' })
    user: User;

    @OneToMany(() => VisitBeneficiaire, (vb) => vb.visit, { cascade: true })
    visitBeneficiaires: VisitBeneficiaire[];
}
