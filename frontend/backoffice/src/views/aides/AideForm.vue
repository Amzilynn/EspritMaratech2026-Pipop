<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAidStore } from '@/stores/aid.store';
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
  VIcon,
  VSelect,
  VSpacer,
  VAlert,
  VDivider,
} from 'vuetify/components';

// -------------------- STORES --------------------
const route = useRoute();
const router = useRouter();
const aidStore = useAidStore();

// -------------------- STATE --------------------
const isEdit = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const form = ref({
  id: '',
  type: 'Alimentaire',
  quantite: 1,
  unite: 'Unité',
  natureIntervention: 'Distribution',
  valeurEstimee: 0,
  visitId: null as string | null,
});

const aidTypes = ['Alimentaire', 'Médicale', 'Financière', 'Matériel', 'Soutien Psychologique'];
const natureOptions = ['Distribution', 'Consultation', 'Support', 'Urgent'];
const visits = ref<any[]>([]);

// -------------------- FETCH DATA --------------------
const loadVisits = async () => {
    try {
        const data = await apiFetch('/visits');
        visits.value = data.map((v: any) => ({
            id: v.id,
            title: `Visite du ${new Date(v.date).toLocaleDateString()} - ${v.visitBeneficiaires?.map((vb: any) => vb.beneficiaire?.nomFamille || vb.beneficiaire?.firstName).join(', ')}`
        }));
    } catch (err: any) {
        console.error('Error loading visits', err);
    }
};

onMounted(async () => {
  await loadVisits();
  const id = route.params.id;
  if (id && id !== 'new') {
    isEdit.value = true;
    loading.value = true;
    try {
      const aid = await apiFetch(`/visits/aids/${id}`);
      form.value = {
        id: aid.id,
        type: aid.type,
        quantite: aid.quantite,
        unite: aid.unite,
        natureIntervention: aid.natureIntervention,
        valeurEstimee: aid.valeurEstimee,
        visitId: aid.visitBeneficiaire?.visit?.id || null
      };
    } catch (err: any) {
      error.value = 'Impossible de charger les détails de l\'aide.';
    } finally {
      loading.value = false;
    }
  }
});

// -------------------- SAVE --------------------
async function saveAide() {
  if (!form.value.visitId || !form.value.type || !form.value.quantite) {
    error.value = 'Veuillez remplir tous les champs obligatoires.';
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    if (isEdit.value) {
      await aidStore.updateAid(form.value.id, form.value);
    } else {
      // Create aid attached to a visit
      await aidStore.createAid(form.value.visitId, form.value);
    }
    router.push('/aides');
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
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/aides" class="mb-4">Retour</v-btn>
        <p class="text-overline mb-1 text-primary font-weight-bold">Solidarité</p>
        <h1 class="text-h3 font-weight-bold mb-2">{{ isEdit ? 'Modifier l\'aide' : 'Nouvelle aide' }}</h1>
        <p class="text-body-1 text-grey-darken-1">Détaillez les ressources ou services apportés lors d'une visite.</p>
      </VCol>
    </VRow>

    <VRow justify="center">
      <VCol cols="12" md="8" lg="6">
        <VCard rounded="xl" elevation="10" class="pa-6">
          <VCardTitle class="px-0 pt-0 mb-6 font-weight-bold d-flex align-center">
            <VIcon color="primary" class="mr-2">mdi-gift-outline</VIcon>
            Détails de l'aide
          </VCardTitle>

          <VAlert v-if="error" type="error" variant="tonal" class="mb-6" closable>
            {{ error }}
          </VAlert>

          <VRow>
            <VCol cols="12">
              <VSelect
                v-model="form.visitId"
                :items="visits"
                item-title="title"
                item-value="id"
                label="Visite associée (Obligatoire)"
                variant="outlined"
                prepend-inner-icon="mdi-map-marker-path"
                :disabled="isEdit"
                placeholder="Sélectionner la visite correspondante"
              />
            </VCol>

            <VCol cols="12" sm="6">
              <VSelect
                v-model="form.type"
                :items="aidTypes"
                label="Type d'aide"
                variant="outlined"
              />
            </VCol>

            <VCol cols="12" sm="6">
              <VSelect
                v-model="form.natureIntervention"
                :items="natureOptions"
                label="Nature de l'intervention"
                variant="outlined"
              />
            </VCol>

            <VCol cols="6">
              <VTextField
                v-model.number="form.quantite"
                label="Quantité"
                type="number"
                variant="outlined"
              />
            </VCol>

            <VCol cols="6">
              <VTextField
                v-model="form.unite"
                label="Unité"
                variant="outlined"
                placeholder="Ex: Kg, Boites, TND..."
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model.number="form.valeurEstimee"
                label="Valeur estimée (TND)"
                type="number"
                variant="outlined"
                prepend-inner-icon="mdi-currency-usd"
              />
            </VCol>
          </VRow>

          <VCardActions class="px-0 mt-6">
            <VSpacer />
            <VBtn variant="text" size="large" to="/aides">Annuler</VBtn>
            <VBtn 
              color="primary" 
              variant="flat" 
              size="large" 
              rounded="lg" 
              class="px-8 font-weight-bold" 
              @click="saveAide" 
              :loading="loading"
            >
              {{ isEdit ? 'Sauvegarder' : 'Enregistrer l\'aide' }}
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
</style>
