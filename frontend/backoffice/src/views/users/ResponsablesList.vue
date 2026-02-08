<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user.store';
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
  VDialog,
  VSpacer,
  VToolbar,
  VAlert,
} from 'vuetify/components';

// -------------------- STORE --------------------
const userStore = useUserStore();

// -------------------- STATE --------------------
const search = ref('');
const dialog = ref(false);
const deleteDialog = ref(false);
const userToDelete = ref<any>(null);
const isEdit = ref(false);
const formLoading = ref(false);
const formError = ref('');

// -------------------- FORM --------------------
const initialForm = {
  id: undefined as number | undefined,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roleName: 'RESPONSABLE_TERRAIN', // Default role for this view
};
const form = ref({ ...initialForm });

// -------------------- FETCH DATA --------------------
onMounted(async () => {
  await userStore.fetchAllUsers();
});

// -------------------- COMPUTED --------------------
// Get only Responsables
const responsablesList = computed(() => 
  userStore.allUsers.filter((u: any) => 
    u.role?.name === 'RESPONSABLE_TERRAIN' || u.role?.name === 'RESPONSABLE'
  )
);

const filteredUsers = computed(() =>
  responsablesList.value.filter((u: any) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.value.toLowerCase())
  )
);

const isLoading = computed(() => userStore.loading);

// -------------------- DIALOGS --------------------
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
    roleName: 'RESPONSABLE_TERRAIN',
  };
  formError.value = '';
  dialog.value = true;
}

// -------------------- SAVE --------------------
async function saveUser() {
  formError.value = '';
  if (!form.value.firstName || !form.value.lastName || !form.value.email) {
    formError.value = 'Tous les champs sont obligatoires.';
    return;
  }
  if (!isEdit.value && !form.value.password) {
    formError.value = 'Mot de passe obligatoire.';
    return;
  }

  formLoading.value = true;
  try {
    if (isEdit.value) {
      // Update
      const { id, password, ...rest } = form.value;
      const payload = password ? { ...rest, password } : rest;
      await userStore.updateUser(id!, payload);
    } else {
      // Create
      await userStore.createUser(form.value);
    }
    dialog.value = false;
    // Refresh list is automatic via store reactivity
    await userStore.fetchAllUsers(); // Optional refresh to be sure
  } catch (err: any) {
    formError.value = err.message || 'Erreur lors de la sauvegarde.';
  } finally {
    formLoading.value = false;
  }
}

// -------------------- DELETE --------------------
function confirmDelete(user: any) {
  userToDelete.value = user;
  deleteDialog.value = true;
}

async function deleteUser() {
  if (!userToDelete.value) return;
  try {
    await userStore.deleteUser(userToDelete.value.id);
    deleteDialog.value = false;
  } catch (err: any) {
    alert(err.message || 'Erreur lors de la suppression.');
  }
}
</script>

<template>
  <VContainer fluid class="pa-6">
    <!-- HEADER -->
    <VRow class="mb-6 align-center">
      <VCol cols="12" sm="8">
        <p class="text-overline mb-1 text-primary font-weight-bold">Administration</p>
        <h1 class="text-h3 font-weight-bold mb-2">Responsables Terrain</h1>
        <p class="text-body-1 text-grey-darken-1">Gérer les superviseurs des équipes de bénévoles.</p>
      </VCol>
      <VCol cols="12" sm="4" class="text-right">
        <VBtn 
          color="primary" 
          prepend-icon="mdi-account-plus" 
          size="large" 
          rounded="lg" 
          elevation="4" 
          @click="openAddDialog"
          aria-label="Ajouter un nouveau responsable"
        >
          Nouveau Responsable
        </VBtn>
      </VCol>
    </VRow>

    <!-- SEARCH -->
    <VToolbar color="white" flat class="mb-4 border-b">
      <VTextField
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Chercher un responsable..."
        hide-details
        density="compact"
        variant="solo-filled"
        rounded="pill"
        flat
        style="max-width: 400px"
        aria-label="Recherche responsable"
      />
      <VSpacer />
    </VToolbar>

    <!-- TABLE -->
    <VCard rounded="xl" elevation="10" class="overflow-x-auto">
      <v-simple-table>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="text-left py-3 px-4">Responsable</th>
            <th class="text-left py-3 px-4">Email</th>
            <th class="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="3" class="text-center pa-4">Chargement...</td>
          </tr>
          <tr v-else-if="filteredUsers.length === 0">
            <td colspan="3" class="text-center pa-4 text-grey">Aucun responsable trouvé.</td>
          </tr>
          <tr v-for="user in filteredUsers" :key="user.id" class="hover-row">
            <td class="d-flex align-center py-3 px-4">
              <VAvatar color="primary" variant="tonal" size="40" class="mr-3">
                <span class="font-weight-bold">{{ user.firstName?.[0] }}{{ user.lastName?.[0] }}</span>
              </VAvatar>
              <div>
                <div class="font-weight-bold">{{ user.firstName }} {{ user.lastName }}</div>
              </div>
            </td>
            <td class="py-3 px-4 text-body-2">{{ user.email }}</td>
            <td class="d-flex justify-end align-center gap-2 py-3 px-4">
              <VBtn 
                icon 
                variant="text" 
                color="primary" 
                size="small" 
                @click="editUser(user)"
                aria-label="Modifier ce responsable"
              >
                <VIcon>mdi-pencil-outline</VIcon>
              </VBtn>
              <VBtn 
                icon 
                variant="text" 
                color="error" 
                size="small" 
                @click="confirmDelete(user)"
                aria-label="Supprimer ce responsable"
              >
                <VIcon>mdi-delete-outline</VIcon>
              </VBtn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </VCard>

    <!-- DIALOGS -->
    <VDialog v-model="dialog" max-width="500px" persistent>
      <VCard rounded="xl" class="pa-4">
        <VCardTitle class="text-h5 font-weight-bold d-flex align-center">
          <VIcon color="primary" class="mr-2">mdi-account-tie</VIcon>
          {{ isEdit ? 'Modifier Responsable' : 'Nouveau Responsable' }}
        </VCardTitle>
        <VCardText class="mt-4">
          <VAlert v-if="formError" type="error" variant="tonal" class="mb-4" closable>{{ formError }}</VAlert>
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
                :placeholder="isEdit ? 'Laisser vide pour conserver' : ''"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions class="px-6 pb-6">
          <VSpacer />
          <VBtn variant="text" @click="dialog = false">Annuler</VBtn>
          <VBtn color="primary" variant="flat" rounded="lg" @click="saveUser" :loading="formLoading">
            {{ isEdit ? 'Sauvegarder' : 'Créer' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- DELETE DIALOG -->
    <VDialog v-model="deleteDialog" max-width="400px">
      <VCard rounded="xl" class="pa-4 text-center">
        <VIcon color="error" size="64" class="mb-4">mdi-alert-circle-outline</VIcon>
        <h3 class="text-h5 font-weight-bold mb-2">Confirmer la suppression ?</h3>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          Action irréversible pour <strong>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</strong>.
        </p>
        <div class="d-flex justify-center gap-4">
          <VBtn variant="text" @click="deleteDialog = false">Annuler</VBtn>
          <VBtn color="error" variant="flat" rounded="lg" @click="deleteUser">Supprimer</VBtn>
        </div>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<style scoped>
.border-b { border-bottom: 1px solid rgba(0,0,0,0.05) !important; }
.gap-2 { gap: 8px; }
.overflow-x-auto { overflow-x: auto; }
.hover-row:hover { background-color: rgba(0,0,0,0.02); }
</style>
