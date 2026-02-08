<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiFetch } from '@/services/api';
import { useVisitStore } from '@/stores/visit.store';
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
  VTextarea,
  VIcon,
  VSelect,
  VSpacer,
  VAlert,
  VDivider,
} from 'vuetify/components';

// -------------------- STORES --------------------
const route = useRoute();
const router = useRouter();
const visitStore = useVisitStore();

// -------------------- STATE --------------------
const isEdit = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const form = ref({
  id: undefined as number | undefined,
  date: new Date().toISOString().split('T')[0],
  notes: '',
  beneficiaryId: null as number | null
});

const beneficiaries = ref<any[]>([]);

// -------------------- FETCH DATA --------------------
const loadBeneficiaries = async () => {
  try {
    const data = await apiFetch('/beneficiaires');
    beneficiaries.value = data.map((b: any) => ({
      ...b,
      fullName: b.nomFamille || (b.firstName + ' ' + (b.lastName || '')) || b.name
    }));
  } catch (err: any) {
    console.error('Error loading beneficiaries', err);
  }
};

onMounted(async () => {
  await loadBeneficiaries();
  const id = route.params.id;
  if (id && id !== 'new') {
    isEdit.value = true;
    loading.value = true;
    try {
      const visit = await apiFetch(`/visits/${id}`);
      form.value = {
        id: visit.id,
        date: visit.date ? new Date(visit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: visit.notes || '',
        beneficiaryId: visit.visitBeneficiaires?.[0]?.beneficiaire?.id || null
      };
    } catch (err: any) {
      error.value = 'Impossible de charger les détails de la visite.';
    } finally {
      loading.value = false;
    }
  }
});

// -------------------- SAVE --------------------
async function saveVisit() {
  if (!form.value.beneficiaryId || !form.value.notes) {
    error.value = 'Veuillez sélectionner un bénéficiaire et saisir des notes.';
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    if (isEdit.value) {
      await visitStore.updateVisit(form.value.id!, { notes: form.value.notes });
    } else {
      const payload = {
        notes: form.value.notes,
        associations: [{ 
          beneficiaryId: form.value.beneficiaryId, 
          aids: [] 
        }]
      };
      await visitStore.createVisit(payload);
    }
    router.push('/visits');
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la sauvegarde.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <VContainer fluid class="pa-6">
    <!-- HEADER -->
    <VRow class="mb-6 align-center">
      <VCol cols="12">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/visits" class="mb-4">Retour</v-btn>
        <p class="text-overline mb-1 text-primary font-weight-bold">Suivi Terrain</p>
        <h1 class="text-h3 font-weight-bold mb-2">{{ isEdit ? 'Modifier la visite' : 'Nouvelle visite' }}</h1>
        <p class="text-body-1 text-grey-darken-1">Enregistrez les détails de votre intervention sur le terrain.</p>
      </VCol>
    </VRow>

    <VRow justify="center">
      <VCol cols="12" md="8" lg="6">
        <VCard rounded="xl" elevation="10" class="pa-6">
          <VCardTitle class="px-0 pt-0 mb-6 font-weight-bold d-flex align-center">
            <VIcon color="primary" class="mr-2">mdi-clipboard-text-outline</VIcon>
            Détails de l'intervention
          </VCardTitle>

          <VAlert v-if="error" type="error" variant="tonal" class="mb-6" closable>
            {{ error }}
          </VAlert>

          <VRow>
            <VCol cols="12">
              <VSelect
                v-model="form.beneficiaryId"
                :items="beneficiaries"
                item-title="fullName"
                item-value="id"
                label="Bénéficiaire"
                variant="outlined"
                prepend-inner-icon="mdi-account-group"
                :disabled="isEdit"
                placeholder="Sélectionner la famille visitée"
              />
            </VCol>
            
            <VCol cols="12">
              <VTextField
                v-model="form.date"
                label="Date de la visite"
                type="date"
                variant="outlined"
                prepend-inner-icon="mdi-calendar"
                readonly
                hint="La date est fixée au moment de l'enregistrement"
              />
            </VCol>

            <VCol cols="12">
              <VTextarea
                v-model="form.notes"
                label="Observations et notes"
                variant="outlined"
                rows="6"
                placeholder="Décrivez le déroulement de la visite, les besoins identifiés, etc."
                counter
              />
            </VCol>
          </VRow>

          <VCardActions class="px-0 mt-6">
            <VSpacer />
            <VBtn variant="text" size="large" to="/visits">Annuler</VBtn>
            <VBtn 
              color="primary" 
              variant="flat" 
              size="large" 
              rounded="lg" 
              class="px-8 font-weight-bold" 
              @click="saveVisit" 
              :loading="loading"
            >
              {{ isEdit ? 'Sauvegarder' : 'Confirmer la visite' }}
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
</style>
