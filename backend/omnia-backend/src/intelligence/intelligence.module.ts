import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { IntelligenceService } from './intelligence.service';
import { IntelligenceController } from './intelligence.controller';
import { VulnerabilityScore } from './entities/vulnerability-score.entity';
import { Beneficiaire } from '../beneficiaires/entities/beneficiaire.entity';
import { MedicationRecord } from '../ocr/entities/medication-record.entity';
import { Resource } from '../resources/entities/resource.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VulnerabilityScore,
      Beneficiaire,
      MedicationRecord,
      Resource,
    ]),
    HttpModule.register({
      timeout: 30000, // 30 second timeout
      maxRedirects: 5,
    }),
  ],
  providers: [IntelligenceService],
  controllers: [IntelligenceController],
  exports: [IntelligenceService], // Export for use in other modules
})
export class IntelligenceModule { }
