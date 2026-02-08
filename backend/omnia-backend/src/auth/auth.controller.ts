import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: any) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: any) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('face-enroll')
    @UseInterceptors(FileInterceptor('file'))
    async faceEnroll(@Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.authService.enrollFace(req.user.userId, file.buffer, file.originalname);
    }

    @Post('face-login')
    @UseInterceptors(FileInterceptor('file'))
    async faceLogin(@UploadedFile() file: Express.Multer.File) {
        return this.authService.loginWithFace(file.buffer, file.originalname);
    }
}
