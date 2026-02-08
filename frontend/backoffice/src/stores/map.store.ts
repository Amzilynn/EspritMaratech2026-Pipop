import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiFetch } from '@/services/api';

export const useMapStore = defineStore('map', () => {
    const beneficiaries = ref<any[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Filters
    const minScore = ref(0);
    const selectedRegion = ref<string | null>(null);

    async function fetchMapData() {
        loading.value = true;
        try {
            const data = await apiFetch('/beneficiaires');
            // Filter out archived
            beneficiaries.value = data.filter((b: any) => b.active !== false);
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    const filteredData = computed(() => {
        return beneficiaries.value.filter(b => {
            const scoreMatch = (b.vulnerabilityScore || 0) >= minScore.value;
            const regionMatch = !selectedRegion.value || (b.adresse || '').includes(selectedRegion.value);
            return scoreMatch && regionMatch;
        });
    });

    const heatmapPoints = computed(() => {
        return filteredData.value
            .filter(b => b.latitude && b.longitude)
            .map(b => [
                b.latitude,
                b.longitude,
                (b.vulnerabilityScore || 0) / 100 // Intensity between 0 and 1
            ]);
    });

    return {
        beneficiaries,
        loading,
        error,
        minScore,
        selectedRegion,
        fetchMapData,
        filteredData,
        heatmapPoints
    };
});
