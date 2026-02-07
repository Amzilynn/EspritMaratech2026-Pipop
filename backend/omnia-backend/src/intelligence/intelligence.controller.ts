import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { IntelligenceService } from './intelligence.service';
import {
  VulnerabilityScoreResponseDto,
  BatchScoringRequestDto,
  AreaNeedsDto,
  HealthPatternDto,
  MigrationTrendDto,
} from './dto';

@Controller('intelligence')
export class IntelligenceController {
  private readonly logger = new Logger(IntelligenceController.name);

  constructor(private readonly intelligenceService: IntelligenceService) { }

  // ========== Vulnerability Scoring ==========

  /**
   * Calculate vulnerability score for a single beneficiary
   * POST /intelligence/score
   */
  @Post('score')
  @HttpCode(HttpStatus.OK)
  async calculateScore(
    @Body() beneficiary: any,
  ): Promise<VulnerabilityScoreResponseDto> {
    this.logger.log(`Calculating vulnerability score for beneficiary: ${beneficiary.id}`);
    return this.intelligenceService.calculateVulnerabilityScore(beneficiary);
  }

  /**
   * Batch vulnerability scoring
   * POST /intelligence/score/batch
   */
  @Post('score/batch')
  @HttpCode(HttpStatus.OK)
  async batchScore(@Body() request: BatchScoringRequestDto): Promise<any> {
    this.logger.log(`Batch scoring ${request.beneficiaryIds.length} beneficiaries`);
    return this.intelligenceService.batchCalculateVulnerabilityScores(
      request.beneficiaryIds.map((id) => ({ id })),
    );
  }

  /**
   * Get vulnerability score for a beneficiary
   * GET /intelligence/score/:beneficiaryId
   */
  @Get('score/:beneficiaryId')
  async getScore(
    @Param('beneficiaryId') beneficiaryId: string,
  ): Promise<VulnerabilityScoreResponseDto> {
    this.logger.log(`Fetching vulnerability score for beneficiary: ${beneficiaryId}`);
    return this.intelligenceService.getVulnerabilityScore(beneficiaryId);
  }

  /**
   * Get all vulnerability scores with optional filters
   * GET /intelligence/scores?riskLevel=CRITICAL&limit=10
   */
  @Get('scores')
  async getScores(
    @Query('riskLevel') riskLevel?: string,
    @Query('minScore') minScore?: string,
    @Query('maxScore') maxScore?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<{
    data: VulnerabilityScoreResponseDto[];
    total: number;
  }> {
    this.logger.log('Fetching vulnerability scores with filters');
    return this.intelligenceService.getVulnerabilityScores({
      riskLevel,
      minScore: minScore ? parseFloat(minScore) : undefined,
      maxScore: maxScore ? parseFloat(maxScore) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  // ========== Predictions ==========

  /**
   * Predict area resource needs
   * POST /intelligence/predict/area-needs
   */
  @Post('predict/area-needs')
  @HttpCode(HttpStatus.OK)
  async predictAreaNeeds(
    @Body() payload: { beneficiariesByArea: Record<string, any[]> },
  ): Promise<AreaNeedsDto[]> {
    this.logger.log('Predicting area resource needs');
    return this.intelligenceService.predictAreaNeeds(payload.beneficiariesByArea);
  }

  /**
   * Detect health patterns and outbreak risks
   * POST /intelligence/predict/health-patterns
   */
  @Post('predict/health-patterns')
  @HttpCode(HttpStatus.OK)
  async detectHealthPatterns(@Body() payload: { beneficiaries: any[] }): Promise<HealthPatternDto[]> {
    this.logger.log(`Detecting health patterns for ${payload.beneficiaries.length} beneficiaries`);
    return this.intelligenceService.detectHealthPatterns(payload.beneficiaries);
  }

  /**
   * Analyze migration trends
   * POST /intelligence/predict/migration-trends
   */
  @Post('predict/migration-trends')
  @HttpCode(HttpStatus.OK)
  async analyzeMigrationTrends(
    @Body() payload: { beneficiaries: any[] },
  ): Promise<MigrationTrendDto> {
    this.logger.log(
      `Analyzing migration trends for ${payload.beneficiaries.length} beneficiaries`,
    );
    return this.intelligenceService.analyzeMigrationTrends(payload.beneficiaries);
  }

  // ========== Service Status ==========

  /**
   * Get ML service health status
   * GET /intelligence/health
   */
  @Get('health')
  async getMLServiceHealth(): Promise<any> {
    this.logger.log('Checking ML service health');
    return this.intelligenceService.getMLServiceHealth();
  }

  /**
   * Get ML service information
   * GET /intelligence/info
   */
  @Get('info')
  async getMLServiceInfo(): Promise<any> {
    this.logger.log('Fetching ML service information');
    return this.intelligenceService.getMLServiceInfo();
  }

  /**
   * Get global AI insights across the system
   * GET /intelligence/global-insights
   */
  @Get('global-insights')
  async getGlobalInsights(): Promise<any> {
    this.logger.log('Fetching global AI insights');
    return this.intelligenceService.getGlobalInsights();
  }

  /**
   * Root endpoint
   * GET /intelligence
   */
  @Get()
  getRoot(): any {
    return {
      module: 'Intelligence Module',
      description: 'ML-based beneficiary vulnerability scoring and predictive analytics',
      endpoints: {
        scoring: {
          single: 'POST /intelligence/score',
          batch: 'POST /intelligence/score/batch',
          get: 'GET /intelligence/score/:beneficiaryId',
          list: 'GET /intelligence/scores',
        },
        predictions: {
          areaNeeads: 'POST /intelligence/predict/area-needs',
          healthPatterns: 'POST /intelligence/predict/health-patterns',
          migrationTrends: 'POST /intelligence/predict/migration-trends',
        },
        status: {
          health: 'GET /intelligence/health',
          info: 'GET /intelligence/info',
        },
      },
    };
  }
}
