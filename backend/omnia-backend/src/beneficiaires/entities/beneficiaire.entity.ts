import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VisitBeneficiaire } from '../../visits/entities/visit-beneficiaire.entity';

@Entity('beneficiaires')
export class Beneficiaire {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    codeFamille: string;

    @Column({ nullable: true })
    telephone: string;

    @Column({ default: 1 })
    nbMembres: number;

    @Column({ default: 0 })
    nbEnfants: number;

    @Column({ default: 0 })
    nbPersonnesAgees: number;

    @Column({ default: 0 })
    nbHandicapes: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    revenuMensuel: number;

    @Column({ nullable: true })
    typeLogement: string; // Propriétaire, Locataire, Précaire

    @Column({ nullable: true })
    statutSocial: string; // Chômage, Retraité, Ouvrier, etc.

    @Column({ type: 'text', nullable: true })
    situationSociale: string;

    @Column({ default: true })
    active: boolean;

    @OneToMany(() => VisitBeneficiaire, (visitBeneficiaire) => visitBeneficiaire.beneficiaire)
    visitBeneficiaires: VisitBeneficiaire[];
}
