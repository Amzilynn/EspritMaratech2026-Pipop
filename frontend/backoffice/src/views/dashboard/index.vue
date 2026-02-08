<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from 'vuetify';
import BeneficiaryStats from '@/components/dashboards/BeneficiaryStats.vue';
import VisitsChart from '@/components/dashboards/VisitsChart.vue';
import RecentActivity from '@/components/dashboards/RecentActivity.vue';
import { apiFetch } from '@/services/api';

const authStore = useAuthStore();
const theme = useTheme();
const role = computed(() => authStore.role);

// Colors
const primary = theme.current.value.colors.primary;
const error = theme.current.value.colors.error;
const warning = theme.current.value.colors.warning;
const info = theme.current.value.colors.info;
const secondary = theme.current.value.colors.secondary;

// Stats Data
const stats = ref({
    families: 0,
    visits: 0,
    aids: 0,
    volunteers: 0
});

const isLoading = ref(true);

// Priority / Heatmap Data
const highRiskBeneficiaries = ref<any[]>([]);

// Chart Options
const chartOptions = computed(() => {
    return {
        series: [45, 15, 27, 18], // TODO: Make dynamic based on stats
        labels: ['Précaire', 'Nécessiteux', 'Orphelin', 'Handicap'],
        chart: {
            type: 'donut',
            fontFamily: 'inherit',
            height: 300,
        },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        name: { show: true, fontSize: '14px', color: 'inherit' },
                        value: { show: true, fontSize: '20px', fontWeight: 'bold' },
                        total: { show: true, label: 'Total', color: 'inherit' }
                    }
                }
            }
        },
        stroke: { show: false },
        colors: [primary, error, warning, info],
        legend: { position: 'bottom', horizontalAlign: 'center' },
        tooltip: { theme: 'light', fillSeriesColor: false },
    };
});

// Fetch Real Data
async function fetchHomeStats() {
    isLoading.value = true;
    try {
        console.log('Fetching dashboard stats...');
        // Parallel data fetching for performance
        const [families, visits, aids, users] = await Promise.all([
            apiFetch('/beneficiaires').catch(() => []),
            apiFetch('/visits').catch(() => []), 
            apiFetch('/aides').catch(() => []),
            apiFetch('/users').catch(() => [])
        ]);

        stats.value = {
            families: families.length,
            visits: visits.length,
            aids: aids.length,
            volunteers: users.filter((u: any) => u.role?.name === 'BENEVOLE').length
        };

        // Filter for High Risk Heatmap (Score > 0 for demo, ideally > 70)
        highRiskBeneficiaries.value = families
            .filter((f: any) => (f.vulnerabilityScore || 0) > 0)
            .sort((a: any, b: any) => (b.vulnerabilityScore || 0) - (a.vulnerabilityScore || 0))
            .slice(0, 8);
            
        console.log('Stats loaded:', stats.value);
    } catch (err) {
        console.error('Dashboard stats error:', err);
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchHomeStats);

// Quick Links Configuration
const responsableCards = [
    { title: 'Bénévoles', desc: 'Gérer les équipes.', icon: 'mdi-account-heart', to: '/benevoles', color: 'primary' },
    { title: 'Responsables', desc: 'Gestion encadrants.', icon: 'mdi-account-tie', to: '/responsables', color: 'error' },
    { title: 'Familles', desc: 'Bénéficiaires.', icon: 'mdi-heart', to: '/beneficiaries', color: 'info' },
    { title: 'Visites', desc: 'Suivi interventions.', icon: 'mdi-calendar-check', to: '/visits', color: 'warning' },
];

const benevoleCards = [
    { title: 'Nouvelle Famille', desc: 'Enquêter.', icon: 'mdi-account-plus', to: '/beneficiaries/new', color: 'primary' },
    { title: 'Mes Visites', desc: 'Historique.', icon: 'mdi-walk', to: '/visits', color: 'warning' },
    { title: 'Ma Position', desc: 'Mise à jour GPS.', icon: 'mdi-crosshairs-gps', to: '/localisation', color: 'secondary' },
    { title: 'Mes Aides', desc: 'Distributions.', icon: 'mdi-gift', to: '/aides', color: 'success' },
];

const quickCards = computed(() => {
    return (role.value === 'ADMIN' || role.value === 'RESPONSABLE_TERRAIN') 
        ? responsableCards 
        : benevoleCards;
});
</script>

<template>
    <v-container fluid class="pa-6">
        <!-- Hero Section -->
        <v-row class="mb-8 align-center">
            <v-col cols="12" md="8">
                <div class="d-flex align-center mb-2">
                    <v-avatar color="lightprimary" size="48" class="mr-4">
                        <v-icon color="primary" icon="mdi-hand-heart"></v-icon>
                    </v-avatar>
                    <div>
                        <h1 class="text-h3 font-weight-bold tracking-tight">Bonjour, {{ authStore.email?.split('@')[0] }}</h1>
                        <p class="text-subtitle-1 text-grey-darken-1">Bienvenue sur votre portail Omnia. Voici le résumé de l'activité actuelle.</p>
                    </div>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="text-md-right">
                <v-chip color="primary" variant="flat" size="large" rounded="pill" class="px-6 font-weight-bold" role="status" aria-label="Rôle utilisateur">
                    <v-icon start icon="mdi-shield-check"></v-icon>
                    Mode {{ authStore.role }}
                </v-chip>
            </v-col>
        </v-row>

        <!-- Stats Overview -->
        <v-row class="mb-8">
            <v-col cols="12" sm="6" md="3">
                <v-card rounded="xl" elevation="2" class="pa-4 bg-primary text-white glass-effect" role="region" aria-label="Statistiques Familles">
                    <div class="d-flex justify-space-between align-start">
                        <div>
                            <div class="text-h4 font-weight-black mb-1">{{ stats.families }}</div>
                            <div class="text-overline opacity-80">Familles</div>
                        </div>
                        <v-icon size="40" icon="mdi-home-heart" class="opacity-40" aria-hidden="true"></v-icon>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card rounded="xl" elevation="2" class="pa-4 bg-white border">
                    <div class="d-flex justify-space-between align-start">
                        <div>
                            <div class="text-h4 font-weight-black mb-1 text-primary">{{ stats.visits }}</div>
                            <div class="text-overline text-grey">Visites Terrain</div>
                        </div>
                        <v-icon size="40" icon="mdi-map-marker-path" color="primary" class="opacity-20"></v-icon>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card rounded="xl" elevation="2" class="pa-4 bg-error text-white glass-effect">
                    <div class="d-flex justify-space-between align-start">
                        <div>
                            <div class="text-h4 font-weight-black mb-1">{{ stats.aids }}</div>
                            <div class="text-overline opacity-80">Aides Octroyées</div>
                        </div>
                        <v-icon size="40" icon="mdi-handshake" class="opacity-40"></v-icon>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card rounded="xl" elevation="2" class="pa-4 bg-white border">
                    <div class="d-flex justify-space-between align-start">
                        <div>
                            <div class="text-h4 font-weight-black mb-1 text-on-surface">{{ stats.volunteers }}</div>
                            <div class="text-overline text-grey">Bénévoles Actifs</div>
                        </div>
                        <v-icon size="40" icon="mdi-account-group" color="grey" class="opacity-20"></v-icon>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <!-- Data Visualizations (Admin / Resp Only) -->
            <v-col v-if="role === 'ADMIN' || role === 'RESPONSABLE_TERRAIN'" cols="12" lg="8">
                <!-- Heatmap Section -->
                 <v-card elevation="10" class="withbg mb-6">
                    <v-card-item>
                        <div class="d-flex align-center justify-space-between">
                            <v-card-title class="text-h5 d-flex align-center">
                                <v-icon color="error" class="mr-2">mdi-alert-decagram</v-icon>
                                Priorité Haute (Risk Heatmap)
                            </v-card-title>
                            <v-chip color="error" size="small" variant="flat">Urgence</v-chip>
                        </div>
                        <div class="mt-4">
                            <v-row v-if="highRiskBeneficiaries.length > 0">
                                <v-col v-for="fam in highRiskBeneficiaries" :key="fam.id" cols="12" sm="6" md="3">
                                    <v-sheet
                                        rounded="lg"
                                        class="pa-3 cursor-pointer transition-swing"
                                        :color="fam.vulnerabilityScore > 80 ? 'error' : 'warning'"
                                        elevation="2"
                                    >
                                        <div class="d-flex justify-space-between align-center text-white">
                                            <span class="font-weight-bold text-truncate">{{ fam.firstName }} {{ fam.lastName }}</span>
                                            <span class="font-weight-black text-h6">{{ fam.vulnerabilityScore }}%</span>
                                        </div>
                                        <div class="text-caption text-white opacity-80 mt-1">
                                            Urgence: {{ fam.urgencyFactor }}/10
                                        </div>
                                    </v-sheet>
                                </v-col>
                            </v-row>
                            <div v-else class="text-center py-6 text-grey">
                                <v-icon size="48" color="grey-lighten-2">mdi-check-circle-outline</v-icon>
                                <p class="mt-2">Aucune famille en situation d'urgence critique.</p>
                            </div>
                        </div>
                    </v-card-item>
                 </v-card>

                <VisitsChart />
            </v-col>
            
            <v-col v-if="role === 'ADMIN' || role === 'RESPONSABLE_TERRAIN'" cols="12" lg="4">
                 <!-- Status Chart -->
                <v-card elevation="10" class="withbg mb-6">
                    <v-card-item>
                        <div class="d-flex align-center justify-space-between pt-sm-2">
                            <v-card-title class="text-h5">Répartition par Statut</v-card-title>
                        </div>
                        <div class="mt-6">
                            <apexchart type="donut" height="300" :options="chartOptions" :series="chartOptions.series" />
                        </div>
                    </v-card-item>
                </v-card>

                <BeneficiaryStats />
            </v-col>

            <!-- Quick Access (Everyone) -->
            <v-col cols="12">
                <h2 class="text-h4 font-weight-bold mb-6 mt-4 d-flex align-center">
                    <v-icon icon="mdi-rocket-launch" color="primary" class="mr-3"></v-icon>
                    Accès Rapide
                </h2>
                <v-row>
                    <v-col v-for="card in quickCards" :key="card.title" cols="12" sm="6" md="3">
                        <v-card :to="card.to" link class="h-100 p-relative overflow-hidden" elevation="6" rounded="xl">
                            <v-card-text class="pa-6">
                                <v-avatar :color="`light${card.color}`" rounded="lg" size="56" class="mb-4">
                                    <v-icon :color="card.color" :icon="card.icon" size="32"></v-icon>
                                </v-avatar>
                                <h3 class="text-h6 font-weight-bold mb-1">{{ card.title }}</h3>
                                <p class="text-body-2 text-grey-darken-1 mb-4">{{ card.desc }}</p>
                                <v-btn 
                                    :color="card.color" 
                                    variant="tonal" 
                                    rounded="pill" 
                                    block 
                                    :aria-label="'Ouvrir ' + card.title"
                                >
                                    Ouvrir
                                </v-btn>
                            </v-card-text>
                            
                            <!-- Subtle Background Icon Decor -->
                            <v-icon 
                                :icon="card.icon" 
                                class="decor-icon"
                                :color="card.color"
                                aria-hidden="true"
                            ></v-icon>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>

            <!-- Recent Feed -->
            <v-col cols="12" class="mt-8">
                <RecentActivity />
            </v-col>
        </v-row>
    </v-container>
</template>