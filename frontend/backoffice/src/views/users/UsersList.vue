<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Utilisateurs</p>
        <h2>Gestion des Utilisateurs</h2>
        <p class="subtle">Gérer les comptes et les accès.</p>
      </div>
      <router-link to="/users/new" class="btn btn-primary">Ajouter un utilisateur</router-link>
    </header>

    <div class="table-card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userList" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <span class="status-chip" :class="user.status === 'Active' ? 'is-active' : 'is-archived'">
                  {{ user.status }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <router-link :to="`/users/edit/${user.id}`" class="btn btn-sm btn-warning">Modifier</router-link>
                  <button @click="deleteUser(user.id)" class="btn btn-sm btn-danger">Supprimer</button>
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
import { users } from '@/data/users';
import type { User } from '@/types/user';

const userList = ref<User[]>(users);

const deleteUser = (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    const index = userList.value.findIndex(u => u.id === id);
    if (index !== -1) userList.value.splice(index, 1);
  }
};
</script>

<style scoped>
/* Reuse the same CSS as Beneficiaries */
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
.table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 800px; }
.table th { text-align: left; padding: 14px 16px; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #475569; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.table td { padding: 14px 16px; border-bottom: 1px solid #edf2f7; color: var(--ink); }
.table tbody tr:hover { background: #f5f7fb; }
.actions { display: flex; align-items: center; gap: 8px; }
.status-chip { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #dcfce7; color: #166534; }
.status-chip.is-archived { background: #fee2e2; color: #b91c1c; }
.btn { padding: 8px 12px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; text-decoration: none; border: none; display: inline-flex; }
.btn-primary { background: var(--brand); color: var(--brand-contrast); }
.btn-warning { background: #f59e0b; color: #fff; }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 6px 10px; font-size: 12px; }
.btn:hover { filter: brightness(0.95); }
</style>
