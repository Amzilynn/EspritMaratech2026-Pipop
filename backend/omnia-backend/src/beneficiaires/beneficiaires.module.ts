import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Beneficiaire } from './entities/beneficiaire.entity';
import { BeneficiairesService } from './beneficiaires.service';
import { BeneficiairesController } from './beneficiaires.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Beneficiaire])],
    providers: [BeneficiairesService],
    controllers: [BeneficiairesController],
    exports: [BeneficiairesService],
})
export class BeneficiairesModule { }
