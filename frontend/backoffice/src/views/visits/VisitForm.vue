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
          <select class="field-input" v-model="form.beneficiary" required>
            <option value="Famille Ben Ali">Famille Ben Ali</option>
            <option value="Famille Trabelsi">Famille Trabelsi</option>
            <option value="Famille Gueddafi">Famille Gueddafi</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Date de visite</label>
          <input type="date" class="field-input" v-model="form.date" required />
        </div>
        <div class="field-group">
          <label class="field-label">Visiteur</label>
          <input type="text" class="field-input" v-model="form.visitor" required />
        </div>
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
import { visits } from '@/data/visits';
import type { Visit } from '@/types/visit';

const route = useRoute();
const router = useRouter();
const isEdit = ref(false);
const form = ref<Visit>({ id: 0, beneficiary: '', date: '', visitor: '', notes: '' });

onMounted(() => {
  const id = Number(route.params.id);
  if (id) {
    isEdit.value = true;
    const found = visits.find(v => v.id === id);
    if (found) form.value = { ...found };
  } else {
    form.value.id = Date.now();
  }
});

const saveVisit = () => {
  if (isEdit.value) {
    const idx = visits.findIndex(v => v.id === form.value.id);
    if (idx !== -1) visits[idx] = form.value;
  } else {
    visits.push(form.value);
  }
  router.push('/visits');
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
