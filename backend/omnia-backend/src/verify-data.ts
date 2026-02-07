import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Beneficiaire } from './beneficiaires/entities/beneficiaire.entity';
import { Resource } from './resources/entities/resource.entity';
import { MedicationRecord } from './ocr/entities/medication-record.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

async function verifyData() {
    try {
        const app = await NestFactory.createApplicationContext(AppModule);

        const beneficiaryRepo = app.get<Repository<Beneficiaire>>(getRepositoryToken(Beneficiaire));
        const resourceRepo = app.get<Repository<Resource>>(getRepositoryToken(Resource));
        const ocrRepo = app.get<Repository<MedicationRecord>>(getRepositoryToken(MedicationRecord));

        const bCount = await beneficiaryRepo.count();
        const rCount = await resourceRepo.count();
        const oCount = await ocrRepo.count();

        console.log(`--- DATA VERIFICATION ---`);
        console.log(`Beneficiaries: ${bCount}`);
        console.log(`Resources: ${rCount}`);
        console.log(`OCR Records: ${oCount}`);

        await app.close();
    } catch (e) {
        console.error('FAILED TO VERIFY:', e.message);
    }
}

verifyData();
