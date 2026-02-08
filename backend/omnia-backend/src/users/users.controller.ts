import { Controller, Get, Post, UseGuards, Param, Patch, Delete, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Get()
    findAll(@Request() req: any) {
        return this.usersService.findAll(req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Post()
    async create(@Body() createUserDto: any, @Request() req: any) {
        return this.usersService.create(createUserDto, req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Get('roles')
    findAllRoles() {
        return this.usersService.findAllRoles();
    }

    @Get('seed-roles')
    async seedRoles() {
        await this.usersService.seedRoles();
        return { message: 'Roles seeded successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        const user = await this.usersService.findOne(req.user.userId);
        if (!user) return null;
        return {
            ...user,
            role: user.role?.name || user.role
        };
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(@Body() updateDto: any, @Request() req: any) {
        return this.usersService.update(req.user.userId, updateDto, req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: any, @Request() req: any) {
        return this.usersService.update(id, updateDto, req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req: any) {
        return this.usersService.remove(id, req.user);
    }
}
