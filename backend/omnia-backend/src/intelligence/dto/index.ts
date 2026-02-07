import { IsString, IsNumber, IsOptional, Min, Max, IsDateString } from 'class-validator';

export class CreateVulnerabilityScoreDto {
  @IsString()
  beneficiaryId: string;

  @IsNumber()
  @Min(0)
  @Max(40)
  economicFactor: number;

  @IsNumber()
  @Min(0)
  @Max(30)
  healthFactor: number;

  @IsNumber()
  @Min(0)
  @Max(20)
  socialFactor: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  urgencyFactor: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  vulnerabilityScore: number;

  @IsString()
  riskLevel: string;

  @IsOptional()
  recommendations?: string[];
}

export class VulnerabilityScoreResponseDto {
  id: string;
  beneficiaryId: string;
  vulnerabilityScore: number;
  economicFactor: number;
  healthFactor: number;
  socialFactor: number;
  urgencyFactor: number;
  riskLevel: string;
  recommendations: string[];
  calculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class BatchScoringRequestDto {
  @IsString({ each: true })
  beneficiaryIds: string[];
}

export class AreaNeedsDto {
  area: string;
  totalFamilies: number;
  avgVulnerabilityScore: number;
  criticalRiskFamilies: number;
  highRiskFamilies: number;
  foodAidNeeded: number;
  medicalAidNeeded: number;
  housingInterventionsNeeded: number;
}

export class HealthPatternDto {
  type: string;
  condition: string;
  affectedFamilies: number;
  familyIds: string[];
  riskProbability: number;
  recommendation: string;
  detectedAt: Date;
}

export class MigrationTrendDto {
  totalAnalyzed: number;
  internalDisplacement: number;
  externalMigrants: number;
  returnees: number;
  trendAnalysis: string;
}
