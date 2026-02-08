import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiFetch } from '@/services/api';

export interface Visit {
    id: number;
    date: string;
    notes: string;
    userId: number;
    beneficiaryName?: string;
    visitorName?: string;
    visitBeneficiaires?: any[];
    user?: any;
}

export const useVisitStore = defineStore('visit', () => {
    const visits = ref<Visit[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchVisits() {
        loading.value = true;
        error.value = null;
        try {
            const data = await apiFetch('/visits');
            visits.value = data.map((v: any) => ({
                ...v,
                beneficiaryName: v.visitBeneficiaires?.map((vb: any) => (vb.beneficiaire?.firstName || '') + ' ' + (vb.beneficiaire?.lastName || '')).join(', ') || 'N/A',
                visitorName: v.user ? (v.user.firstName + ' ' + v.user.lastName) : 'Inconnu'
            }));
        } catch (err: any) {
            error.value = err.message;
            console.error('Failed to fetch visits:', err);
        } finally {
            loading.value = false;
        }
    }

    async function deleteVisit(id: number) {
        loading.value = true;
        try {
            await apiFetch(`/visits/${id}`, { method: 'DELETE' });
            visits.value = visits.value.filter(v => v.id !== id);
        } catch (err: any) {
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createVisit(payload: any) {
        loading.value = true;
        try {
            const data = await apiFetch('/visits', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            await fetchVisits();
            return data;
        } catch (err: any) {
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateVisit(id: number, payload: any) {
        loading.value = true;
        try {
            const data = await apiFetch(`/visits/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            await fetchVisits();
            return data;
        } catch (err: any) {
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        visits,
        loading,
        error,
        fetchVisits,
        deleteVisit,
        createVisit,
        updateVisit
    };
});
