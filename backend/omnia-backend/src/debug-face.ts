import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    console.log('--- Checking Face ID Status ---');
    const candidates = await usersService.findCandidatesForFaceAuth();
    console.log(`Found ${candidates.length} candidates with Face ID enabled.`);

    candidates.forEach(u => {
        console.log(`User: ${u.email} (${u.id})`);
        console.log(`- Face Embedding: ${u.faceEmbedding ? 'PRESENT (' + u.faceEmbedding.length + ' values)' : 'MISSING'}`);
    });

    await app.close();
}

bootstrap();
