import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from './entities/planning.entity';
import { UsersService } from '../users/users.service';
import { BeneficiairesService } from '../beneficiaires/beneficiaires.service';

@Injectable()
export class PlanningService {
    constructor(
        @InjectRepository(Planning)
        private readonly planningRepository: Repository<Planning>,
        private readonly usersService: UsersService,
        private readonly beneficiairesService: BeneficiairesService,
    ) { }

    async findAll(currentUser: any): Promise<Planning[]> {
        const isAdmin = currentUser.role === 'ADMIN';

        const query: any = {
            relations: ['assignedBenevole', 'beneficiaire', 'assignedBenevole.responsable'],
            order: { dateTournee: 'ASC' }
        };

        if (!isAdmin) {
            // Filter by ownership: if the assigned benevole is the user OR if the assigned benevole reports to the user
            return this.planningRepository.createQueryBuilder('planning')
                .leftJoinAndSelect('planning.assignedBenevole', 'benevole')
                .leftJoinAndSelect('benevole.responsable', 'responsable')
                .leftJoinAndSelect('planning.beneficiaire', 'beneficiaire')
                .where('planning.assignedBenevole = :userId', { userId: currentUser.userId })
                .orWhere('benevole.responsable = :userId', { userId: currentUser.userId })
                .orderBy('planning.dateTournee', 'ASC')
                .getMany();
        }

        return this.planningRepository.find(query);
    }

    async create(createDto: any): Promise<Planning> {
        console.log('[PlanningService] Creating planning with:', createDto);
        const { assignedBenevoleId, beneficiaireId, ...rest } = createDto;

        const planning = this.planningRepository.create(rest) as any;

        if (assignedBenevoleId) {
            planning.assignedBenevole = await this.usersService.findOne(assignedBenevoleId);
        }

        if (beneficiaireId) {
            planning.beneficiaire = await this.beneficiairesService.findOne(beneficiaireId);
        }

        return this.planningRepository.save(planning);
    }

    async update(id: string, updateDto: any): Promise<Planning> {
        await this.planningRepository.update(id, updateDto);
        const updated = await this.planningRepository.findOne({
            where: { id },
            relations: ['assignedBenevole', 'beneficiaire']
        });
        if (!updated) throw new Error('Planning not found');
        return updated;
    }

    async remove(id: string): Promise<void> {
        await this.planningRepository.delete(id);
    }
}
