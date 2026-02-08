import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('planning')
export class PlanningController {
    constructor(private readonly planningService: PlanningService) { }

    @Roles('ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE')
    @Get()
    findAll(@Request() req: any) {
        return this.planningService.findAll(req.user);
    }

    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Post()
    create(@Body() createDto: any) {
        return this.planningService.create(createDto);
    }

    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.planningService.update(id, updateDto);
    }

    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.planningService.remove(id);
    }
}
