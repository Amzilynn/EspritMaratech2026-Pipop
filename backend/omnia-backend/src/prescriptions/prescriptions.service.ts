import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
const FormData = require('form-data');

@Injectable()
export class PrescriptionsService {
    constructor(
        @InjectRepository(Prescription)
        private prescriptionRepository: Repository<Prescription>,
        private readonly httpService: HttpService,
    ) { }

    async scanAndSave(file: Express.Multer.File, userId: string, notes?: string): Promise<Prescription> {
        if (!file) {
            throw new HttpException('Aucun fichier fourni', HttpStatus.BAD_REQUEST);
        }

        try {
            // Call ML service OCR endpoint
            const formData = new FormData();
            formData.append('file', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });

            const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';
            const response = await firstValueFrom(
                this.httpService.post(`${mlServiceUrl}/ocr/extract`, formData, {
                    headers: formData.getHeaders(),
                })
            );

            const extractedText = response.data.text || '';

            // Save to database
            return await this.prescriptionRepository.save({
                extractedText,
                notes: notes || null,
                userId,
                imageUrl: null,
            });
        } catch (error) {
            console.error('Error scanning prescription:', error);
            throw new HttpException(
                'Erreur lors du scan de l\'ordonnance',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findByUser(userId: string): Promise<Prescription[]> {
        return this.prescriptionRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
}
