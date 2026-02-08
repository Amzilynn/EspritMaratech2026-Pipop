import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiFetch } from '@/services/api';

export interface Aid {
    id: number;
    type: string;
    quantite: number;
    natureIntervention: string;
    valeurEstimee?: number;
    dateDistribution: string;
    beneficiaryName?: string;
    visitBeneficiaire?: any;
    unite?: string;
}

export const useAidStore = defineStore('aid', () => {
    const aids = ref<Aid[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchAids() {
        loading.value = true;
        error.value = null;
        try {
            const data = await apiFetch('/visits/aids/all');
            aids.value = data.map((a: any) => ({
                ...a,
                beneficiaryName: a.visitBeneficiaire?.beneficiaire
                    ? `${a.visitBeneficiaire.beneficiaire.firstName} ${a.visitBeneficiaire.beneficiaire.lastName}`
                    : 'N/A',
            }));
        } catch (err: any) {
            error.value = err.message;
            console.error('Failed to fetch aids:', err);
        } finally {
            loading.value = false;
        }
    }

    async function deleteAid(id: number) {
        loading.value = true;
        try {
            await apiFetch(`/visits/aids/${id}`, { method: 'DELETE' });
            aids.value = aids.value.filter(a => a.id !== id);
        } catch (err: any) {
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createAid(visitIdOrVbId: string, payload: any) {
        loading.value = true;
        try {
            // Backend might expect POST /visits/:id/aids or similar.
            // Requirement said POST /visits/:id/aids
            const data = await apiFetch(`/visits/${visitIdOrVbId}/aids`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            await fetchAids();
            return data;
        } catch (err: any) {
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateAid(id: string, payload: any) {
        loading.value = true;
        try {
            const data = await apiFetch(`/visits/aids/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            await fetchAids();
            return data;
        } catch (err: any) {
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        aids,
        loading,
        error,
        fetchAids,
        deleteAid,
        createAid,
        updateAid
    };
});
