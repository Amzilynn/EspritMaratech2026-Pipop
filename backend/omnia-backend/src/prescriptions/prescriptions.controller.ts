import { Controller, Post, Get, Body, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrescriptionsService } from './prescriptions.service';

@Controller('prescriptions')
export class PrescriptionsController {
    constructor(private readonly prescriptionsService: PrescriptionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('scan')
    @UseInterceptors(FileInterceptor('file'))
    async scanPrescription(
        @UploadedFile() file: Express.Multer.File,
        @Body('notes') notes: string,
        @Request() req
    ) {
        return this.prescriptionsService.scanAndSave(file, req.user.userId, notes);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-prescriptions')
    async getMyPrescriptions(@Request() req) {
        return this.prescriptionsService.findByUser(req.user.userId);
    }
}
