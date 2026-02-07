<template>
  <section class="beneficiaries-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Bénéficiaires</p>
        <h2>{{ isEdit ? 'Modifier la famille' : 'Nouvelle famille' }}</h2>
        <p class="subtle">{{ isEdit ? 'Mise à jour des informations.' : 'Ajout d\'une nouvelle famille bénéficiaire.' }}</p>
      </div>
    </header>

    <div class="form-card">
      <form @submit.prevent="saveFamily">
        <BeneficiaryFormFields v-if="family" v-model="family" />
        <div class="form-actions">
          <button type="submit" class="btn btn-success">Sauvegarder</button>
          <router-link to="/beneficiaries" class="btn btn-secondary">Annuler</router-link>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BeneficiaryFormFields from '@/components/beneficiaries/BeneficiaryFormFields.vue';
import { beneficiaries } from '@/data/beneficiaries';
import type { Beneficiary } from '@/types/beneficiary';

const route = useRoute();
const router = useRouter();

const isEdit = ref(false);
const family = ref<Beneficiary | null>(null);

onMounted(() => {
  const familyId = route.params.id;
  if (familyId) {
    isEdit.value = true;
    const existingFamily = beneficiaries.find(f => f.id === Number(familyId));
    family.value = existingFamily ? { ...existingFamily } : null;
  } else {
    isEdit.value = false;
    family.value = {
      id: Date.now(),
      name: '',
      address: '',
      members: 1,
      socialStatus: '',
      phone: '',
      cin: '',
      archived: false,
    };
  }
});

const saveFamily = () => {
  if (family.value) {
    if (isEdit.value) {
      const index = beneficiaries.findIndex(f => f.id === family.value!.id);
      if (index !== -1) {
        beneficiaries[index] = family.value;
      }
    } else {
      beneficiaries.push(family.value);
    }
    router.push('/beneficiaries');
  }
};
</script>

<style scoped>
.beneficiaries-page {
  --ink: #0f172a;
  --muted: #6b7280;
  --brand: #0f766e;
  --brand-contrast: #ffffff;
  background: linear-gradient(180deg, #f7f8fb 0%, #eef2f7 100%);
  min-height: 100%;
  padding: 28px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 6px;
}

h2 {
  margin: 0;
  font-size: 26px;
  color: var(--ink);
}

.subtle {
  margin: 6px 0 0;
  color: var(--muted);
}

.form-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
  padding: 32px;
  max-width: 700px;
}

.form-actions {
  margin-top: 32px;
  display: flex;
  gap: 12px;
}

.btn {
  border: 1px solid transparent;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-success {
  background: var(--brand);
  color: var(--brand-contrast);
  box-shadow: 0 4px 12px rgba(15, 118, 110, 0.2);
}

.btn-secondary {
  background: #ffffff;
  border-color: #d1d5db;
  color: #374151;
}

.btn:hover {
  filter: brightness(0.95);
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}
</style>
