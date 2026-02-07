<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Administration</p>
        <h2>Rôles & Accès</h2>
        <p class="subtle">Définir les rôles et permissions.</p>
      </div>
      <router-link to="/roles/new" class="btn btn-primary">Ajouter un rôle</router-link>
    </header>

    <div class="table-card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Nom du Rôle</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roleList" :key="role.id">
              <td>{{ role.name }}</td>
              <td>{{ role.description }}</td>
              <td>
                <div class="actions">
                  <router-link :to="`/roles/edit/${role.id}`" class="btn btn-sm btn-warning">Modifier</router-link>
                  <button @click="deleteRole(role.id)" class="btn btn-sm btn-danger">Supprimer</button>
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
import { roles } from '@/data/roles';
import type { Role } from '@/types/role';

const roleList = ref<Role[]>(roles);

const deleteRole = (id: number) => {
  if (confirm('Supprimer ce rôle ?')) {
    const index = roleList.value.findIndex(r => r.id === id);
    if (index !== -1) roleList.value.splice(index, 1);
  }
};
</script>

<style scoped>
.page-container {
  --ink: #0f172a;
  --muted: #6b7280;
  --brand: #0f766e;
  --brand-contrast: #ffffff;
  background: linear-gradient(180deg, #f7f8fb 0%, #eef2f7 100%);
  min-height: 100%;
  padding: 28px;
}
.page-header { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 20px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: var(--muted); margin: 0 0 6px; }
h2 { margin: 0; font-size: 26px; color: var(--ink); }
.subtle { margin: 6px 0 0; color: var(--muted); }
.table-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08); }
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 600px; }
.table th { text-align: left; padding: 14px 16px; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #475569; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.table td { padding: 14px 16px; border-bottom: 1px solid #edf2f7; color: var(--ink); }
.table tbody tr:hover { background: #f5f7fb; }
.actions { display: flex; align-items: center; gap: 8px; }
.btn { padding: 8px 12px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; text-decoration: none; border: none; display: inline-flex; }
.btn-primary { background: var(--brand); color: var(--brand-contrast); }
.btn-warning { background: #f59e0b; color: #fff; }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 6px 10px; font-size: 12px; }
.btn:hover { filter: brightness(0.95); }
</style>
