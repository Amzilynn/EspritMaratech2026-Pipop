import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { VisitBeneficiaire } from './entities/visit-beneficiaire.entity';
import { Aid } from './entities/aid.entity';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Visit, VisitBeneficiaire, Aid])],
    providers: [VisitsService],
    controllers: [VisitsController],
    exports: [VisitsService],
})
export class VisitsModule { }
