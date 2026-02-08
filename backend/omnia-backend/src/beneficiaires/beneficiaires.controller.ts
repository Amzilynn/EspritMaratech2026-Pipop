                                                                                    import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BeneficiairesService } from './beneficiaires.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('beneficiaires')
export class BeneficiairesController {
    constructor(private readonly beneficiairesService: BeneficiairesService) { }

    @Roles('BENEVOLE', 'ADMIN') // Volunteers can create
    @Post()
    create(@Body() createDto: any) {
        return this.beneficiairesService.create(createDto);
    }

    @Roles('BENEVOLE', 'RESPONSABLE_TERRAIN', 'ADMIN')
    @Get()
    findAll() {
        return this.beneficiairesService.findAll();
    }

    @Roles('BENEVOLE', 'RESPONSABLE_TERRAIN', 'ADMIN')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.beneficiairesService.findOne(id);
    }

    @Roles('BENEVOLE', 'RESPONSABLE_TERRAIN', 'ADMIN')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.beneficiairesService.update(id, updateDto);
    }

    @Roles('ADMIN') // Only Admin can delete/archive according to table
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.beneficiairesService.remove(id);
    }
}
