import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';
import { MedicationRecord } from './entities/medication-record.entity';
import { AuditModule } from '../audit/audit.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        TypeOrmModule.forFeature([MedicationRecord]),
        AuditModule,
        HttpModule,
    ],
    controllers: [OcrController],
    providers: [OcrService],
    exports: [OcrService],
})
export class OcrModule { }
