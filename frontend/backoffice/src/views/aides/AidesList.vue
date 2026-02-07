<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Aides</p>
        <h2>Gestion des Aides</h2>
        <p class="subtle">Suivi des aides distribuées.</p>
      </div>
      <router-link to="/aides/new" class="btn btn-primary">Nouvelle aide</router-link>
    </header>

    <div class="table-card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Bénéficiaire</th>
              <th>Type</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="aide in aideList" :key="aide.id">
              <td>{{ aide.beneficiary }}</td>
              <td>{{ aide.type }}</td>
              <td>{{ aide.amount }}</td>
              <td>{{ aide.date }}</td>
              <td>
                <span class="status-chip" :class="aide.status === 'Validé' ? 'is-valid' : 'is-pending'">
                  {{ aide.status }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <router-link :to="`/aides/edit/${aide.id}`" class="btn btn-sm btn-warning">Modifier</router-link>
                  <button @click="deleteAide(aide.id)" class="btn btn-sm btn-danger">Supprimer</button>
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
import { ref } from 'vue';
import { aides } from '@/data/aides';
import type { Aide } from '@/types/aide';

const aideList = ref<Aide[]>(aides);

const deleteAide = (id: number) => {
  if (confirm('Supprimer cette aide ?')) {
    const index = aideList.value.findIndex(a => a.id === id);
    if (index !== -1) aideList.value.splice(index, 1);
  }
};
</script>

<style scoped>
.page-container {
  --ink: #0f172a;
  --muted: #6b7280;
  --brand: #0f766e;
  background: linear-gradient(180deg, #f7f8fb 0%, #eef2f7 100%);
  min-height: 100%;
  padding: 28px;
}
.page-header { margin-bottom: 30px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: var(--muted); margin: 0 0 6px; }
h2 { margin: 0; font-size: 26px; color: var(--ink); }
.subtle { margin: 6px 0 0; color: var(--muted); }
.table-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08); }
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 600px; }
.table th { text-align: left; padding: 14px 16px; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #475569; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.table td { padding: 14px 16px; border-bottom: 1px solid #edf2f7; color: var(--ink); }
.status-chip { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.is-valid { background: #dcfce7; color: #166534; }
.is-pending { background: #fef3c7; color: #92400e; }
.actions { display: flex; align-items: center; gap: 8px; }
.btn { padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
.btn-primary { background: #0f766e; color: #fff; padding: 10px 20px; font-weight: 600; }
.btn-warning { background: #f59e0b; color: #fff; }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 6px 10px; font-size: 12px; }
.btn:hover { filter: brightness(0.95); }
</style>
