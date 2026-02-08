<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiFetch } from '@/services/api';

const isLoading = ref(true);
const beneficiaries = ref<any[]>([]);

// Risk Categories
const highRisk = computed(() => beneficiaries.value.filter(b => (b.vulnerabilityScore || 0) >= 70));
const mediumRisk = computed(() => beneficiaries.value.filter(b => (b.vulnerabilityScore || 0) >= 40 && (b.vulnerabilityScore || 0) < 70));
const lowRisk = computed(() => beneficiaries.value.filter(b => (b.vulnerabilityScore || 0) < 40));

async function fetchData() {
    isLoading.value = true;
    try {
        const data = await apiFetch('/beneficiaires');
        beneficiaries.value = data;
    } catch (err) {
        console.error('Failed to load cartography data', err);
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchData);
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Visualisation</p>
        <h2>Matrice des Priorités & Risques</h2>
        <p class="subtle">Vue d'ensemble des niveaux de vulnérabilité des bénéficiaires.</p>
      </div>
    </header>

    <div v-if="isLoading" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else class="risk-dashboard">
        <!-- High Risk Zone -->
        <div class="risk-column high">
            <div class="risk-header">
                <h3>Urgence Critique ({{ highRisk.length }})</h3>
                <div class="indicator red"></div>
            </div>
            <div class="risk-grid">
                <div v-for="fam in highRisk" :key="fam.id" class="risk-card high-card" tabindex="0">
                    <div class="card-top">
                        <span class="fam-name">{{ fam.firstName }} {{ fam.lastName }}</span>
                        <span class="score-badge red">{{ fam.vulnerabilityScore }}%</span>
                    </div>
                    <div class="factors">
                        <span v-if="fam.urgencyFactor > 7" class="factor-tag">⚡ Urgence Haute</span>
                        <span v-if="fam.economicFactor > 30" class="factor-tag">💰 Précaire</span>
                    </div>
                </div>
                <div v-if="highRisk.length === 0" class="empty-state">Aucune famille critique</div>
            </div>
        </div>

        <!-- Medium Risk Zone -->
        <div class="risk-column medium">
            <div class="risk-header">
                <h3>Vulnérabilité Moyenne ({{ mediumRisk.length }})</h3>
                <div class="indicator yellow"></div>
            </div>
            <div class="risk-grid">
                <div v-for="fam in mediumRisk" :key="fam.id" class="risk-card medium-card" tabindex="0">
                    <div class="card-top">
                        <span class="fam-name">{{ fam.firstName }} {{ fam.lastName }}</span>
                        <span class="score-badge yellow">{{ fam.vulnerabilityScore }}%</span>
                    </div>
                     <div class="factors">
                        <span class="factor-tag text-grey">{{ fam.statutSocial || 'À vérifier' }}</span>
                    </div>
                </div>
                <div v-if="mediumRisk.length === 0" class="empty-state">Aucune famille</div>
            </div>
        </div>

        <!-- Low Risk Zone -->
        <div class="risk-column low">
            <div class="risk-header">
                <h3>Situation Stable ({{ lowRisk.length }})</h3>
                <div class="indicator green"></div>
            </div>
             <div class="risk-grid">
                <div v-for="fam in lowRisk" :key="fam.id" class="risk-card low-card" tabindex="0">
                    <div class="card-top">
                        <span class="fam-name">{{ fam.firstName }} {{ fam.lastName }}</span>
                        <span class="score-badge green">{{ fam.vulnerabilityScore }}%</span>
                    </div>
                    <div class="factors">
                        <span class="factor-tag text-grey">Stable</span>
                    </div>
                </div>
                 <div v-if="lowRisk.length === 0" class="empty-state">Aucune famille</div>
            </div>
        </div>
    </div>
  </section>
</template>

<style scoped>
.page-container { background: #f8fafc; min-height: 100%; padding: 28px; }
.page-header { margin-bottom: 30px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: #64748b; margin: 0 0 6px; font-weight: 700; }
h2 { margin: 0; font-size: 26px; color: #0f172a; font-weight: 800; }
.subtle { margin: 6px 0 0; color: #64748b; }

.risk-dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    align-items: start;
}

.risk-column {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.risk-column.high { border-top: 4px solid #ef4444; background: #fef2f2; }
.risk-column.medium { border-top: 4px solid #f59e0b; background: #fffbeb; }
.risk-column.low { border-top: 4px solid #10b981; background: #f0fdf4; }

.risk-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}

.risk-header h3 { font-size: 16px; font-weight: 700; color: #334155; margin: 0; }

.risk-grid { display: grid; gap: 12px; }

.risk-card {
    background: #fff;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid transparent;
    transition: all 0.2s;
    cursor: default;
}

.risk-card:focus { outline: 2px solid #3b82f6; }

.high-card { border-left: 3px solid #ef4444; }
.medium-card { border-left: 3px solid #f59e0b; }
.low-card { border-left: 3px solid #10b981; }

.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.fam-name { font-weight: 600; color: #1e293b; font-size: 15px; }

.score-badge {
    font-size: 12px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 99px;
}
.score-badge.red { background: #fee2e2; color: #991b1b; }
.score-badge.yellow { background: #fef3c7; color: #92400e; }
.score-badge.green { background: #d1fae5; color: #065f46; }

.factors { display: flex; flex-wrap: wrap; gap: 6px; }
.factor-tag { font-size: 11px; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 500; }

.empty-state { text-align: center; color: #94a3b8; font-style: italic; padding: 20px; font-size: 14px; }
</style>
