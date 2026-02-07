<template>
  <section class="beneficiaries-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Bénéficiaires</p>
        <h2>Gestion des Familles Bénéficiaires</h2>
        <p class="subtle">Suivi, édition et suppression des familles.</p>
      </div>
      <router-link v-if="canCreate" to="/beneficiaries/new" class="btn btn-primary">Ajouter une famille</router-link>
    </header>

    <div v-if="beneficiaryStore.isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des données...</p>
    </div>

    <div v-else-if="beneficiaryStore.error" class="error-state">
      <p>{{ beneficiaryStore.error }}</p>
      <button @click="beneficiaryStore.fetchBeneficiaries" class="btn btn-sm btn-primary">Réessayer</button>
    </div>

    <div v-else class="table-card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Nom de la famille</th>
              <th>Adresse</th>
              <th>Membres</th>
              <th>Score Vulnérabilité</th>
              <th>Statut Risque</th>
              <th>Téléphone</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="family in beneficiaryStore.beneficiaries" :key="family.id">
              <td>{{ family.nomFamille || family.name }}</td>
              <td>{{ family.adresse || family.address }}</td>
              <td>{{ family.nbMembres || family.members }}</td>
              <td>
                <div class="score-display">
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: family.score + '%', backgroundColor: getScoreColor(family.score) }"></div>
                  </div>
                  <span class="score-number">{{ family.score }}%</span>
                </div>
              </td>
              <td>
                <span class="status-chip" :class="family.riskLevel.toLowerCase()">
                  {{ family.riskLevel }}
                </span>
              </td>
              <td>{{ family.telephone || family.phone }}</td>
              <td>
                <div class="actions">
                  <router-link v-if="canEdit" :to="`/beneficiaries/edit/${family.id}`" class="btn btn-sm btn-warning">Modifier</router-link>
                  <button v-if="canDelete" @click="deleteFamily(family.id)" class="btn btn-sm btn-danger">
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useBeneficiaryStore } from '@/stores/beneficiaryStore';

const authStore = useAuthStore();
const beneficiaryStore = useBeneficiaryStore();

const role = computed(() => authStore.role);

const canCreate = computed(() => ['benevole', 'admin'].includes(role.value || ''));
const canEdit = computed(() => ['benevole', 'admin'].includes(role.value || ''));
const canDelete = computed(() => ['admin'].includes(role.value || ''));

onMounted(() => {
  beneficiaryStore.fetchBeneficiaries();
});

const getScoreColor = (score: number) => {
  if (score >= 80) return '#ef4444'; // Critical
  if (score >= 65) return '#f59e0b'; // High
  if (score >= 50) return '#3b82f6'; // Moderate
  return '#10b981'; // Low
};

const deleteFamily = (id: string | number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette famille ?')) {
    // Note: Implementation of delete API call would go here
    console.log('Delete beneficiary:', id);
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
  margin-bottom: 20px;
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

.table-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
}

.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 980px;
}

.table th {
  text-align: left;
  padding: 14px 16px;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #475569;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.table td {
  padding: 14px 16px;
  border-bottom: 1px solid #edf2f7;
  color: var(--ink);
}

.table tbody tr:hover {
  background: #f5f7fb;
}

.col-actions {
  width: 220px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  min-width: 60px;
}

.score-fill {
  height: 100%;
  transition: width 0.5s ease-out;
}

.score-number {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
  min-width: 35px;
}

.status-chip {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-chip.critical { background: #fee2e2; color: #991b1b; }
.status-chip.high { background: #ffedd5; color: #9a3412; }
.status-chip.moderate { background: #dbeafe; color: #1e40af; }
.status-chip.low { background: #dcfce7; color: #166534; }
.status-chip.minimal { background: #f3f4f6; color: #374151; }

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: rotate 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  border: 1px solid transparent;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--brand);
  color: var(--brand-contrast);
  box-shadow: 0 6px 16px rgba(15, 118, 110, 0.18);
}

.btn-warning {
  background: #f59e0b;
  color: #fff;
}

.btn-danger {
  background: #ef4444;
  color: #ffffff;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 12px;
}

.btn:hover {
  filter: brightness(0.95);
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

@media (max-width: 900px) {
  .beneficiaries-page {
    padding: 20px;
  }

  .table {
    min-width: 760px;
  }
}
</style>
