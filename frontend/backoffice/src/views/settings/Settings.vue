<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import {
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VCardText,
    VDivider,
    VSwitch,
    VSelect,
    VBtn,
    VIcon,
    VSlider,
    VTextField,
} from 'vuetify/components';

const authStore = useAuthStore();

// Simulation of settings state
const settings = ref({
    notifications: true,
    darkMode: false,
    defaultRegion: 'National',
    dashboardInterval: '7 jours',
    vulnerabilityThreshold: 70,
    language: 'Français',
});

const saveSettings = () => {
    // In a real app, this would save to local storage or an API
    alert('Paramètres enregistrés avec succès !');
};

const regions = ['National', 'Tunis', 'Siliana', 'Kasserine', 'Sousse', 'Gabès', 'Tataouine'];
const intervals = ['24 heures', '7 jours', '30 jours', 'Année'];
</script>

<template>
    <VContainer fluid class="pa-6">
        <VRow class="mb-4">
            <VCol cols="12">
                <h1 class="text-h3 font-weight-bold mb-1">Paramètres du Système</h1>
                <p class="text-subtitle-1 text-grey-darken-1">Configuration de votre espace de travail et des seuils d'alerte.</p>
            </VCol>
        </VRow>

        <VRow>
            <!-- User Profile Section -->
            <VCol cols="12" md="4">
                <VCard rounded="xl" elevation="2" class="pa-4 mb-6">
                    <div class="text-center px-4 py-6">
                        <VAvatar color="primary" size="80" class="mb-4">
                            <span class="text-h4 text-white uppercase">{{ authStore.email?.charAt(0) }}</span>
                        </VAvatar>
                        <h2 class="text-h5 font-weight-bold">{{ authStore.email?.split('@')[0] }}</h2>
                        <VChip color="primary" variant="tonal" size="small" class="mt-2 text-uppercase font-weight-bold">
                            {{ authStore.role }}
                        </VChip>
                    </div>
                    <VDivider />
                    <VCardText class="pa-4">
                        <div class="d-flex align-center mb-4">
                            <VIcon icon="mdi-email-outline" class="mr-3 text-grey" />
                            <div>
                                <div class="text-caption text-grey">Email Professionnel</div>
                                <div class="text-body-1">{{ authStore.email }}</div>
                            </div>
                        </div>
                    </VCardText>
                </VCard>
            </VCol>

            <!-- Configuration Section -->
            <VCol cols="12" md="8">
                <VCard rounded="xl" elevation="2" class="mb-6 overflow-hidden">
                    <VCardTitle class="bg-grey-lighten-4 pa-4 font-weight-bold">
                        <VIcon icon="mdi-cog-outline" class="mr-2" /> Préférences Dashboard
                    </VCardTitle>
                    <VCardText class="pa-6">
                        <VRow>
                            <VCol cols="12" sm="6">
                                <VSelect
                                    v-model="settings.defaultRegion"
                                    :items="regions"
                                    label="Région par défaut"
                                    variant="outlined"
                                    density="comfortable"
                                />
                            </VCol>
                            <VCol cols="12" sm="6">
                                <VSelect
                                    v-model="settings.dashboardInterval"
                                    :items="intervals"
                                    label="Période d'analyse par défaut"
                                    variant="outlined"
                                    density="comfortable"
                                />
                            </VCol>
                            <VCol cols="12">
                                <div class="d-flex justify-space-between align-center mb-2">
                                    <label class="text-subtitle-2 font-weight-bold">Seuil d'urgence (Vitesse de réaction)</label>
                                    <VChip size="small" color="error" variant="flat">{{ settings.vulnerabilityThreshold }}%</VChip>
                                </div>
                                <VSlider
                                    v-model="settings.vulnerabilityThreshold"
                                    min="40"
                                    max="90"
                                    step="5"
                                    color="error"
                                    track-color="error-lighten-4"
                                    hide-details
                                />
                                <p class="text-caption text-grey mt-2">Définit le score à partir duquel une famille est marquée comme "Critique" sur votre accueil.</p>
                            </VCol>
                        </VRow>
                    </VCardText>
                </VCard>

                <VCard rounded="xl" elevation="2" class="mb-6 overflow-hidden">
                    <VCardTitle class="bg-grey-lighten-4 pa-4 font-weight-bold">
                        <VIcon icon="mdi-bell-outline" class="mr-2" /> Notifications & Interface
                    </VCardTitle>
                    <VCardText class="pa-6">
                        <div class="d-flex justify-space-between align-center mb-4">
                            <div>
                                <div class="font-weight-bold text-subtitle-1">Alertes de Stock</div>
                                <div class="text-caption text-grey">Recevoir une notification quand les ressources sont faibles.</div>
                            </div>
                            <VSwitch v-model="settings.notifications" color="primary" hide-details />
                        </div>
                        <VDivider class="mb-4" />
                        <div class="d-flex justify-space-between align-center">
                            <div>
                                <div class="font-weight-bold text-subtitle-1">Mode Sombre</div>
                                <div class="text-caption text-grey">Optimiser l'interface pour les environnements peu éclairés.</div>
                            </div>
                            <VSwitch v-model="settings.darkMode" color="primary" hide-details />
                        </div>
                    </VCardText>
                </VCard>

                <div class="text-right">
                    <VBtn color="primary" size="large" rounded="pill" class="px-8 font-weight-bold" @click="saveSettings">
                        Appliquer les modifications
                    </VBtn>
                </div>
            </VCol>
        </VRow>
    </VContainer>
</template>
