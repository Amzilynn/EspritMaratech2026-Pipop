import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
const FormData = require('form-data');

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly httpService: HttpService,
    ) { }

    async register(registerDto: any) {
        // ... (keep existing register method)
        console.log('Registering user with DTO:', registerDto);
        const { email, password, firstName, lastName, roleName } = registerDto;

        const existingUser = await this.usersService.findOneByEmail(email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const targetRole = 'CITOYEN';
        const role = await this.usersService.findRoleByName(targetRole);

        if (!role) {
            throw new ConflictException(`Role ${targetRole} not found. Please seed roles first.`);
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

    async enrollFace(userId: string, imageBuffer: Buffer, filename: string) {
        try {
            const formData = new FormData();
            formData.append('file', imageBuffer, { filename });

            const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';
            const response = await firstValueFrom(
                this.httpService.post(`${mlServiceUrl}/face/embed`, formData, {
                    headers: formData.getHeaders(),
                })
            );

            const embedding = response.data.embedding;
            await this.usersService.updateFaceEmbedding(userId, embedding);
            return { message: 'Face enrolled successfully' };
        } catch (error) {
            console.error('Face enrollment error:', error.response?.data || error.message);
            throw new Error('Failed to enroll face');
        }
    }

    async loginWithFace(imageBuffer: Buffer, filename: string) {
        try {
            const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';

            // 1. Get embedding for the login image
            const formData = new FormData();
            formData.append('file', imageBuffer, { filename });

            const embedResponse = await firstValueFrom(
                this.httpService.post(`${mlServiceUrl}/face/embed`, formData, {
                    headers: formData.getHeaders(),
                })
            );
            const targetEmbedding = embedResponse.data.embedding;

            // 2. Get all candidates that have face ID enabled
            const candidates = await this.usersService.findCandidatesForFaceAuth();

            if (!candidates || candidates.length === 0) {
                throw new UnauthorizedException('No users found with Face ID enabled');
            }

            // 3. Match against candidates
            const matchPayload = {
                target_embedding: targetEmbedding,
                candidates: candidates.map(user => ({
                    id: user.id,
                    embedding: user.faceEmbedding
                }))
            };

            const matchResponse = await firstValueFrom(
                this.httpService.post(`${mlServiceUrl}/face/match`, matchPayload)
            );

            if (!matchResponse.data.match_found || !matchResponse.data.best_match) {
                throw new UnauthorizedException('Face not recognized');
            }

            const userId = matchResponse.data.best_match.id;
            const user = candidates.find(u => u.id === userId);

            if (!user) throw new UnauthorizedException('User not found');

            // 4. Generate Token
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
        } catch (error) {
            const errorBody = error.response?.data;
            const detail = errorBody?.detail || errorBody?.message || error.message;
            console.error('Face login error:', detail);
            if (error instanceof UnauthorizedException) throw error;
            throw new UnauthorizedException('Face authentication failed: ' + detail);
        }
    }
}
