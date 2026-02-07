import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from './entities/audit.entity';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(Audit)
        private readonly auditRepository: Repository<Audit>,
    ) { }

    async logAction(user: any, action: string, entity: string, oldValue?: any, newValue?: any) {
        const audit = this.auditRepository.create({
            user,
            action,
            entity,
            oldValue,
            newValue,
        });
        return this.auditRepository.save(audit);
    }

    async findAll() {
        return this.auditRepository.find({
            relations: ['user'],
            order: { timestamp: 'DESC' },
        });
    }
}
