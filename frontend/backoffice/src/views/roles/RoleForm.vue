<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Administration</p>
        <h2>{{ isEdit ? 'Modifier Rôle' : 'Nouveau Rôle' }}</h2>
      </div>
    </header>
    <div class="form-card">
      <form @submit.prevent="saveRole">
        <div class="mb-3">
          <label class="form-label">Nom du rôle</label>
          <input type="text" class="form-control" v-model="form.name" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" v-model="form.description" rows="3"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-success">Sauvegarder</button>
          <router-link to="/roles" class="btn btn-secondary">Annuler</router-link>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { roles } from '@/data/roles';
import type { Role } from '@/types/role';

const route = useRoute();
const router = useRouter();
const isEdit = ref(false);
const form = ref<Role>({ id: 0, name: '', description: '', permissions: [] });

onMounted(() => {
  const id = Number(route.params.id);
  if (id) {
    isEdit.value = true;
    const found = roles.find(r => r.id === id);
    if (found) form.value = { ...found };
  } else {
    form.value.id = Date.now();
  }
});

const saveRole = () => {
  if (isEdit.value) {
    const idx = roles.findIndex(r => r.id === form.value.id);
    if (idx !== -1) roles[idx] = form.value;
  } else {
    roles.push(form.value);
  }
  router.push('/roles');
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
.page-header { margin-bottom: 24px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: var(--muted); margin: 0 0 6px; }
h2 { margin: 0; font-size: 26px; color: var(--ink); }
.form-card { background: #ffffff; padding: 32px; border-radius: 14px; box-shadow: 0 10px 28px rgba(15,23,42,0.08); max-width: 600px; }
.mb-3 { margin-bottom: 16px; }
.form-label { display: block; margin-bottom: 8px; font-weight: 500; color: var(--ink); }
.form-control { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; }
.form-actions { display: flex; gap: 12px; margin-top: 24px; }
.btn { padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; text-decoration: none; }
.btn-success { background: var(--brand); color: #fff; }
.btn-secondary { background: #fff; border: 1px solid #d1d5db; color: #374151; }
</style>
