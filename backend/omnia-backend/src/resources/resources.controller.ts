import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { Resource } from './entities/resource.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('resources')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) { }

    @Post()
    @Roles('ADMIN', 'COORDINATOR')
    create(@Body() data: Partial<Resource>) {
        return this.resourcesService.create(data);
    }

    @Get()
    findAll() {
        return this.resourcesService.findAll();
    }

    @Get('low-stock')
    getLowStock() {
        return this.resourcesService.getLowStockItems();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.resourcesService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'COORDINATOR')
    update(@Param('id') id: string, @Body() data: Partial<Resource>) {
        return this.resourcesService.update(id, data);
    }

    @Delete(':id')
    @Roles('ADMIN')
    remove(@Param('id') id: string) {
        return this.resourcesService.remove(id);
    }
}
