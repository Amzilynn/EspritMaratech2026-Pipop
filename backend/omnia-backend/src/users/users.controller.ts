import { Controller, Get, Post, UseGuards, Param, Patch, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    async create(@Body() createUserDto: any) {
        try {
            console.log('Admin creating user:', createUserDto);
            const { roleName, responsableId, password, ...rest } = createUserDto;

            if (!roleName) throw new Error('roleName is required');

            const role = await this.usersService.findRoleByName(roleName.toUpperCase());
            if (!role) throw new Error(`Role ${roleName} not found in database`);

            console.log('Found role:', role.name);

            const hashedPassword = await bcrypt.hash(password || 'password123', 10);

            let responsable: any = null;
            if (responsableId) {
                console.log('Searching for responsable with ID:', responsableId);
                responsable = await this.usersService.findOne(responsableId);
                if (!responsable) console.warn('Responsable not found for ID:', responsableId);
            }

            const newUser = await this.usersService.create({
                ...rest,
                password: hashedPassword,
                role,
                responsable,
            });

            console.log('User created successfully:', newUser.id);
            return newUser;
        } catch (error: any) {
            console.error('Error creating user:', error);
            throw error;
        }
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'RESPONSABLE_TERRAIN')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.usersService.update(id, updateDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
