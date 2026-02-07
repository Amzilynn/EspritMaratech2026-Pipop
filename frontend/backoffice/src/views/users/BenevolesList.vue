<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiFetch } from '@/services/api';
import {
  VContainer,
  VRow,
  VCol,
  VBtn,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VTextField,
  VAvatar,
  VIcon,
  VChip,
  VDialog,
  VSelect,
  VSpacer,
  VToolbar,
  VAlert,
} from 'vuetify/components';

// Loading & data
const isLoading = ref(false);
const users = ref<any[]>([]);
const responsables = ref<any[]>([]);
const search = ref('');

// Dialog state
const dialog = ref(false);
const deleteDialog = ref(false);
const userToDelete = ref<any>(null);
const isEdit = ref(false);
const formLoading = ref(false);
const formError = ref('');

// Initial form
const initialForm = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roleName: 'BENEVOLE',
  responsableId: null,
};
const form = ref({ ...initialForm });

// Fetch users
async function fetchData() {
  isLoading.value = true;
  try {
    const data = await apiFetch('/users');
    users.value = data.filter((u: any) => u.role?.name === 'BENEVOLE');
    responsables.value = data.filter(
      (u: any) => u.role?.name === 'RESPONSABLE_TERRAIN' || u.role?.name === 'ADMIN'
    );
  } catch (err: any) {
    console.error('Failed to fetch data:', err);
  } finally {
    isLoading.value = false;
  }
}

// Computed filtered users (search)
const filteredUsers = computed(() =>
  users.value.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.value.toLowerCase())
  )
);

// Dialogs
function openAddDialog() {
  isEdit.value = false;
  form.value = { ...initialForm };
  formError.value = '';
  dialog.value = true;
}

function editUser(user: any) {
  isEdit.value = true;
  form.value = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: '',
    roleName: 'BENEVOLE',
    responsableId: user.responsable?.id || null,
  };
  formError.value = '';
  dialog.value = true;
}

// Validation
function validateForm() {
  if (!form.value.firstName || !form.value.lastName || !form.value.email) {
    formError.value = 'Prénom, Nom et Email sont obligatoires.';
    return false;
  }
  if (!isEdit.value && !form.value.password) {
    formError.value = 'Le mot de passe est obligatoire pour la création.';
    return false;
  }
  return true;
}

// Save / Update
async function saveUser() {
  if (!validateForm()) return;

  formLoading.value = true;
  formError.value = '';
  try {
    if (isEdit.value) {
      const { id, password, ...updateData } = form.value;
      const payload = password ? { ...updateData, password } : updateData;

      await apiFetch(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      // Update local array without moving row
      const index = users.value.findIndex(u => u.id === id);
      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          ...updateData,
          responsable:
            responsables.value.find(r => r.id === updateData.responsableId) || null,
        };
      }
    } else {
      const newUser = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(form.value),
        headers: { 'Content-Type': 'application/json' },
      });
      newUser.responsable = responsables.value.find(
        r => r.id === newUser.responsableId
      ) || null;
      users.value.push(newUser);
    }
    dialog.value = false;
  } catch (err: any) {
    formError.value =
      err.message ||
      (err.response?.data?.message as string) ||
      'Une erreur est survenue sur le serveur.';
  } finally {
    formLoading.value = false;
  }
}

// Delete
function confirmDelete(user: any) {
  userToDelete.value = user;
  deleteDialog.value = true;
}

async function deleteUser() {
  if (!userToDelete.value) return;
  try {
    await apiFetch(`/users/${userToDelete.value.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    // Remove locally immediately
    users.value = users.value.filter(u => u.id !== userToDelete.value.id);
    deleteDialog.value = false;
  } catch (err: any) {
    alert(
      err.message ||
        (err.response?.data?.message as string) ||
        'Erreur lors de la suppression.'
    );
  }
}

onMounted(fetchData);
</script>

<template>
  <VContainer fluid class="pa-6">
    <!-- Header -->
    <VRow class="mb-6 align-center">
      <VCol cols="12" sm="8">
        <p class="text-overline mb-1 text-primary font-weight-bold">Coopération</p>
        <h1 class="text-h3 font-weight-bold mb-2">Bénévoles</h1>
        <p class="text-body-1 text-grey-darken-1">Gérer les membres actifs et leurs responsables de terrain.</p>
      </VCol>
      <VCol cols="12" sm="4" class="text-right">
        <VBtn color="primary" prepend-icon="mdi-account-plus" size="large" rounded="lg" elevation="4" @click="openAddDialog">
          Nouveau Bénévole
        </VBtn>
      </VCol>
    </VRow>

    <!-- Search -->
    <VToolbar color="white" flat class="mb-4 border-b">
      <VTextField
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Chercher un bénévole..."
        hide-details
        density="compact"
        variant="solo-filled"
        rounded="pill"
        flat
        style="max-width: 400px"
      />
      <VSpacer />
    </VToolbar>

    <!-- Table -->
    <VCard rounded="xl" elevation="10" class="overflow-x-auto">
      <v-simple-table>
        <thead>
          <tr>
            <th>Bénévole</th>
            <th>Email</th>
            <th>Responsable Assigné</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="d-flex align-center">
              <VAvatar color="lightprimary" size="36" class="mr-2">
                <span class="text-primary font-weight-bold">{{ user.firstName[0] }}{{ user.lastName[0] }}</span>
              </VAvatar>
              {{ user.firstName }} {{ user.lastName }}
            </td>
            <td>{{ user.email }}</td>
            <td>
              <div v-if="user.responsable" class="d-flex align-center">
                <VIcon size="18" color="grey" class="mr-1">mdi-shield-account</VIcon>
                {{ user.responsable.firstName }} {{ user.responsable.lastName }}
              </div>
              <VChip v-else size="x-small" color="grey-lighten-2" variant="flat" class="text-grey">Non assigné</VChip>
            </td>
            <td class="d-flex gap-2">
              <VBtn icon color="primary" size="small" @click="editUser(user)">
                <VIcon>mdi-pencil-outline</VIcon>
              </VBtn>
              <VBtn icon color="error" size="small" @click="confirmDelete(user)">
                <VIcon>mdi-delete-outline</VIcon>
              </VBtn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </VCard>

    <!-- Add/Edit Dialog -->
    <VDialog v-model="dialog" max-width="500px" persistent>
      <VCard rounded="xl" class="pa-4">
        <VCardTitle class="text-h5 font-weight-bold d-flex align-center">
          <VIcon color="primary" class="mr-2">mdi-account-heart</VIcon>
          {{ isEdit ? 'Gérer le Bénévole' : 'Inscrire un Bénévole' }}
        </VCardTitle>
        <VCardText class="mt-4">
          <VAlert v-if="formError" type="error" variant="tonal" class="mb-4" closable>
            {{ formError }}
          </VAlert>
          <VRow>
            <VCol cols="6">
              <VTextField v-model="form.firstName" label="Prénom" variant="outlined" density="comfortable" />
            </VCol>
            <VCol cols="6">
              <VTextField v-model="form.lastName" label="Nom" variant="outlined" density="comfortable" />
            </VCol>
            <VCol cols="12">
              <VTextField v-model="form.email" label="Email" type="email" variant="outlined" density="comfortable" />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Mot de passe"
                type="password"
                variant="outlined"
                density="comfortable"
                :placeholder="isEdit ? 'Laisser vide pour ne pas changer' : ''"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                v-model="form.responsableId"
                :items="responsables"
                item-value="id"
                :item-props="(item: any) => ({ title: `${item.firstName} ${item.lastName}`, subtitle: item.email })"
                label="Responsable de Terrain"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-account-tie"
                clearable
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions class="px-6 pb-6">
          <VSpacer />
          <VBtn variant="text" @click="dialog = false">Annuler</VBtn>
          <VBtn color="primary" variant="flat" rounded="lg" class="px-8" @click="saveUser" :loading="formLoading">
            {{ isEdit ? 'Sauvegarder' : 'Confirmer' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Dialog -->
    <VDialog v-model="deleteDialog" max-width="400px">
      <VCard rounded="xl" class="pa-4 text-center">
        <VIcon color="error" size="64" class="mb-4">mdi-account-remove-outline</VIcon>
        <h3 class="text-h5 font-weight-bold mb-2">Retirer ce membre ?</h3>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          Cette action désactivera le compte de <strong>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</strong>.
        </p>
        <div class="d-flex justify-center gap-4">
          <VBtn variant="text" @click="deleteDialog = false">Annuler</VBtn>
          <VBtn color="error" variant="flat" rounded="lg" class="px-8" @click="deleteUser">Supprimer</VBtn>
        </div>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<style scoped>
.border-b { border-bottom: 1px solid rgba(0,0,0,0.05) !important; }
.mr-1 { margin-right: 4px; }
.mr-2 { margin-right: 8px; }
.gap-2 { gap: 8px; }
.overflow-x-auto { overflow-x: auto; }
</style>
