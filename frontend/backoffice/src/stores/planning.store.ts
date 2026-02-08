import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiFetch } from '@/services/api';

export interface PlanningItem {
    id: string;
    dateTournee: string;
    zone: string;
    status: string;
    assignedBenevole?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    beneficiaire?: {
        id: string;
        nomFamille: string;
        adresse: string;
    };
}

export const usePlanningStore = defineStore('planning', () => {
    const plannings = ref<PlanningItem[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchPlannings() {
        loading.value = true;
        try {
            const data = await apiFetch('/planning');
            plannings.value = data;
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function createPlanning(data: any) {
        loading.value = true;
        try {
            const newItem = await apiFetch('/planning', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            plannings.value.push(newItem);
            return newItem;
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        plannings,
        loading,
        error,
        fetchPlannings,
        createPlanning
    };
});
