import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Visit } from './visit.entity';
import { Beneficiaire } from '../../beneficiaires/entities/beneficiaire.entity';
import { Aid } from './aid.entity';

@Entity('visit_beneficiaires')
export class VisitBeneficiaire {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Visit, (visit) => visit.visitBeneficiaires, { onDelete: 'CASCADE' })
    visit: Visit;

    @ManyToOne(() => Beneficiaire, (b) => b.visitBeneficiaires)
    beneficiaire: Beneficiaire;

    @OneToMany(() => Aid, (aid) => aid.visitBeneficiaire, { cascade: true })
    aids: Aid[];
}
