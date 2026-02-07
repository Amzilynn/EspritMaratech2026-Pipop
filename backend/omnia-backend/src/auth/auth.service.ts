import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: any) {
        const { email, password, firstName, lastName, roleName } = registerDto;

        const existingUser = await this.usersService.findOneByEmail(email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await this.usersService.findRoleByName(roleName || 'BENEVOLE');

        if (!role) {
            throw new ConflictException('Role not found. Please seed roles first.');
        }

        const user = await this.usersService.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
        });

        const { password: _, ...result } = user;
        return result;
    }

    async login(loginDto: any) {
        const { email, password } = loginDto;
        const user = await this.usersService.findOneByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = { email: user.email, sub: user.id, role: user.role.name };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role.name,
                }
            };
        }
        throw new UnauthorizedException('Invalid credentials');
    }
}
