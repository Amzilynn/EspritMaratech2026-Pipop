import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { IntelligenceService } from './intelligence.service';
import { IntelligenceController } from './intelligence.controller';
import { VulnerabilityScore } from './entities/vulnerability-score.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VulnerabilityScore]),
    HttpModule.register({
      timeout: 30000, // 30 second timeout
      maxRedirects: 5,
    }),
  ],
  providers: [IntelligenceService],
  controllers: [IntelligenceController],
  exports: [IntelligenceService], // Export for use in other modules
})
export class IntelligenceModule {}
