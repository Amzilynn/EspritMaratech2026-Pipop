import { Injectable, Logger } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicationRecord } from './entities/medication-record.entity';
import { AuditService } from '../audit/audit.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { createWorker } from 'tesseract.js';
import { findBestMatch } from 'string-similarity';
import FormData from 'form-data';

/**
 * Robust Medical Knowledge Base
 */
const MEDICAL_KNOWLEDGE_BASE = [
    { brand: 'Doliprane', generic: 'Paracétamol', class: 'Analgésique', use: 'Fièvre et douleurs' },
    { brand: 'Aspegic', generic: 'Acétylsalicylate', class: 'Analgésique/AINS', use: 'Douleurs, fièvre' },
    { brand: 'Efferalgan', generic: 'Paracétamol', class: 'Analgésique', use: 'Fièvre et douleurs' },
    { brand: 'Gomrin', generic: 'Glimépiride', class: 'Antidiabétique', use: 'Diabète de type 2' },
    { brand: 'Clamoxyl', generic: 'Amoxicilline', class: 'Antibiotique', use: 'Infections' },
    { brand: 'Augmentin', generic: 'Amoxicilline', class: 'Antibiotique', use: 'Infections' },
    { brand: 'Spasfon', generic: 'Phloroglucinol', class: 'Antispasmodique', use: 'Spasmes' },
    { brand: 'Kardegic', generic: 'Aspirine', class: 'Antiagrégant', use: 'Cardio' },
    { brand: 'Glucophage', generic: 'Metformine', class: 'Antidiabétique', use: 'Diabète' },
    { brand: 'Stagid', generic: 'Metformine', class: 'Antidiabétique', use: 'Diabète' },
];

@Injectable()
export class OcrService {
    private readonly logger = new Logger(OcrService.name);
    private visionClient: ImageAnnotatorClient;
    private readonly mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';

    constructor(
        @InjectRepository(MedicationRecord)
        private readonly medicationRepository: Repository<MedicationRecord>,
        private readonly auditService: AuditService,
        private readonly httpService: HttpService,
    ) {
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            try { this.visionClient = new ImageAnnotatorClient(); } catch (e) { }
        }
    }

    async analyzeImage(imageBuffer: Buffer): Promise<any> {
        let text = '';

        // 1. Try EasyOCR (Python Service) - Preferred "Easy OCR"
        try {
            this.logger.log('Attempting EasyOCR via ML Service...');
            const formData = new FormData();
            formData.append('file', imageBuffer, { filename: 'image.jpg' });

            // Need to get headers from formData to set multipart boundary correctly
            const headers = formData.getHeaders();

            const response = await firstValueFrom(
                this.httpService.post(`${this.mlServiceUrl}/ocr/extract`, formData, {
                    headers: headers,
                    timeout: 10000 // 10s timeout
                })
            );

            if (response.data && response.data.text) {
                text = response.data.text;
                this.logger.log('EasyOCR success');
            }
        } catch (e) {
            this.logger.warn(`EasyOCR failed: ${e.message}. Will try fallback methods.`);
        }

        // 2. Fallback to Google Vision if EasyOCR failed or returned empty
        if (!text && this.visionClient) {
            try {
                this.logger.log('Attempting Google Vision...');
                const [result] = await this.visionClient.textDetection(imageBuffer);
                text = result.fullTextAnnotation?.text || '';
            } catch (e) {
                this.logger.warn(`Google Vision failed: ${e.message}`);
            }
        }

        // 3. Fallback to Tesseract.js (Pure Node/WASM)
        if (!text) {
            try {
                this.logger.log('Attempting Tesseract.js...');
                const worker = await createWorker('fra');
                const { data: { text: tesseractText } } = await worker.recognize(imageBuffer);
                await worker.terminate();
                text = tesseractText;
            } catch (e) {
                this.logger.error(`Tesseract failed: ${e.message}`);
            }
        }

        const detectedMedications = this.extractMedicalEntities(text);
        const enrichedMedications = await Promise.all(
            detectedMedications.map(async (med) => {
                const globalInfo = await this.fetchGlobalDrugData(med.name);
                return { ...med, ...globalInfo };
            })
        );

        return { rawText: text, detectedMedications: enrichedMedications };
    }

    private normalize(str: string): string {
        return str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9]/g, "");    // Remove punctuation/noise
    }

    private extractMedicalEntities(text: string): any[] {
        const lines = text.split('\n');
        const entities: any[] = [];

        // Build a matching pool of brands and generics
        const brandPool = MEDICAL_KNOWLEDGE_BASE.map(k => this.normalize(k.brand));
        const genericPool = MEDICAL_KNOWLEDGE_BASE.map(k => this.normalize(k.generic));

        for (const line of lines) {
            const normalizedLine = this.normalize(line);
            if (normalizedLine.length < 3) continue;

            // 1. Try matching the whole line (collapsed) - Great for fragmented logos like S P E G I C
            const lineMatchBrand = findBestMatch(normalizedLine, brandPool);
            const lineMatchGeneric = findBestMatch(normalizedLine, genericPool);

            let bestMatch = lineMatchBrand.bestMatch.rating > lineMatchGeneric.bestMatch.rating
                ? { rating: lineMatchBrand.bestMatch.rating, index: lineMatchBrand.bestMatchIndex }
                : { rating: lineMatchGeneric.bestMatch.rating, index: lineMatchGeneric.bestMatchIndex };

            if (bestMatch.rating > 0.6) {
                entities.push(this.formatEntity(MEDICAL_KNOWLEDGE_BASE[bestMatch.index], line, bestMatch.rating));
                continue;
            }

            // 2. Word-by-word matching
            const words = line.split(/\s+/).filter(w => w.length >= 4);
            for (const word of words) {
                const normWord = this.normalize(word);
                const wordMatchBrand = findBestMatch(normWord, brandPool);
                const wordMatchGeneric = findBestMatch(normWord, genericPool);

                const bestWord = wordMatchBrand.bestMatch.rating > wordMatchGeneric.bestMatch.rating
                    ? { rating: wordMatchBrand.bestMatch.rating, index: wordMatchBrand.bestMatchIndex }
                    : { rating: wordMatchGeneric.bestMatch.rating, index: wordMatchGeneric.bestMatchIndex };

                if (bestWord.rating > 0.7) {
                    entities.push(this.formatEntity(MEDICAL_KNOWLEDGE_BASE[bestWord.index], line, bestWord.rating));
                    break;
                }
            }
        }

        const uniqueEntities = new Map();
        entities.forEach(e => {
            if (!uniqueEntities.has(e.name) || e.nlpConfidence > uniqueEntities.get(e.name).nlpConfidence) {
                uniqueEntities.set(e.name, e);
            }
        });
        return Array.from(uniqueEntities.values());
    }

    private formatEntity(kbEntry: any, line: string, rating: number) {
        // Match numbers with units (500mg) OR common standalone dosages (500, 1000)
        let dosageMatch = line.match(/(\d+\s*(mg|g|ml|cp|unite|sachet))/i);

        if (!dosageMatch) {
            // Fallback: look for common dosage numbers (100, 250, 500, 1000) if no unit is found
            const standaloneMatch = line.match(/\b(100|250|500|1000)\b/);
            if (standaloneMatch) {
                return {
                    name: kbEntry.brand,
                    genericName: kbEntry.generic,
                    drugClass: kbEntry.class,
                    dosage: standaloneMatch[0] + ' (mg suspected)',
                    frequency: 'À préciser',
                    nlpConfidence: Math.round(rating * 100) / 100
                };
            }
        }

        return {
            name: kbEntry.brand,
            genericName: kbEntry.generic,
            drugClass: kbEntry.class,
            dosage: dosageMatch ? dosageMatch[0].trim() : null,
            frequency: 'À préciser',
            nlpConfidence: Math.round(rating * 100) / 100
        };
    }

    private async fetchGlobalDrugData(medName: string): Promise<any> {
        try {
            const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${medName}"&limit=1`;
            const response = await firstValueFrom(this.httpService.get(url));
            const result = response.data.results?.[0];
            if (result) {
                return { warnings: result.warnings?.[0]?.substring(0, 200) || 'None' };
            }
        } catch (e) { }
        return { warnings: 'No additional info' };
    }

    async saveConfirmedData(user: any, data: any): Promise<MedicationRecord> {
        const record = this.medicationRepository.create({
            createdBy: { id: user.userId || user.sub } as any,
            beneficiaire: { id: data.beneficiaryId } as any,
            visit: data.visitId ? ({ id: data.visitId } as any) : null,
            rawOcrText: data.rawText,
            medications: data.medications,
            imageUrl: data.imageUrl,
        });

        const saved = await this.medicationRepository.save(record);
        await this.auditService.logAction({ id: user.userId || user.sub } as any, 'CONFIRM_OCR', 'MedicationRecord', null, { id: saved.id, beneficiaryId: data.beneficiaryId });
        return saved;
    }
}
