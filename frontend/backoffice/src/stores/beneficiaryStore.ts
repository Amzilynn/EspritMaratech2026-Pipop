import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiFetch } from '@/services/api';

export const useBeneficiaryStore = defineStore('beneficiary', () => {
    const beneficiaries = ref<any[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchBeneficiaries() {
        isLoading.value = true;
        error.value = null;
        try {
            // First get the beneficiaries
            const data = await apiFetch('/beneficiaires');

            // Now get their scores
            const { data: scores } = await apiFetch('/intelligence/scores');

            // Merge them
            beneficiaries.value = data.map((b: any) => {
                const scoreData = scores.find((s: any) => s.beneficiary_id === b.id);
                return {
                    ...b,
                    score: scoreData?.vulnerabilityScore || 0,
                    riskLevel: scoreData?.riskLevel || 'UNKNOWN',
                    recommendations: scoreData?.recommendations || []
                };
            });
        } catch (err: any) {
            error.value = err.message;
            console.error('Failed to fetch beneficiaries:', err);
        } finally {
            isLoading.value = false;
        }
    }

    async function createBeneficiary(data: any) {
        isLoading.value = true;
        try {
            const newBeneficiary = await apiFetch('/beneficiaires', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            // Trigger score calculation
            await apiFetch('/intelligence/score', {
                method: 'POST',
                body: JSON.stringify(newBeneficiary)
            });

            await fetchBeneficiaries();
            return newBeneficiary;
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        beneficiaries,
        isLoading,
        error,
        fetchBeneficiaries,
        createBeneficiary
    };
});
