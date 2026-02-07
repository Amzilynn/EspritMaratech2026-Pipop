import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Resource } from './resources/entities/resource.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

async function seedResources() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const resourceRepo = app.get<Repository<Resource>>(getRepositoryToken(Resource));

    const resources = [
        { name: 'Doliprane 1000mg', category: 'Medical', quantity: 50, unit: 'Boxes', minThreshold: 100, location: 'Shelf A1' },
        { name: 'Gomrin 2mg', category: 'Medical', quantity: 15, unit: 'Boxes', minThreshold: 50, location: 'Shelf A2' },
        { name: 'Couscous 1kg', category: 'Food', quantity: 500, unit: 'kg', minThreshold: 200, location: 'Pallet B1' },
        { name: 'Huile d\'olive 1L', category: 'Food', quantity: 100, unit: 'liters', minThreshold: 150, location: 'Pallet B2' },
        { name: 'Lait', category: 'Food', quantity: 0, unit: 'liters', minThreshold: 100, location: 'Fridge 1' },
    ];

    for (const res of resources) {
        const resource = resourceRepo.create(res);
        await resourceRepo.save(resource);
    }

    console.log('Warehouse seeded with 5 items (including low-stock and out-of-stock items)');
    await app.close();
}

seedResources();
