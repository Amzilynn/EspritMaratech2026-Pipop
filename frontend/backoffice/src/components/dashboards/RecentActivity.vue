<script setup lang="ts">
import { ref } from 'vue';
import { UserPlusIcon, GiftIcon, TruckDeliveryIcon, FileTextIcon } from 'vue-tabler-icons';

const activity = ref([
    {
        title: 'Nouvelle famille inscrite',
        subtitle: 'Famille Ben Ali - Zone Nord',
        time: 'Il y a 2h',
        color: 'primary',
        icon: UserPlusIcon
    },
    {
        title: 'Distribution Alimentaire',
        subtitle: 'Lot #1245 distribué à 15 familles',
        time: 'Il y a 5h',
        color: 'success',
        icon: GiftIcon
    },
    {
        title: 'Visite de terrain',
        subtitle: 'Rapport soumis par Ahmed (Bénévole)',
        time: 'Hier',
        color: 'warning',
        icon: TruckDeliveryIcon
    },
    {
        title: 'Rapport Mensuel',
        subtitle: 'Généré automatiquement',
        time: '3 jours',
        color: 'info',
        icon: FileTextIcon
    }
]);
</script>

<template>
    <v-card elevation="10" class="withbg">
        <v-card-item>
            <v-card-title class="text-h5 mb-4">Activités Récentes</v-card-title>
            <v-timeline density="compact" side="end">
                <v-timeline-item v-for="item in activity" :key="item.title" :dot-color="item.color" size="x-small">
                    <template v-slot:icon>
                        <component :is="item.icon" size="14" class="text-white" />
                    </template>
                    <div class="d-flex justify-space-between align-center">
                        <div>
                            <h4 class="text-subtitle-1 font-weight-bold">{{ item.title }}</h4>
                            <p class="text-body-2 text-muted mt-1">{{ item.subtitle }}</p>
                        </div>
                        <span class="text-caption text-muted">{{ item.time }}</span>
                    </div>
                </v-timeline-item>
            </v-timeline>
        </v-card-item>
    </v-card>
</template>
