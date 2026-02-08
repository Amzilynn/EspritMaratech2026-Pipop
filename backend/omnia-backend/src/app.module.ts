import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BeneficiairesModule } from './beneficiaires/beneficiaires.module';
import { VisitsModule } from './visits/visits.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { OcrModule } from './ocr/ocr.module';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { ResourcesModule } from './resources/resources.module';
import { PlanningModule } from './planning/planning.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '0000',
      database: process.env.DB_NAME || 'omnia_db',
      autoLoadEntities: true,
      synchronize: true, // Be careful with this in production
    }),
    UsersModule,
    BeneficiairesModule,
    VisitsModule,
    AuditModule,
    AuthModule,
    OcrModule,
    IntelligenceModule,
    ResourcesModule,
    PlanningModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
