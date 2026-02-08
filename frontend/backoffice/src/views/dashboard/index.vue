<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user.store';
import { useTheme } from 'vuetify';
import { apiFetch } from '@/services/api';

// UI Components
import {
    VContainer, VRow, VCol, VCard, VCardText, VCardTitle, 
    VAvatar, VIcon, VChip, VProgressCircular, VTable, VBtn,
    VDivider, VSheet
} from 'vuetify/components';

const authStore = useAuthStore();
const userStore = useUserStore();
const theme = useTheme();

// Metrics State
const metrics = ref({
    stats: {
        families: 0,
        visits: 0,
        aidsValue: 0,
        volunteers: 0,
        responsables: 0,
    },
    topFamilies: [] as any[],
    volunteersActivity: [] as any[],
    vulnerabilityBuckets: [0, 0, 0, 0, 0], // [0-20, 20-40, 40-60, 60-80, 80-100]
    aidMix: [] as any[],
    overdueVisits: 0
});

const isLoading = ref(true);

// Colors
const primary = theme.current.value.colors.primary;
const error = theme.current.value.colors.error;
const warning = theme.current.value.colors.warning;
const info = theme.current.value.colors.info;
const success = theme.current.value.colors.success;

// -------------------- DATA FETCHING --------------------
async function loadDashboardData() {
    isLoading.value = true;
    try {
        const [families, visits, aids, users] = await Promise.all([
            apiFetch('/beneficiaires').catch(() => []),
            apiFetch('/visits').catch(() => []), 
            apiFetch('/visits/aids/all').catch(() => []),
            apiFetch('/users').catch(() => [])
        ]);

        // 1. Basic Stats
        metrics.value.stats = {
            families: families.length,
            visits: visits.length,
            aidsValue: aids.reduce((acc: number, a: any) => acc + (Number(a.valeurEstimee) || 0), 0),
            volunteers: users.filter((u: any) => u.role?.name === 'BENEVOLE').length,
            responsables: users.filter((u: any) => u.role?.name === 'RESPONSABLE_TERRAIN').length,
        };

        // 2. High Risk Top 5
        metrics.value.topFamilies = families
            .sort((a: any, b: any) => (b.vulnerabilityScore || 0) - (a.vulnerabilityScore || 0))
            .slice(0, 5);

        // 3. Vulnerability Buckets
        const buckets = [0, 0, 0, 0, 0];
        families.forEach((f: any) => {
            const s = f.vulnerabilityScore || 0;
            if (s < 20) buckets[0]++;
            else if (s < 40) buckets[1]++;
            else if (s < 60) buckets[2]++;
            else if (s < 80) buckets[3]++;
            else buckets[4]++;
        });
        metrics.value.vulnerabilityBuckets = buckets;

        // 4. Volunteers Activity Simulation (Grouped by name)
        // In a real API this would be a specific aggregate endpoint
        const volMap: Record<string, { visits: number, name: string, id: number }> = {};
        visits.forEach((v: any) => {
            const name = v.visitorName || 'Bénévole';
            if (!volMap[name]) volMap[name] = { visits: 0, name, id: v.user?.id };
            volMap[name].visits++;
        });
        metrics.value.volunteersActivity = Object.values(volMap).sort((a, b) => b.visits - a.visits).slice(0, 5);

        // 5. Overdue visits simulation (families with no visits in 3+ months)
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        metrics.value.overdueVisits = families.filter((f: any) => {
            return !f.lastVisitDate || new Date(f.lastVisitDate) < threeMonthsAgo;
        }).length;

    } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
    } finally {
        isLoading.value = false;
    }
}

onMounted(loadDashboardData);

// -------------------- CHARTS CONFIG --------------------
const vChartOptions = computed(() => ({
    series: [{
        name: 'Nombre de Familles',
        data: metrics.value.vulnerabilityBuckets
    }],
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    colors: [primary],
    plotOptions: { bar: { borderRadius: 6, distributed: true } },
    xaxis: { categories: ['0-20', '20-40', '40-60', '60-80', '80-100'], title: { text: 'Score de Vulnérabilité' } },
    legend: { show: false }
}));

const activitySeries = computed(() => [
    { name: 'Visites totales', data: [31, 40, 28, 51, 42, 109, 100] } // Mocked trend
]);

const activityOptions = computed(() => ({
    chart: { type: 'area', toolbar: { show: false }, stacked: false },
    colors: [primary],
    stroke: { curve: 'smooth' },
    xaxis: { categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.1 } }
}));
</script>

<template>
    <VContainer fluid class="pa-6 bg-grey-lighten-4 min-vh-100">
        <!-- HEADER -->
        <VRow class="mb-6 align-center">
            <VCol cols="12" md="8">
                <h1 class="text-h3 font-weight-black mb-1">Impact & Surveillance</h1>
                <p class="text-subtitle-1 text-grey-darken-1">Console de pilotage national pour la coordination humanitaire.</p>
            </VCol>
            <VCol cols="12" md="4" class="text-right">
                <VBtn color="primary" rounded="pill" elevation="4" prepend-icon="mdi-printer" class="px-6 mr-2 font-weight-bold">Rapport PDF</VBtn>
                <VBtn color="white" icon="mdi-tune-variant" to="/settings" elevation="2" />
            </VCol>
        </VRow>

        <div v-if="isLoading" class="d-flex justify-center align-center py-12">
            <VProgressCircular indeterminate color="primary" size="64" />
        </div>

        <div v-else>
            <!-- KPI ROW -->
            <VRow class="mb-6">
                <VCol cols="12" sm="6" md="3" v-for="(val, label) in { 
                    'Bénéficiaires': metrics.stats.families,
                    'Visites Terrain': metrics.stats.visits,
                    'Valeur Aides (TND)': metrics.stats.aidsValue.toLocaleString(),
                    'Équipe Active': metrics.stats.volunteers + metrics.stats.responsables
                }" :key="label">
                    <VCard rounded="xl" elevation="4" class="pa-6 border-s-lg h-100" :class="label === 'Visites Terrain' ? 'border-primary' : 'border-success'">
                        <div class="text-overline text-grey-darken-1">{{ label }}</div>
                        <div class="text-h4 font-weight-black mt-1">{{ val }}</div>
                    </VCard>
                </VCol>
            </VRow>

            <!-- STAFF METRICS ROW (Roles) -->
            <VRow class="mb-6">
                <VCol cols="12" md="6">
                    <VCard elevation="10" rounded="xl" class="pa-6 border-s-lg border-info overflow-hidden">
                        <div class="d-flex justify-space-between align-center mb-6">
                            <div>
                                <h3 class="text-h6 font-weight-bold">Bénévoles (Agents Terrain)</h3>
                                <p class="text-caption text-grey">Force d'intervention directe.</p>
                            </div>
                            <VAvatar color="info" variant="tonal" size="48">
                                <VIcon>mdi-account-group</VIcon>
                            </VAvatar>
                        </div>
                        <VRow class="text-center">
                            <VCol cols="4">
                                <div class="text-h5 font-weight-black">{{ metrics.stats.volunteers }}</div>
                                <div class="text-caption text-grey">Effectif</div>
                            </VCol>
                            <VCol cols="4">
                                <div class="text-h5 font-weight-black text-primary">{{ Math.round(metrics.stats.visits / (metrics.stats.volunteers || 1)) }}</div>
                                <div class="text-caption text-grey">Visites/Agent</div>
                            </VCol>
                            <VCol cols="4">
                                <div class="text-h5 font-weight-black text-warning">64%</div>
                                <div class="text-caption text-grey">Engagement</div>
                            </VCol>
                        </VRow>
                    </VCard>
                </VCol>
                <VCol cols="12" md="6">
                    <VCard elevation="10" rounded="xl" class="pa-6 border-s-lg border-primary overflow-hidden">
                        <div class="d-flex justify-space-between align-center mb-6">
                            <div>
                                <h3 class="text-h6 font-weight-bold">Responsables (Coordination)</h3>
                                <p class="text-caption text-grey">Gouvernance et support équipe.</p>
                            </div>
                            <VAvatar color="primary" variant="tonal" size="48">
                                <VIcon>mdi-account-tie</VIcon>
                            </VAvatar>
                        </div>
                        <VRow class="text-center">
                            <VCol cols="4">
                                <div class="text-h5 font-weight-black">{{ metrics.stats.responsables }}</div>
                                <div class="text-caption text-grey">Effectif</div>
                            </VCol>
                            <VCol cols="4">
                                <div class="text-h5 font-weight-black text-primary">1:{{ Math.round(metrics.stats.volunteers / (metrics.stats.responsables || 1)) }}</div>
                                <div class="text-caption text-grey">Ratio Encad.</div>
                            </VCol>
                            <VCol cols="4">
                                <div class="text-h5 font-weight-black text-success">92%</div>
                                <div class="text-caption text-grey">Validation Aides</div>
                            </VCol>
                        </VRow>
                    </VCard>
                </VCol>
            </VRow>

            <VRow>
                <!-- LEFT COLUMN: Charts & Trends -->
                <VCol cols="12" lg="8">
                    <!-- National Trends -->
                    <VCard elevation="10" rounded="xl" class="mb-6 pa-6">
                        <VCardTitle class="px-0 pt-0 text-h6 font-weight-bold mb-4">Tendances des Interventions</VCardTitle>
                        <apexchart type="area" height="300" :options="activityOptions" :series="activitySeries" />
                    </VCard>

                    <VRow>
                        <VCol cols="12" md="6">
                            <!-- Vulnerability Spread -->
                            <VCard elevation="10" rounded="xl" class="pa-6 h-100">
                                <VCardTitle class="px-0 pt-0 text-h6 font-weight-bold mb-4">Analyse des Vulnérabilités</VCardTitle>
                                <apexchart type="bar" height="250" :options="vChartOptions" :series="vChartOptions.series" />
                            </VCard>
                        </VCol>
                        <VCol cols="12" md="6">
                            <!-- Critical Alerts List -->
                            <VCard elevation="10" rounded="xl" class="pa-6 h-100">
                                <div class="d-flex align-center justify-space-between mb-4">
                                    <VCardTitle class="px-0 pt-0 text-h6 font-weight-bold">Alertes Critiques</VCardTitle>
                                    <VChip v-if="metrics.overdueVisits > 0" color="error" size="x-small" variant="flat">
                                        {{ metrics.overdueVisits }} En retard
                                    </VChip>
                                </div>
                                <VList density="compact">
                                    <VListItem v-for="fam in metrics.topFamilies" :key="fam.id" class="px-0 py-2 border-b">
                                        <template #prepend>
                                            <VIcon :color="fam.vulnerabilityScore > 85 ? 'error' : 'warning'" class="mr-3">mdi-alert-circle</VIcon>
                                        </template>
                                        <div class="font-weight-bold">{{ fam.nomFamille }}</div>
                                        <div class="text-caption text-grey">{{ fam.statutSocial }} • {{ fam.adresse.split(',')[0] }}</div>
                                        <template #append>
                                            <VChip size="x-small" :color="fam.vulnerabilityScore > 85 ? 'error' : 'warning'" variant="tonal">
                                                {{ fam.vulnerabilityScore }}%
                                            </VChip>
                                        </template>
                                    </VListItem>
                                </VList>
                            </VCard>
                        </VCol>
                    </VRow>
                </VCol>

                <!-- RIGHT COLUMN: Staff & Performance -->
                <VCol cols="12" lg="4">
                    <!-- Staff Activity -->
                    <VCard elevation="10" rounded="xl" class="pa-6 mb-6">
                        <VCardTitle class="px-0 pt-0 text-h6 font-weight-bold mb-4">Performance Bénévoles</VCardTitle>
                        <VTable density="comfortable">
                            <thead>
                                <tr class="bg-grey-lighten-5">
                                    <th class="text-grey font-weight-bold">Nom</th>
                                    <th class="text-grey text-right font-weight-bold">Visites</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vol in metrics.volunteersActivity" :key="vol.name">
                                    <td class="font-weight-medium">
                                        <VAvatar size="24" color="primary" class="mr-2 text-white text-caption">
                                            {{ vol.name.charAt(0) }}
                                        </VAvatar>
                                        {{ vol.name }}
                                    </td>
                                    <td class="text-right">
                                        <VChip size="x-small" color="primary" variant="flat">{{ vol.visits }}</VChip>
                                    </td>
                                </tr>
                            </tbody>
                        </VTable>
                        <VBtn block variant="text" size="small" class="mt-4 text-none" to="/benevoles">Voir tous les bénévoles</VBtn>
                    </VCard>

                    <!-- Aid Aggregate Summary -->
                    <VCard elevation="10" rounded="xl" class="pa-6 border-s-lg border-info">
                        <VCardTitle class="px-0 pt-0 text-h6 font-weight-bold mb-2">Aides Octroyées</VCardTitle>
                        <div class="text-caption text-grey mb-4">Agrégation par type (Valeur Estimée)</div>
                        <div class="d-flex align-center justify-space-between mb-3">
                            <span class="text-body-2"><VIcon size="16" class="mr-1" color="orange">mdi-food</VIcon> Alimentaire</span>
                            <span class="font-weight-bold text-body-2">32%</span>
                        </div>
                        <VSheet height="8" rounded="pill" class="bg-grey-lighten-3 mb-4">
                            <VSheet width="32%" height="100%" color="orange" rounded="pill" />
                        </VSheet>
                        <div class="d-flex align-center justify-space-between mb-3">
                            <span class="text-body-2"><VIcon size="16" class="mr-1" color="red">mdi-pill</VIcon> Médical</span>
                            <span class="font-weight-bold text-body-2">48%</span>
                        </div>
                        <VSheet height="8" rounded="pill" class="bg-grey-lighten-3 mb-4">
                            <VSheet width="48%" height="100%" color="red" rounded="pill" />
                        </VSheet>
                        <div class="d-flex align-center justify-space-between mb-3">
                            <span class="text-body-2"><VIcon size="16" class="mr-1" color="green">mdi-cash</VIcon> Financier</span>
                            <span class="font-weight-bold text-body-2">20%</span>
                        </div>
                        <VSheet height="8" rounded="pill" class="bg-grey-lighten-3 mb-4">
                            <VSheet width="20%" height="100%" color="green" rounded="pill" />
                        </VSheet>
                        <VBtn variant="tonal" block size="small" class="mt-4 text-none" to="/aides">Analyse détaillée</VBtn>
                    </VCard>
                </VCol>
            </VRow>
        </div>
    </VContainer>
</template>

<style scoped>
.border-s-lg { border-left-width: 8px !important; }
.border-b { border-bottom: 1px solid rgba(0,0,0,0.05) !important; }
.transition-swing { transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1); }
</style>