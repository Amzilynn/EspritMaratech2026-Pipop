import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planning } from './entities/planning.entity';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { UsersModule } from '../users/users.module';
import { BeneficiairesModule } from '../beneficiaires/beneficiaires.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Planning]),
        UsersModule,
        BeneficiairesModule
    ],
    providers: [PlanningService],
    controllers: [PlanningController],
    exports: [PlanningService],
})
export class PlanningModule { }
