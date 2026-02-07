import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourcesService {
    constructor(
        @InjectRepository(Resource)
        private readonly resourceRepository: Repository<Resource>,
    ) { }

    async create(data: Partial<Resource>): Promise<Resource> {
        const resource = this.resourceRepository.create(data);
        return this.resourceRepository.save(resource);
    }

    async findAll(): Promise<Resource[]> {
        return this.resourceRepository.find({ order: { category: 'ASC', name: 'ASC' } });
    }

    async findOne(id: string): Promise<Resource> {
        const resource = await this.resourceRepository.findOne({ where: { id } });
        if (!resource) throw new NotFoundException('Resource not found');
        return resource;
    }

    async update(id: string, data: Partial<Resource>): Promise<Resource> {
        await this.findOne(id);
        await this.resourceRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const resource = await this.findOne(id);
        await this.resourceRepository.remove(resource);
    }

    async getLowStockItems(): Promise<Resource[]> {
        return this.resourceRepository
            .createQueryBuilder('resource')
            .where('resource.quantity <= resource.minThreshold')
            .getMany();
    }
}
