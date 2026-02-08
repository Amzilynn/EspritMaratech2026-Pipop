import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

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

    async create(userData: any, currentUser?: any): Promise<User> {
        let { roleName, responsableId, password, ...rest } = userData;

        // Generate UUID manually
        const id = userData.id || randomUUID();

        // Hash password if not already hashed (very basic check)
        if (password && !password.startsWith('$2b$')) {
            password = await bcrypt.hash(password, 10);
        }

        let role = userData.role;
        if (roleName && !role) {
            role = await this.findRoleByName(roleName.toUpperCase());
        }

        let responsable = userData.responsable;
        if (responsableId && !responsable) {
            responsable = await this.findOne(responsableId);
        }

        // Auto-assign responsable if a Responsable creates a user
        if (!responsable && currentUser && currentUser.role === 'RESPONSABLE_TERRAIN') {
            responsable = await this.findOne(currentUser.userId);
            console.log(`[UsersService] Auto-assigning responsible ${currentUser.userId} to new user`);
        }

        const user = this.usersRepository.create({
            ...rest,
            id,
            password,
            role,
            responsable
        }) as any;

        return this.usersRepository.save(user);
    }

    async findRoleByName(name: string): Promise<Role | null> {
        return this.rolesRepository.findOne({ where: { name } });
    }

    async findAllRoles(): Promise<Role[]> {
        return this.rolesRepository.find();
    }

    async findAll(currentUser: any): Promise<User[]> {
        const isAdmin = currentUser.role === 'ADMIN';
        console.log(`[DEBUG] Users.findAll called by ${currentUser.role} (ID: ${currentUser.userId})`);

        const filter: any = {
            relations: ['role', 'responsable']
        };

        if (!isAdmin) {
            filter.where = [
                { responsable: { id: currentUser.userId } },
                { id: currentUser.userId }
            ];
            console.log(`[DEBUG] Filter applied: (responsable.id = ${currentUser.userId} OR id = ${currentUser.userId})`);
        }

        const users = await this.usersRepository.find(filter);
        console.log(`[DEBUG] Returning ${users.length} users`);
        return users;
    }

    async findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['role', 'responsable']
        });
    }

    async update(id: string, userData: any, currentUser: any): Promise<User> {
        const user = await this.findOne(id);
        if (!user) throw new Error('User not found');

        // Authorization Check
        const isSelf = currentUser.userId === user.id;
        const isAdmin = currentUser.role === 'ADMIN';
        const isTheirResponsable = user.responsable?.id === currentUser.userId;

        if (!isAdmin && !isSelf && !isTheirResponsable) {
            throw new ForbiddenException('You do not have permission to update this user');
        }

        const { responsableId, roleName, ...rest } = userData;

        if (responsableId && isAdmin) { // Only Admin can change responsable
            user.responsable = await this.findOne(responsableId) as any;
        } else if (responsableId === null && isAdmin) {
            user.responsable = null as any;
        }

        if (roleName && isAdmin) { // Only Admin can change role
            const role = await this.findRoleByName(roleName.toUpperCase());
            if (role) user.role = role;
        }

        Object.assign(user, rest);
        return this.usersRepository.save(user);
    }

    async remove(id: string, currentUser: any): Promise<void> {
        const user = await this.findOne(id);
        if (!user) throw new Error('User not found');

        const isAdmin = currentUser.role === 'ADMIN';
        const isTheirResponsable = user.responsable?.id === currentUser.userId;

        if (!isAdmin && !isTheirResponsable) {
            throw new ForbiddenException('You do not have permission to delete this user');
        }

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

    async findCandidatesForFaceAuth(): Promise<User[]> {
        return this.usersRepository.find({
            where: { faceIdEnabled: true },
            select: ['id', 'email', 'faceEmbedding', 'firstName', 'lastName'],
            relations: ['role']
        });
    }

    async updateFaceEmbedding(id: string, embedding: number[]): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new Error('User not found');
        user.faceEmbedding = embedding;
        user.faceIdEnabled = true;
        return this.usersRepository.save(user);
    }
}
