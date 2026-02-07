import { Injectable, NotFoundException } from '@nestjs/common';
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

    async findAll() {
        return this.beneficiaireRepository.find({ where: { active: true } });
    }

    async findOne(id: string): Promise<Beneficiaire> {
        const beneficiaire = await this.beneficiaireRepository.findOne({ where: { id } });
        if (!beneficiaire) {
            throw new NotFoundException(`Beneficiaire with ID ${id} not found`);
        }
        return beneficiaire;
    }

    async update(id: string, updateDto: any): Promise<Beneficiaire> {
        const beneficiaire = await this.findOne(id);
        Object.assign(beneficiaire, updateDto);
        return this.beneficiaireRepository.save(beneficiaire as any);
    }

    async remove(id: string): Promise<void> {
        const beneficiaire = await this.findOne(id);
        beneficiaire.active = false; // Soft delete
        await this.beneficiaireRepository.save(beneficiaire);
    }
}
