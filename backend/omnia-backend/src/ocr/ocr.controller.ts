import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ocr')
export class OcrController {
    constructor(private readonly ocrService: OcrService) { }

    /**
     * Upload an image to extract medication data
     */
    @UseGuards(JwtAuthGuard)
    @Post('analyze')
    @UseInterceptors(FileInterceptor('image'))
    async analyze(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Image file is required (form-data field: "image")');
        }

        // Validate file type
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            throw new BadRequestException('Only JPG and PNG images are supported');
        }

        return this.ocrService.analyzeImage(file.buffer);
    }

    /**
     * Save confirmed medication data after human validation
     */
    @UseGuards(JwtAuthGuard)
    @Post('confirm')
    async confirm(@Body() body: any, @Request() req: any) {
        if (!body.beneficiaryId || !body.medications) {
            throw new BadRequestException('beneficiaryId and medications are required');
        }

        return this.ocrService.saveConfirmedData(req.user, body);
    }
}
