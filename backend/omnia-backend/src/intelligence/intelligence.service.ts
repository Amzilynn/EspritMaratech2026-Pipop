import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Beneficiaire } from '../beneficiaires/entities/beneficiaire.entity';
import { MedicationRecord } from '../ocr/entities/medication-record.entity';
import { Resource } from '../resources/entities/resource.entity';
import { VulnerabilityScore } from './entities/vulnerability-score.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IntelligenceService {
    private readonly logger = new Logger(IntelligenceService.name);

    constructor(
        @InjectRepository(Beneficiaire)
        private readonly beneficiaryRepository: Repository<Beneficiaire>,
        @InjectRepository(MedicationRecord)
        private readonly ocrRepository: Repository<MedicationRecord>,
        @InjectRepository(Resource)
        private readonly resourceRepository: Repository<Resource>,
        @InjectRepository(VulnerabilityScore)
        private readonly vulnerabilityRepo: Repository<VulnerabilityScore>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    private get mlUrl(): string {
        return this.configService.get<string>('ML_SERVICE_URL') || 'http://localhost:8001';
    }



    /**
     * Advanced Vulnerability Scoring Engine
     */
    async calculateAdvancedVulnerabilityScore(b: Beneficiaire) {
        const economic = this.calculateEconomicFactor(b);
        const health = await this.calculateHealthFactor(b);
        const social = this.calculateSocialFactor(b);
        const urgency = await this.calculateUrgencyFactor(b);

        const totalScore = Math.min(economic + health + social + urgency, 100);
        const riskLevel = this.getRiskLevel(totalScore);
        const recommendations = this.generateRecommendations(b, economic, health, social, urgency);

        return {
            totalScore,
            details: { economic, health, social, urgency },
            riskLevel,
            recommendations
        };
    }

    /**
     * 1. ECONOMIC FACTOR (0-40 points)
     */
    private calculateEconomicFactor(b: Beneficiaire): number {
        let factor = 0;

        // Income per capita logic
        const incomePerCapita = b.revenuMensuel
            ? Number(b.revenuMensuel) / (b.nbMembres || 1)
            : 0;

        if (incomePerCapita < 100) factor += 40;
        else if (incomePerCapita < 200) factor += 32;
        else if (incomePerCapita < 350) factor += 24;
        else if (incomePerCapita < 500) factor += 16;
        else if (incomePerCapita < 800) factor += 8;

        // Social status adjustments
        if (b.statutSocial) {
            const status = b.statutSocial.toLowerCase();
            if (status.includes('sans emploi') || status.includes('chômage')) {
                // Already high factor likely, but ensure it captures the risk
                factor = Math.max(factor, 30);
            } else if (status.includes('retraité') || status.includes('migrant')) {
                factor += 5;
            } else if (status.includes('travail informel') || status.includes('informal')) {
                factor += 6;
            } else if (status.includes('ouvrier') || status.includes('worker')) {
                // Slightly reduce if employed but low income
                factor = Math.max(factor - 3, 0);
            }
        }

        return Math.min(Math.round(factor), 40);
    }

    /**
     * 2. HEALTH FACTOR (0-30 points)
     */
    private async calculateHealthFactor(b: Beneficiaire): Promise<number> {
        let factor = 0;

        // Get medication records for this beneficiaire
        const medicationRecords = await this.ocrRepository.find({
            where: { beneficiaire: { id: b.id } },
        });

        if (medicationRecords.length === 0) {
            // Check known conditions if no records
            if (b.healthConditions || b.nbPersonnesAgees > 0 || b.nbHandicapes > 0) {
                // continue to condition checks
            } else {
                return 5; // Minimal concern
            }
        }

        // Base score from number of medical visits
        const visitCount = medicationRecords.length;
        if (visitCount >= 10) factor += 20;
        else if (visitCount >= 5) factor += 15;
        else if (visitCount >= 2) factor += 10;
        else if (visitCount > 0) factor += 5;

        // Analyze medication diversity and severity
        const medicationAnalysis = this.analyzeMedicationSeverity(medicationRecords);
        factor += medicationAnalysis.severityScore;

        // Add points for chronic/serious conditions
        if (b.healthConditions) {
            const conditions = b.healthConditions.toLowerCase();
            if (conditions.includes('diabète') || conditions.includes('diabetes')) factor += 5;
            if (conditions.includes('hypertension') || conditions.includes('cardiac')) factor += 5;
            if (conditions.includes('tuberculose') || conditions.includes('tuberculosis')) factor += 8;
            if (conditions.includes('hiv') || conditions.includes('sida')) factor += 10;
            if (conditions.includes('cancer')) factor += 10;
            if (conditions.includes('paralysie') || conditions.includes('paralysis')) factor += 7;
        }

        // Family composition health risk
        if (b.nbEnfants > 3) factor += 2;
        if (b.nbPersonnesAgees > 0) factor += 3;
        if (b.nbHandicapes > 0) factor += 5;

        return Math.min(Math.round(factor), 30);
    }

    /**
     * 3. SOCIAL FACTOR (0-20 points)
     */
    private calculateSocialFactor(b: Beneficiaire): number {
        let factor = 0;

        // Housing conditions (Max 10 points)
        if (b.typeLogement) {
            const housing = b.typeLogement.toLowerCase();
            if (housing.includes('bidonville') || housing.includes('tente')) {
                factor += 10;
            } else if (housing.includes('précaire') || housing.includes('insalubre')) {
                factor += 8;
            } else if (housing.includes('locataire')) {
                factor += 6;
            } else if (housing.includes('propriétaire')) {
                factor += 1;
            }
        }

        // Migration status (Max 5 points)
        if (b.migrationStatus) {
            const migration = b.migrationStatus.toLowerCase();
            if (migration.includes('returnee') || migration.includes('returning')) factor += 5;
            else if (migration.includes('external') || migration.includes('immigrant')) factor += 4;
            else if (migration.includes('internal')) factor += 2;
        }

        // Family stability indicators (Max 5 points)
        if (b.situationSociale) {
            const situation = b.situationSociale.toLowerCase();
            if (situation.includes('mère célibataire') || situation.includes('single mother')) factor += 5;
            else if (situation.includes('orphelin') || situation.includes('orphan')) factor += 5;
            else if (situation.includes('veuve') || situation.includes('widow')) factor += 4;
            else if (situation.includes('famille nombreuse')) factor += 3;
        }

        return Math.min(Math.round(factor), 20);
    }

    /**
     * 4. URGENCY FACTOR (0-10 points)
     */
    private async calculateUrgencyFactor(b: Beneficiaire): Promise<number> {
        if (!b.lastAidDistributionDate) return 10;

        const daysSinceLastAid = this.daysDifference(b.lastAidDistributionDate, new Date());

        if (daysSinceLastAid > 180) return 10;
        if (daysSinceLastAid > 120) return 8;
        if (daysSinceLastAid > 60) return 6;
        if (daysSinceLastAid > 30) return 4;
        if (daysSinceLastAid > 14) return 2;
        return 1;
    }

    /**
     * Get system insights: priority families, medical trends, resource status
     */
    async getGlobalInsights() {
        const beneficiaries = await this.beneficiaryRepository.find({
            relations: ['visitBeneficiaires', 'visitBeneficiaires.visit'],
        });
        const ocrRecords = await this.ocrRepository.find();
        const resources = await this.resourceRepository.find();

        // Recalculate all vulnerability scores
        const scoredBeneficiaries = await Promise.all(
            beneficiaries.map(async b => {
                const advancedScore = await this.calculateAdvancedVulnerabilityScore(b);
                return { ...b, ...advancedScore };
            })
        );

        // Calculate statistics
        const scores = scoredBeneficiaries.map(sb => sb.totalScore);
        const avgVulnerability = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
        const atRiskCount = scores.filter(s => s >= 65).length;
        const criticalCount = scores.filter(s => s >= 80).length;

        // Identify Top 10 Priority Families
        const priorityQueue = scoredBeneficiaries
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 10)
            .map(b => ({
                id: b.id,
                code: b.codeFamille,
                name: b.situationSociale?.split(',')[0] || 'Unknown',
                score: b.totalScore,
                riskLevel: b.riskLevel,
                topNeed: b.recommendations[0],
            }));

        // Medical Trend Analysis
        const medicalTrends = this.detectMedicalPatterns(ocrRecords);

        // Resource & Stock Prediction
        const resourceShortages = resources
            .filter(r => Number(r.quantity) <= Number(r.minThreshold))
            .map(r => ({
                item: r.name,
                category: r.category,
                current: Number(r.quantity),
                threshold: Number(r.minThreshold),
                urgency: Number(r.quantity) <= 0 ? 'CRITICAL' : 'HIGH',
            }));

        // Predict resource needs
        const predictedNeeds = this.predictResourceNeeds(priorityQueue, beneficiaries);

        return {
            timestamp: new Date(),
            systemSummary: {
                totalFamilies: beneficiaries.length,
                totalResources: resources.length,
                averageVulnerability: Math.round(avgVulnerability),
                atRiskCount,
                criticalCount,
                healthViewCount: ocrRecords.length,
            },
            priorityQueue,
            medicalTrends,
            resourceShortages,
            predictedNeeds,
            systemHealth: {
                redFlags: [
                    ...resourceShortages.filter(r => r.urgency === 'CRITICAL').map(r => `CRITICAL: ${r.item} out of stock`),
                    ...(criticalCount > 0 ? [`${criticalCount} families in critical condition`] : []),
                ],
            },
        };
    }

    private predictResourceNeeds(priorityQueue: any[], allBeneficiaries: Beneficiaire[]): any[] {
        const predictedNeeds: Record<string, number> = {};

        priorityQueue.forEach(prio => {
            const family = allBeneficiaries.find(b => b.id === prio.id);
            if (!family) return;

            if (prio.score >= 80) {
                predictedNeeds['Colis Alimentaire'] = (predictedNeeds['Colis Alimentaire'] || 0) + 2;
                predictedNeeds['Médicaments'] = (predictedNeeds['Médicaments'] || 0) + 2;
                predictedNeeds['Produits d\'Hygiène'] = (predictedNeeds['Produits d\'Hygiène'] || 0) + 1;
            } else if (prio.score >= 65) {
                predictedNeeds['Colis Alimentaire'] = (predictedNeeds['Colis Alimentaire'] || 0) + 1;
                predictedNeeds['Médicaments'] = (predictedNeeds['Médicaments'] || 0) + 1;
            }

            if (family.nbEnfants > 0) {
                predictedNeeds['Fournitures Scolaires'] = (predictedNeeds['Fournitures Scolaires'] || 0) + 1;
                predictedNeeds['Vêtements'] = (predictedNeeds['Vêtements'] || 0) + 1;
            }

            if (family.nbPersonnesAgees > 0) {
                predictedNeeds['Médicaments'] = (predictedNeeds['Médicaments'] || 0) + 1;
            }
        });

        return Object.entries(predictedNeeds).map(([item, quantity]) => ({
            item,
            predictedQuantity: quantity,
            priority: quantity >= 5 ? 'HIGH' : quantity >= 3 ? 'MEDIUM' : 'LOW',
        }));
    }

    private detectMedicalPatterns(records: MedicationRecord[]) {
        const drugCounts: Record<string, number> = {};
        const classCounts: Record<string, number> = {};

        records.forEach(rec => {
            const meds = Array.isArray(rec.medications) ? (rec.medications as any[]) : [];
            meds.forEach(m => {
                if (m.name) drugCounts[m.name] = (drugCounts[m.name] || 0) + 1;
                if (m.drugClass) classCounts[m.drugClass] = (classCounts[m.drugClass] || 0) + 1;
            });
        });

        const hotspots = Object.entries(classCounts)
            .filter(([_, count]) => count >= 3)
            .map(([drugClass, count]) => ({
                trend: `Augmentation des cas de: ${drugClass}`,
                affectedFamilies: count,
                severity: count > 10 ? 'HIGH' : 'MEDIUM',
                recommendation: count > 10
                    ? `EMERGENCY: Increase stock of ${drugClass} medications`
                    : `Monitor and prepare supply of ${drugClass} medications`,
            }));

        const topDrugs = Object.entries(drugCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ medication: name, occurrences: count }));

        return {
            hotspots,
            topMedications: topDrugs,
            recentRecords: records.length,
        };
    }

    private analyzeMedicationSeverity(records: MedicationRecord[]): { severityScore: number; severity: string } {
        const severityMap: Record<string, number> = {
            'antibiotic': 2, 'antibiotique': 2,
            'antihypertensive': 2, 'antidiabetic': 2, 'corticosteroid': 3, 'corticostéroïde': 3,
            'psychotropic': 2, 'immunosuppressant': 3,
            'chemotherapy': 5, 'chimiothérapie': 5,
            'insulin': 3, 'vaccine': 1, 'vaccin': 1,
            'pain reliever': 1, 'paracetamol': 1, 'ibuprofen': 1,
            'antiviral': 3
        };

        let totalSeverityScore = 0;
        let maxSeverity = 0;
        let uniqueMedicationClasses = new Set<string>();

        records.forEach(record => {
            const meds = Array.isArray(record.medications) ? (record.medications as any[]) : [];
            meds.forEach(med => {
                if (med.drugClass) {
                    uniqueMedicationClasses.add(med.drugClass.toLowerCase());
                    const severity = severityMap[med.drugClass.toLowerCase()] || 1;
                    totalSeverityScore += severity;
                    maxSeverity = Math.max(maxSeverity, severity);
                }
            });
        });

        const averageSeverity = records.length ? totalSeverityScore / records.length : 0;
        const severityScore = Math.min(Math.round(averageSeverity), 9);
        const severity = maxSeverity >= 5 ? 'CRITICAL' : maxSeverity >= 3 ? 'HIGH' : 'MODERATE';

        return { severityScore, severity };
    }

    private getRiskLevel(score: number): string {
        if (score >= 80) return 'CRITICAL';
        if (score >= 65) return 'HIGH';
        if (score >= 50) return 'MODERATE';
        if (score >= 35) return 'LOW';
        return 'MINIMAL';
    }

    private generateRecommendations(
        b: Beneficiaire,
        economic: number,
        health: number,
        social: number,
        urgency: number
    ): string[] {
        const recommendations: string[] = [];

        if (economic >= 30) {
            recommendations.push('Priority: Emergency financial aid');
            recommendations.push('Explore job training or employment programs');
        } else if (economic >= 15) {
            recommendations.push('Regular economic support needed');
        }

        if (health >= 20) {
            recommendations.push('Immediate medical referral required');
            recommendations.push('Monthly health check-ups recommended');
        } else if (health >= 10) {
            recommendations.push('Quarterly medical follow-up');
        }

        if (b.typeLogement?.toLowerCase() === 'précaire' || social >= 15) {
            recommendations.push('Urgent: Find safe housing solution');
        }

        if (urgency >= 8) {
            recommendations.push('Schedule urgent aid distribution');
        }

        return recommendations.length > 0
            ? recommendations
            : ['Continue regular monitoring and support'];
    }

    private daysDifference(from: Date, to: Date): number {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((to.getTime() - from.getTime()) / oneDay));
    }

    // ========== Predictive Analytics (Calls ML Service) ==========

    async calculateVulnerabilityScore(beneficiaire: Beneficiaire): Promise<any> {
        try {
            const payload = this.mapToMLInput(beneficiaire);
            this.logger.log(`Calling ML /score with: ${JSON.stringify(payload)}`);
            const response = await firstValueFrom(
                this.httpService.post(`${this.mlUrl}/score`, payload)
            );
            return response.data;
        } catch (error) {
            this.logger.error(`ML Scoring failed: ${error.message}`);
            if (error.response) {
                this.logger.error(`ML Error Detail: ${JSON.stringify(error.response.data)}`);
            }
            // Fallback to local logic if ML fails
            const result = await this.calculateAdvancedVulnerabilityScore(beneficiaire);
            return this.mapToLocalResponse(beneficiaire, result);
        }
    }

    async batchCalculateVulnerabilityScores(beneficiaries: any[]) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.mlUrl}/score/batch`, {
                    beneficiaries: beneficiaries.map(b => this.mapToMLInput(b))
                })
            );
            return response.data.results;
        } catch (error) {
            this.logger.error(`ML Batch scoring failed: ${error.message}`);
            return Promise.all(beneficiaries.map(b => this.calculateVulnerabilityScore(b)));
        }
    }

    async getVulnerabilityScore(beneficiaryId: string) {
        const beneficiary = await this.beneficiaryRepository.findOne({ where: { id: beneficiaryId } });
        if (!beneficiary) return null;
        return this.calculateVulnerabilityScore(beneficiary);
    }

    async getVulnerabilityScores(filters: any) {
        const beneficiaries = await this.beneficiaryRepository.find();
        const data = await Promise.all(beneficiaries.map(b => this.calculateVulnerabilityScore(b)));
        return {
            data,
            total: data.length
        };
    }

    async predictAreaNeeds(beneficiariesByArea: Record<string, any[]>) {
        try {
            // We need scores to send to ML service
            const scoresById: Record<string, any> = {};
            for (const area in beneficiariesByArea) {
                const areaScores = await this.batchCalculateVulnerabilityScores(beneficiariesByArea[area]);
                areaScores.forEach((s: any) => scoresById[s.beneficiary_id] = s);
            }

            const mappedBeneficiariesByArea: Record<string, any[]> = {};
            for (const area in beneficiariesByArea) {
                mappedBeneficiariesByArea[area] = beneficiariesByArea[area].map(b => this.mapToMLInput(b));
            }

            const response = await firstValueFrom(
                this.httpService.post(`${this.mlUrl}/predict/area-needs`, {
                    beneficiaries_by_area: mappedBeneficiariesByArea,
                    scores_by_id: scoresById
                })
            );
            return response.data.predictions;
        } catch (error) {
            this.logger.error(`ML Area Prediction failed: ${error.message}`);
            return [];
        }
    }

    async detectHealthPatterns(beneficiaries: any[]) {
        try {
            const scores = await this.batchCalculateVulnerabilityScores(beneficiaries);
            const response = await firstValueFrom(
                this.httpService.post(`${this.mlUrl}/predict/health-patterns`, {
                    beneficiaries: beneficiaries.map(b => this.mapToMLInput(b)),
                    scores: scores
                })
            );
            return response.data.alerts;
        } catch (error) {
            this.logger.error(`ML Health Pattern detection failed: ${error.message}`);
            return [];
        }
    }

    async analyzeMigrationTrends(beneficiaries: any[]) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.mlUrl}/predict/migration-trends`,
                    beneficiaries.map(b => this.mapToMLInput(b))
                )
            );
            return response.data.trends;
        } catch (error) {
            this.logger.error(`ML Migration Trend analysis failed: ${error.message}`);
            return {};
        }
    }

    async getMLServiceHealth() {
        try {
            const response = await firstValueFrom(this.httpService.get(`${this.mlUrl}/health`));
            return response.data;
        } catch (error) {
            return { status: 'down', error: error.message };
        }
    }

    async getMLServiceInfo() {
        try {
            const response = await firstValueFrom(this.httpService.get(`${this.mlUrl}/info`));
            return response.data;
        } catch (error) {
            return { error: error.message };
        }
    }

    // ========== Helpers ==========

    private mapToMLInput(b: Beneficiaire) {
        return {
            id: b.id || 'temp-id',
            nbMembres: Number(b.nbMembres) || 1,
            nbEnfants: Number(b.nbEnfants) || 0,
            nbPersonnesAgees: Number(b.nbPersonnesAgees) || 0,
            nbHandicapes: Number(b.nbHandicapes) || 0,
            revenuMensuel: b.revenuMensuel ? Number(b.revenuMensuel) : null,
            typeLogement: b.typeLogement,
            statutSocial: b.statutSocial,
            migrationStatus: b.migrationStatus,
            healthConditions: b.healthConditions,
            medicalVisitsCount: b.medicalVisitsCount || 0,
            medicationRecordsCount: b.medicationRecordsCount || 0,
            lastAidDistributionDate: b.lastAidDistributionDate
        };
    }

    private mapToLocalResponse(b: Beneficiaire, result: any) {
        return {
            id: 'local-' + Date.now(),
            beneficiary_id: b.id,
            vulnerabilityScore: result.totalScore,
            economicFactor: result.details.economic,
            healthFactor: result.details.health,
            socialFactor: result.details.social,
            urgencyFactor: result.details.urgency,
            riskLevel: result.riskLevel,
            recommendations: result.recommendations,
            featureContributions: [
                { feature: 'Statut Économique', value: result.details.economic, max_possible: 40 },
                { feature: 'Besoins Santé', value: result.details.health, max_possible: 30 },
                { feature: 'Facteurs Sociaux', value: result.details.social, max_possible: 20 },
                { feature: 'Urgence', value: result.details.urgency, max_possible: 10 }
            ],
            confidenceScore: 0.85, // Static high confidence for internal logic
            calculated_at: new Date()
        };
    }
}
