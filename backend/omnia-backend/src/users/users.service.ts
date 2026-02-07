import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) { }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['role'],
            select: ['id', 'email', 'password', 'firstName', 'lastName'] // Ensure password is selected for auth
        });
    }

    async create(userData: Partial<User>): Promise<User> {
        // Generate UUID manually if not provided (workaround for DB not having uuid_generate_v4())
        const userWithId = {
            ...userData,
            id: userData.id || randomUUID()
        };

        console.log('Creating user with data:', {
            ...userWithId,
            password: '[REDACTED]',
            responsable: userWithId.responsable ? { id: (userWithId.responsable as any).id } : null
        });

        const user = this.usersRepository.create(userWithId);
        const savedUser = await this.usersRepository.save(user);

        console.log('User saved with ID:', savedUser.id, 'responsableId:', (savedUser as any).responsableId);

        return savedUser;
    }

    async findRoleByName(name: string): Promise<Role | null> {
        return this.rolesRepository.findOne({ where: { name } });
    }

    async findAllRoles(): Promise<Role[]> {
        return this.rolesRepository.find();
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            relations: ['role', 'responsable']
        });
    }

    async findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['role', 'responsable']
        });
    }

    async update(id: string, userData: any): Promise<User> {
        const user = await this.findOne(id);
        if (!user) throw new Error('User not found');

        const { responsableId, roleName, ...rest } = userData;

        if (responsableId) {
            user.responsable = await this.findOne(responsableId) as any;
        } else if (responsableId === null) {
            user.responsable = null as any;
        }

        if (roleName) {
            const role = await this.findRoleByName(roleName.toUpperCase());
            if (role) user.role = role;
        }

        Object.assign(user, rest);
        return this.usersRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async seedRoles() {
        const roles = ['ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE', 'CITOYEN'];
        for (const roleName of roles) {
            const existingRole = await this.findRoleByName(roleName);
            if (!existingRole) {
                await this.rolesRepository.save({ name: roleName });
            }
        }
    }
}
