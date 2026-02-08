import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Beneficiaire } from './entities/beneficiaire.entity';

@Injectable()
export class BeneficiairesService {
    constructor(
        @InjectRepository(Beneficiaire)
        private readonly beneficiaireRepository: Repository<Beneficiaire>,
    ) { }

    async create(createDto: any): Promise<Beneficiaire> {
        const beneficiaire = this.beneficiaireRepository.create(createDto);
        return this.beneficiaireRepository.save(beneficiaire as any);
    }

    async findAll(currentUser: any) {
        const isAdmin = currentUser.role === 'ADMIN';
        const isResponsable = currentUser.role === 'RESPONSABLE_TERRAIN';
        const isBenevole = currentUser.role === 'BENEVOLE';

        console.log(`[DEBUG] Beneficiaires.findAll called by ${currentUser.role} (ID: ${currentUser.userId})`);

        const query: any = {
            where: { active: true },
            relations: ['responsable']
        };

        if (isAdmin) {
            // Admin sees all
        } else if (isResponsable) {
            // Responsable sees families assigned to them OR their subordinates
            query.where = [
                { active: true, responsable: { id: currentUser.userId } },
                { active: true, responsable: { responsable: { id: currentUser.userId } } }
            ];
            console.log(`[DEBUG] Applying Responsable filter: own + subordinates`);
        } else if (isBenevole) {
            // Benevole sees only their assigned families
            query.where = { active: true, responsable: { id: currentUser.userId } };
            console.log(`[DEBUG] Applying Benevole filter: own only`);
        }

        const results = await this.beneficiaireRepository.find(query);
        console.log(`[DEBUG] Beneficiaires.findAll returning ${results.length} items`);
        return results;
    }

    async findOne(id: string): Promise<Beneficiaire> {
        const beneficiaire = await this.beneficiaireRepository.findOne({ where: { id } });
        if (!beneficiaire) {
            throw new NotFoundException(`Beneficiaire with ID ${id} not found`);
        }
        return beneficiaire;
    }

    async update(id: string, updateDto: any, currentUser: any): Promise<Beneficiaire> {
        const beneficiaire = await this.findOne(id);

        // Authorization check
        const isAdmin = currentUser.role === 'ADMIN';
        const isOwner = beneficiaire.responsable?.id === currentUser.userId;
        const isTheirResponsable = (beneficiaire.responsable as any)?.responsableId === currentUser.userId;

        if (!isAdmin && !isOwner && !isTheirResponsable) {
            throw new ForbiddenException('You do not have permission to update this beneficiary');
        }

        Object.assign(beneficiaire, updateDto);
        return this.beneficiaireRepository.save(beneficiaire as any);
    }

    async remove(id: string): Promise<void> {
        const beneficiaire = await this.findOne(id);
        beneficiaire.active = false; // Soft delete
        await this.beneficiaireRepository.save(beneficiaire);
    }
}
