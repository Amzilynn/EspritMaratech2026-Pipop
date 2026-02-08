import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visits')
export class VisitsController {
    constructor(private readonly visitsService: VisitsService) { }

    @Roles('BENEVOLE', 'ADMIN') // Volunteers record visits
    @Post()
    async create(@Body() createVisitDto: any, @Request() req: any) {
        return this.visitsService.createVisit(req.user, createVisitDto);
    }

    @Roles('BENEVOLE', 'RESPONSABLE_TERRAIN', 'ADMIN')
    @Get()
    async findAll() {
        return this.visitsService.findAll();
    }

    @Roles('BENEVOLE', 'RESPONSABLE_TERRAIN', 'ADMIN')
    @Get('aids/all')
    async findAllAids() {
        return this.visitsService.findAllAids();
    }

    @Roles('BENEVOLE', 'RESPONSABLE_TERRAIN', 'ADMIN')
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.visitsService.findOne(id);
    }

    @Roles('RESPONSABLE_TERRAIN', 'ADMIN') // Validation/Correction by managers
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.visitsService.updateVisit(id, updateDto);
    }

    @Roles('ADMIN') // Oversight delete
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.visitsService.deleteVisit(id);
    }

    // Individual Aid Endpoints
    @Roles('BENEVOLE', 'RESPONSABLE_TERRAIN', 'ADMIN')
    @Patch('aids/:aidId')
    async updateAid(@Param('aidId') aidId: string, @Body() aidDto: any) {
        return this.visitsService.updateAid(aidId, aidDto);
    }

    @Roles('ADMIN')
    @Delete('aids/:aidId')
    async removeAid(@Param('aidId') aidId: string) {
        return this.visitsService.deleteAid(aidId);
    }
}
