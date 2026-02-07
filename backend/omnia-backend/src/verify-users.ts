import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    const users = await usersService.findAll();
    console.log('START_USERS_LIST');
    for (const u of users) {
        console.log(`USER_DATA|${u.id}|${u.email}|${u.firstName}|${u.lastName}|${u.role?.name}`);
    }
    console.log('END_USERS_LIST');
    await app.close();
}
bootstrap();
