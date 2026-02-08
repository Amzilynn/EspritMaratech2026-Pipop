<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBeneficiaryStore } from '@/stores/beneficiaryStore';
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
  VSwitch,
} from 'vuetify/components';

// -------------------- STORES --------------------
const beneficiaryStore = useBeneficiaryStore();
const route = useRoute();
const router = useRouter();

// -------------------- STATE --------------------
const isEdit = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const form = ref({
  nomFamille: '',
  adresse: '',
  telephone: '',
  nbMembres: 1,
  nbEnfants: 0,
  nbPersonnesAgees: 0,
  nbHandicapes: 0,
  typeLogement: 'Locataire',
  statutSocial: 'Chômage',
  situationSociale: '',
  migrationStatus: 'None',
  active: true,
});

const logementOptions = ['Propriétaire', 'Locataire', 'Précaire'];
const migrationOptions = ['Internal', 'External', 'Returnee', 'None'];

// -------------------- FETCH DATA --------------------
onMounted(async () => {
  const id = route.params.id;
  if (id) {
    isEdit.value = true;
    loading.value = true;
    try {
      const data = await apiFetch(`/beneficiaires/${id}`);
      form.value = { ...data };
    } catch (err: any) {
      error.value = 'Impossible de charger les données de la famille.';
    } finally {
      loading.value = false;
    }
  }
});

// -------------------- SAVE --------------------
async function saveFamily() {
  if (!form.value.nomFamille || !form.value.adresse) {
    error.value = 'Le nom de la famille et l\'adresse sont obligatoires.';
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    if (isEdit.value) {
      await apiFetch(`/beneficiaires/${route.params.id}`, {
        method: 'PATCH',
        body: JSON.stringify(form.value),
      });
    } else {
      await beneficiaryStore.createBeneficiary(form.value);
    }
    router.push('/beneficiaries');
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
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/beneficiaries" class="mb-4">Retour</v-btn>
        <p class="text-overline mb-1 text-primary font-weight-bold">Bénéficiaires</p>
        <h1 class="text-h3 font-weight-bold mb-2">{{ isEdit ? 'Modifier la famille' : 'Nouvelle famille' }}</h1>
        <p class="text-body-1 text-grey-darken-1">Renseignez les informations socio-économiques de la famille.</p>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="8">
        <VCard rounded="xl" elevation="10" class="pa-6">
          <VCardTitle class="px-0 pt-0 mb-6 font-weight-bold d-flex align-center">
            <VIcon color="primary" class="mr-2">mdi-office-building-marker</VIcon>
            Informations Générales
          </VCardTitle>

          <VAlert v-if="error" type="error" variant="tonal" class="mb-6" closable>
            {{ error }}
          </VAlert>

          <VRow>
            <VCol cols="12" sm="6">
              <VTextField v-model="form.nomFamille" label="Nom de la famille" variant="outlined" placeholder="Ex: Famille Ben Ali" />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField v-model="form.telephone" label="Téléphone" variant="outlined" placeholder="Ex: 216XXXXXXXX" />
            </VCol>
            <VCol cols="12">
              <VTextField v-model="form.adresse" label="Adresse complète" variant="outlined" prepend-inner-icon="mdi-map-marker" />
            </VCol>

            <VCol cols="12"><VDivider class="my-4" /></VCol>

            <VCol cols="12">
              <h3 class="text-h6 font-weight-bold mb-4">Composition du foyer</h3>
            </VCol>

            <VCol cols="6" sm="3">
              <VTextField v-model.number="form.nbMembres" label="Total membres" type="number" variant="outlined" />
            </VCol>
            <VCol cols="6" sm="3">
              <VTextField v-model.number="form.nbEnfants" label="Enfants" type="number" variant="outlined" />
            </VCol>
            <VCol cols="6" sm="3">
              <VTextField v-model.number="form.nbPersonnesAgees" label="Pers. âgées" type="number" variant="outlined" />
            </VCol>
            <VCol cols="6" sm="3">
              <VTextField v-model.number="form.nbHandicapes" label="Pers. handicapées" type="number" variant="outlined" />
            </VCol>

            <VCol cols="12"><VDivider class="my-4" /></VCol>

            <VCol cols="12">
              <h3 class="text-h6 font-weight-bold mb-4">Statut Socio-Professionnel</h3>
            </VCol>

            <VCol cols="12" sm="6">
              <VSelect v-model="form.typeLogement" :items="logementOptions" label="Type de logement" variant="outlined" />
            </VCol>
            <VCol cols="12" sm="6">
              <VSelect v-model="form.migrationStatus" :items="migrationOptions" label="Statut migratoire" variant="outlined" />
            </VCol>
            <VCol cols="12">
              <VTextField v-model="form.statutSocial" label="Situation professionnelle" variant="outlined" placeholder="Ex: Ouvrier journalier, Chômage..." />
            </VCol>
            <VCol cols="12">
              <VTextField v-model="form.situationSociale" label="Notes sociales additionnelles" variant="outlined" />
            </VCol>
          </VRow>

          <VCardActions class="px-0 mt-6">
            <VSpacer />
            <VBtn variant="text" size="large" to="/beneficiaries">Annuler</VBtn>
            <VBtn color="primary" variant="flat" size="large" rounded="lg" class="px-8 font-weight-bold" @click="saveFamily" :loading="loading">
              {{ isEdit ? 'Sauvegarder les modifications' : 'Enregistrer la famille' }}
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard rounded="xl" elevation="10" class="pa-6 mb-6 bg-primary-lighten-5 border-dashed">
          <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center">
            <VIcon color="primary" class="mr-2">mdi-robot-confused</VIcon>
            Aide au diagnostic
          </h3>
          <p class="text-body-2 text-grey-darken-2 mb-4">
            Une fois enregistrée, notre système ML calculera automatiquement le <strong>score de vulnérabilité</strong> basé sur ces données.
          </p>
          <VAlert type="info" variant="tonal" density="compact" class="text-caption">
            Les familles avec un score > 80% seront prioritaires dans les prochains rapports.
          </VAlert>
        </VCard>

        <VCard v-if="isEdit" rounded="xl" elevation="10" class="pa-6">
           <h3 class="text-h6 font-weight-bold mb-4">Status du compte</h3>
           <VSwitch v-model="form.active" label="Compte actif" color="success" hide-details />
           <p class="text-caption text-grey mt-2">Désactiver une famille la masquera des listes actives sans supprimer son historique.</p>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.border-dashed { border: 2px dashed rgba(var(--v-theme-primary), 0.2) !important; }
</style>
