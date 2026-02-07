import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn } from 'typeorm';
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

    // Vulnerability Score Fields
    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    vulnerabilityScore: number; // 0-100 Overall score

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    economicFactor: number; // Income per capita factor (0-40)

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    healthFactor: number; // Health & medication factor (0-30)

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    socialFactor: number; // Housing & migration (0-20)

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    urgencyFactor: number; // Time since last aid (0-10)

    @Column({ type: 'integer', default: 0 })
    medicalVisitsCount: number; // Total medical visits/consultations

    @Column({ type: 'integer', default: 0 })
    medicationRecordsCount: number; // Total medication records from OCR

    @Column({ nullable: true })
    migrationStatus: string; // Internal/External/Returnee/None

    @Column({ nullable: true })
    healthConditions: string; // Chronic diseases, infectious diseases, etc.

    @Column({ type: 'timestamp', nullable: true })
    lastAidDistributionDate: Date; // Last time aid was given

    @Column({ type: 'json', nullable: true })
    healthConcerns: any; // Array of detected health concerns from OCR

    @UpdateDateColumn()
    scoreLastUpdated: Date;

    @OneToMany(() => VisitBeneficiaire, (visitBeneficiaire) => visitBeneficiaire.beneficiaire)
    visitBeneficiaires: VisitBeneficiaire[];
}
