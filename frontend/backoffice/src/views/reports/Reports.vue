<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiFetch } from '@/services/api';
import { useTheme } from 'vuetify';

const theme = useTheme();
const primary = theme.current.value.colors.primary;
const error = theme.current.value.colors.error;
const info = theme.current.value.colors.info;
const warning = theme.current.value.colors.warning;

const stats = ref({
    totalBeneficiaries: 0,
    totalAidsValue: 0,
    totalVisits: 0,
    lowStockCount: 0
});

const resources = ref<any[]>([]);
const aids = ref<any[]>([]);

const isLoading = ref(true);

// Chart Data: Aid Types
const aidTypeSeries = computed(() => {
    // Mock logic: Group aids by type (assuming 'type' field in aids or distribute randomly for now)
    const types: Record<string, number> = { 'Alimentaire': 0, 'financier': 0, 'Vêtements': 0, 'Médical': 0 };
    aids.value.forEach(aid => {
        const t = aid.type || 'Autre';
        types[t] = (types[t] || 0) + 1;
    });
    return Object.values(types);
});

const aidTypeOptions = computed(() => ({
    labels: ['Alimentaire', 'Financier', 'Vêtements', 'Médical'], // Match keys above
    colors: [primary, info, warning, error],
    chart: { type: 'donut', fontFamily: 'inherit' },
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { size: '65%' } } }
}));

// Chart Data: Monthly Distribution
const monthlySeries = computed(() => [{
    name: 'Aides Distribuées',
    data: [12, 19, 3, 5, 2, 3, 20] // TODO: Group aids by month
}]);

const monthlyOptions = computed(() => ({
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    colors: [primary],
    xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'] },
    plotOptions: { bar: { borderRadius: 4 } }
}));

async function fetchData() {
    isLoading.value = true;
    try {
        const [beneData, aidsData, visitData, resourceData] = await Promise.all([
            apiFetch('/beneficiaires').catch(() => []), 
            apiFetch('/aides').catch(() => []), 
            apiFetch('/visits').catch(() => []),
            apiFetch('/resources').catch(() => [])
        ]);

        resources.value = resourceData;
        aids.value = aidsData;

        // Calculate Stats
        const totalValue = aidsData.reduce((acc: number, curr: any) => acc + (Number(curr.montant) || 0), 0);
        
        stats.value = {
            totalBeneficiaries: beneData.length,
            totalAidsValue: totalValue,
            totalVisits: visitData.length,
            lowStockCount: resourceData.filter((r: any) => r.quantity < (r.minQuantity || 10)).length
        };

    } catch (err) {
        console.error('Report fetch error:', err);
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
        <p class="eyebrow">Rapports & Analyses</p>
        <h2>Vue d'ensemble des Ressources</h2>
        <p class="subtle">Analyse des distributions, des stocks et de l'impact social.</p>
      </div>
    </header>

    <!-- KPI Grid -->
    <div class="stats-grid mb-8">
      <div class="stat-card">
        <h3>Total Bénéficiaires</h3>
        <p class="value">{{ stats.totalBeneficiaries }} <span class="unit">Familles</span></p>
      </div>
      <div class="stat-card">
        <h3>Valeur Aides (TND)</h3>
        <p class="value primary-text">{{ stats.totalAidsValue.toLocaleString() }} <span class="unit">TND</span></p>
      </div>
      <div class="stat-card">
        <h3>Visites Terrain</h3>
        <p class="value">{{ stats.totalVisits }} <span class="unit">Visites</span></p>
      </div>
      <div class="stat-card">
        <h3>Alerte Stock</h3>
        <p class="value error-text">{{ stats.lowStockCount }} <span class="unit">Items</span></p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-grid">
        <div class="chart-card">
            <h3 class="chart-title">Types d'Aides Distribuées</h3>
            <apexchart type="donut" height="300" :options="aidTypeOptions" :series="aidTypeSeries" />
        </div>
        <div class="chart-card">
             <h3 class="chart-title">Tendances Distributions</h3>
             <apexchart type="bar" height="300" :options="monthlyOptions" :series="monthlySeries" />
        </div>
    </div>

    <!-- Resources Table -->
    <div class="resource-section mt-8">
        <h3 class="section-title">État des Stocks (Ressources)</h3>
        <div class="table-container">
            <table class="simple-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Quantité</th>
                        <th>Valeur Unit.</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in resources" :key="item.id">
                        <td class="font-weight-medium">{{ item.name }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.quantity }} {{ item.unit }}</td>
                        <td>{{ item.value }} TND</td>
                         <td>
                            <span v-if="item.quantity < (item.minQuantity || 10)" class="status-badge error">Critique</span>
                            <span v-else class="status-badge success">En Stock</span>
                        </td>
                    </tr>
                    <tr v-if="resources.length === 0">
                        <td colspan="5" class="text-center text-grey">Aucune ressource enregistrée.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </section>
</template>

<style scoped>
.page-container { background: #f8fafc; min-height: 100%; padding: 28px; }
.mb-8 { margin-bottom: 32px; }
.mt-8 { margin-top: 32px; }

.page-header { margin-bottom: 30px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: #64748b; margin: 0 0 6px; font-weight: 700; }
h2 { margin: 0; font-size: 26px; color: #0f172a; font-weight: 800; }
.subtle { margin: 6px 0 0; color: #64748b; }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
.stat-card { background: #fff; padding: 24px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
.stat-card h3 { font-size: 13px; text-transform: uppercase; color: #64748b; margin: 0 0 10px; font-weight: 600; }
.stat-card .value { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; }
.stat-card .unit { font-size: 14px; color: #94a3b8; font-weight: 500; margin-left: 4px; }
.primary-text { color: #0f766e !important; }
.error-text { color: #ef4444 !important; }

.charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px; }
.chart-card { background: #fff; padding: 24px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.chart-title { font-size: 16px; color: #0f172a; margin-bottom: 20px; font-weight: 700; }

.resource-section { background: #fff; padding: 24px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.section-title { font-size: 18px; color: #0f172a; margin-bottom: 20px; font-weight: 700; }

.table-container { overflow-x: auto; }
.simple-table { width: 100%; border-collapse: collapse; text-align: left; }
.simple-table th { padding: 12px; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; border-bottom: 2px solid #f1f5f9; }
.simple-table td { padding: 12px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; }
.simple-table tr:last-child td { border-bottom: none; }

.status-badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.status-badge.error { background: #fee2e2; color: #991b1b; }
.status-badge.success { background: #d1fae5; color: #065f46; }

.text-center { text-align: center; }
.text-grey { color: #94a3b8; }
.font-weight-medium { font-weight: 600; }
</style>
