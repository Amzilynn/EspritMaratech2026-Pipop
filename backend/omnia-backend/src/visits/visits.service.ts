import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from './entities/visit.entity';
import { VisitBeneficiaire } from './entities/visit-beneficiaire.entity';
import { Aid } from './entities/aid.entity';

@Injectable()
export class VisitsService {
    constructor(
        @InjectRepository(Visit)
        private readonly visitRepository: Repository<Visit>,
        @InjectRepository(VisitBeneficiaire)
        private readonly vbRepository: Repository<VisitBeneficiaire>,
        @InjectRepository(Aid)
        private readonly aidRepository: Repository<Aid>,
    ) { }

    async createVisit(loggedUser: any, visitData: any) {
        console.log('Creating visit for user:', loggedUser.userId);
        const { notes, associations } = visitData;

        try {
            // 1. Create the Visit - Map userId from token to user entity id
            const visit = this.visitRepository.create({
                notes,
                user: { id: loggedUser.userId } as any
            });
            const savedVisit = await this.visitRepository.save(visit);
            console.log('Visit saved:', savedVisit.id);

            // 2. Create Visit-Beneficiary associations and their Aids
            const associationsCreated: any[] = [];
            for (const assoc of associations) {
                const vb = this.vbRepository.create({
                    visit: savedVisit,
                    beneficiaire: { id: assoc.beneficiaryId } as any,
                });
                const savedVb = await this.vbRepository.save(vb);

                const aidsCreated: any[] = [];
                if (assoc.aids && assoc.aids.length > 0) {
                    for (const aidData of assoc.aids) {
                        const aid = this.aidRepository.create({
                            ...aidData,
                            visitBeneficiaire: savedVb,
                        });
                        aidsCreated.push(await this.aidRepository.save(aid));
                    }
                }
                associationsCreated.push({ ...savedVb, aids: aidsCreated });
            }

            return { ...savedVisit, visitBeneficiaires: associationsCreated };
        } catch (error) {
            console.error('ERROR IN createVisit:', error);
            throw error;
        }
    }

    async findAll() {
        return this.visitRepository.find({
            relations: {
                user: true,
                visitBeneficiaires: {
                    beneficiaire: true,
                    aids: true
                }
            },
        });
    }

    async findOne(id: string) {
        const visit = await this.visitRepository.findOne({
            where: { id },
            relations: {
                user: true,
                visitBeneficiaires: {
                    beneficiaire: true,
                    aids: true
                }
            },
        });
        if (!visit) throw new NotFoundException('Visit not found');
        return visit;
    }

    async updateVisit(id: string, updateData: any) {
        const visit = await this.findOne(id);
        Object.assign(visit, updateData);
        return this.visitRepository.save(visit);
    }

    async deleteVisit(id: string) {
        const visit = await this.findOne(id);
        return this.visitRepository.remove(visit);
    }

    // Aid Management
    async updateAid(aidId: string, aidData: any) {
        const aid = await this.aidRepository.findOne({ where: { id: aidId } });
        if (!aid) throw new NotFoundException('Aid not found');
        Object.assign(aid, aidData);
        return this.aidRepository.save(aid);
    }

    async deleteAid(aidId: string) {
        const aid = await this.aidRepository.findOne({ where: { id: aidId } });
        if (!aid) throw new NotFoundException('Aid not found');
        return this.aidRepository.remove(aid);
    }

    async findAllAids() {
        return this.aidRepository.find({
            relations: {
                visitBeneficiaire: {
                    beneficiaire: true,
                    visit: {
                        user: true
                    }
                }
            },
            order: {
                dateDistribution: 'DESC'
            }
        });
    }
}
