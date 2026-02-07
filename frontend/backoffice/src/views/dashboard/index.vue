<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import BeneficiaryStats from '@/components/dashboards/BeneficiaryStats.vue';
import VisitsChart from '@/components/dashboards/VisitsChart.vue';
import RecentActivity from '@/components/dashboards/RecentActivity.vue';

const authStore = useAuthStore();
const role = computed(() => authStore.role);

// Define dashboard cards for each role (Only for non-admins now)
const responsableCards = [
    { title: 'Gestion des Bénévoles', desc: 'Consulter tous les bénévoles et leurs visites.', to: '/benevoles', color: 'primary' },
    { title: 'Gestion des bénéficiaires', desc: 'Consulter toutes les Bénéficiaires.', to: '/beneficiaries', color: 'info' },
    { title: 'Gestion des visites', desc: 'Vérifier et corriger les visites.', to: '/visits', color: 'warning' },
    { title: 'Gestion des aides', desc: 'Suivi et validation des aides.', to: '/aides', color: 'success' },
    { title: 'Cartographie', desc: 'Visualiser les bénéficiaires sur la carte.', to: '/cartography', color: 'secondary' },
    { title: 'Planification', desc: 'Organiser les tournées terrain.', to: '/planning', color: 'error' },
];

const benevoleCards = [
    { title: 'Gestion des bénéficiaires', desc: 'Créer et mettre à jour les fiches familles.', to: '/beneficiaries', color: 'primary' },
    { title: 'Gestion des visites', desc: 'Enregistrer les visites terrain.', to: '/visits', color: 'warning' },
    { title: 'Gestion des aides', desc: 'Saisir les aides fournies.', to: '/aides', color: 'success' },
    { title: 'Localisation', desc: 'Enregistrer la position des familles.', to: '/localisation', color: 'secondary' },
    { title: 'Historique', desc: 'Consulter l’historique d’une famille.', to: '/history', color: 'info' },
];

const dashboardCards = computed(() => {
    switch (role.value) {
        case 'responsable': return responsableCards;
        case 'benevole': return benevoleCards;
        default: return [];
    }
});
</script>

<template>
    <div>
        <v-row class="mb-4">
            <v-col cols="12">
                <h1 class="text-h2 mb-2">Bienvenue, {{ authStore.user }}</h1>
                <v-chip color="primary" class="font-weight-bold text-uppercase">{{ authStore.role }}</v-chip>
            </v-col>
        </v-row>

        <!-- Admin Dashboard with Visualizations -->
        <v-row v-if="role === 'admin'">
            <v-col cols="12" sm="12" lg="8">
                <VisitsChart />
            </v-col>
            <v-col cols="12" sm="12" lg="4">
                <BeneficiaryStats />
            </v-col>
            <v-col cols="12">
                <RecentActivity />
            </v-col>
        </v-row>

        <!-- Other Roles Dashboard with Cards -->
        <v-row v-else>
            <v-col v-for="card in dashboardCards" :key="card.title" cols="12" sm="6" md="4">
                <v-card :to="card.to" link class="h-100 pa-4" elevation="10" rounded="lg">
                    <v-card-item>
                        <v-card-title class="font-weight-bold mb-2">{{ card.title }}</v-card-title>
                        <v-card-subtitle class="text-wrap">{{ card.desc }}</v-card-subtitle>
                    </v-card-item>
                    <v-card-actions>
                        <v-btn variant="text" :color="card.color">Accéder &rarr;</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
