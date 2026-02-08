<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Suivi</p>
        <h2>{{ isEdit ? 'Modifier Visite' : 'Nouvelle Visite' }}</h2>
      </div>
    </header>
    <div class="form-card">
      <form @submit.prevent="saveVisit">
        <div class="field-group">
          <label class="field-label">Bénéficiaire</label>
          <select class="field-input" v-model="form.beneficiaryId" required>
            <option value="" disabled>Sélectionner un bénéficiaire</option>
            <option v-for="b in beneficiaries" :key="b.id" :value="b.id">
              {{ b.firstName }} {{ b.lastName }}
            </option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Date de visite (Automatique)</label>
          <input type="date" class="field-input" v-model="form.date" disabled />
        </div>
        <!-- Visitor is authenticated user -->
        <div class="field-group">
          <label class="field-label">Notes</label>
          <textarea class="field-input" v-model="form.notes" rows="4" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-success">Sauvegarder</button>
          <router-link to="/visits" class="btn btn-secondary">Annuler</router-link>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiFetch } from '@/services/api';

const route = useRoute();
const router = useRouter();
const isEdit = ref(false);
const form = ref({
    id: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    beneficiaryId: '' 
});

const beneficiaries = ref<any[]>([]);

const loadBeneficiaries = async () => {
    try {
        const data = await apiFetch('/beneficiaires');
        beneficiaries.value = data;
    } catch(e) { console.error('Error loading beneficiaries', e); }
};

onMounted(async () => {
  await loadBeneficiaries();
  // Check if ID exists and is not 'new' or empty (router sometimes passes artifacts)
  const id = route.params.id;
  if (id && id !== 'new') {
    isEdit.value = true;
    try {
        const visit = await apiFetch(`/visits/${id}`);
        form.value = {
            id: visit.id,
            date: visit.date ? new Date(visit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            notes: visit.notes || '',
            beneficiaryId: visit.visitBeneficiaires?.[0]?.beneficiaire?.id || ''
        };
    } catch(e) { console.error('Error loading visit', e); }
  }
});

const saveVisit = async () => {
  try {
       // Construct payload matching backend expectations
       const payload = {
           notes: form.value.notes,
           // For simple visits, we associate one beneficiary. Backend expects 'associations' array.
           associations: [{ 
               beneficiaryId: form.value.beneficiaryId, 
               aids: [] // Can extend to add aids here later
           }]
       };

       if (isEdit.value) {
           await apiFetch(`/visits/${form.value.id}`, { 
               method: 'PATCH', 
               body: JSON.stringify({ notes: form.value.notes }) // Update currently only supports simple fields easily
           });
       } else {
           await apiFetch('/visits', { 
               method: 'POST', 
               body: JSON.stringify(payload) 
           });
       }
       router.push('/visits');
  } catch(e) {
      alert('Erreur lors de la sauvegarde');
      console.error(e);
  }
};
</script>

<style scoped>
.page-container { background: linear-gradient(180deg, #f7f8fb 0%, #eef2f7 100%); min-height: 100%; padding: 28px; }
.page-header { margin-bottom: 24px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: #6b7280; margin: 0 0 6px; }
h2 { margin: 0; font-size: 26px; color: #0f172a; }
.form-card { background: #ffffff; padding: 32px; border-radius: 14px; box-shadow: 0 10px 28px rgba(15,23,42,0.08); max-width: 600px; }
.field-group { margin-bottom: 20px; display: flex; flex-direction: column; }
.field-label { font-weight: 600; margin-bottom: 8px; color: #374151; font-size: 14px; }
.field-input { padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; }
.field-input:focus { outline: none; border-color: #0f766e; box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1); }
.form-actions { display: flex; gap: 12px; margin-top: 24px; }
.btn { padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
.btn-success { background: #0f766e; color: #fff; }
.btn-secondary { background: #fff; border: 1px solid #d1d5db; color: #374151; }
</style>
