<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiFetch } from '@/services/api';
import { UserPlusIcon, GiftIcon, TruckDeliveryIcon, FileTextIcon } from 'vue-tabler-icons';

const activity = ref<any[]>([]);
const isLoading = ref(true);

async function fetchRecentActivity() {
    isLoading.value = true;
    try {
        // Fetch visits as the primary source of activity
        const visits = await apiFetch('/visits').catch(() => []);
        
        // Transform visits into timeline items
        activity.value = visits
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((v: any) => ({
                title: v.visitorName || 'Visite Terrain',
                subtitle: v.notes ? `Mission: ${v.notes.substring(0, 40)}...` : 'Suivi famille effectué.',
                time: new Date(v.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
                color: 'primary',
                icon: TruckDeliveryIcon
            }));

        // Add dummy entry if empty
        if (activity.value.length === 0) {
            activity.value = [
                { title: 'Système Opérationnel', subtitle: 'Base de données synchronisée.', time: 'Maintenant', color: 'success', icon: FileTextIcon }
            ];
        }
    } catch (err) {
        console.error('Timeline error:', err);
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchRecentActivity);
</script>

<template>
    <v-card elevation="10" rounded="xl" class="border">
        <v-card-item>
            <div class="d-flex align-center justify-space-between mb-6">
                <v-card-title class="text-h5 font-weight-bold">Flux d'Activité Terrain</v-card-title>
                <VBtn variant="text" size="small" color="primary" class="text-none">Voir tout l'historique</VBtn>
            </div>

            <div v-if="isLoading" class="text-center py-6">
                <VProgressCircular indeterminate color="primary" size="32" />
            </div>

            <v-timeline v-else density="compact" side="end">
                <v-timeline-item v-for="(item, idx) in activity" :key="idx" :dot-color="item.color" size="x-small">
                    <template v-slot:icon>
                        <component :is="item.icon" size="14" class="text-white" />
                    </template>
                    <div class="d-flex justify-space-between align-center mb-4">
                        <div class="pr-4">
                            <h4 class="text-subtitle-2 font-weight-black">{{ item.title }}</h4>
                            <p class="text-caption text-grey-darken-1 mt-1 line-height-tight">{{ item.subtitle }}</p>
                        </div>
                        <VChip size="x-small" variant="tonal" color="grey" class="font-weight-bold">{{ item.time }}</VChip>
                    </div>
                </v-timeline-item>
            </v-timeline>
        </v-card-item>
    </v-card>
</template>

<style scoped>
.line-height-tight { line-height: 1.25; }
</style>
