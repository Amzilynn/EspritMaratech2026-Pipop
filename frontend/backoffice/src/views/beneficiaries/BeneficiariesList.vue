<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useBeneficiaryStore } from '@/stores/beneficiaryStore';
import {
  VContainer,
  VRow,
  VCol,
  VBtn,
  VCard,
  VCardTitle,
  VCardText,
  VIcon,
  VChip,
  VTextField,
  VSpacer,
  VAvatar,
  VProgressLinear,
  VAlert,
  VTabs,
  VTab,
  VWindow,
  VWindowItem,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelTitle,
  VExpansionPanelText,
  VPagination,
  VMenu,
  VList,
  VListItem,
} from 'vuetify/components';

// -------------------- STORES --------------------
const authStore = useAuthStore();
const beneficiaryStore = useBeneficiaryStore();

// -------------------- STATE --------------------
const search = ref('');
const activeTab = ref('urgent'); // Default to "À traiter"
const page = ref(1);
const itemsPerPage = 8;

// -------------------- PERMISSIONS --------------------
const role = computed(() => authStore.role);
const canCreate = computed(() => ['BENEVOLE', 'ADMIN', 'RESPONSABLE_TERRAIN'].includes(role.value || ''));

// -------------------- FETCH DATA --------------------
onMounted(() => {
  beneficiaryStore.fetchBeneficiaries();
});

// -------------------- COMPUTED --------------------
const stats = computed(() => {
  const all = beneficiaryStore.beneficiaries;
  return {
    total: all.length,
    critical: all.filter(b => b.score >= 80).length,
    pending: all.filter(b => !b.lastAidDistributionDate).length
  };
});

const filteredBeneficiaries = computed(() => {
  let list = beneficiaryStore.beneficiaries;

  // Segment logic
  if (activeTab.value === 'urgent') {
    list = list.filter(b => b.score >= 65 || b.nbHandicapes > 0);
  } else if (activeTab.value === 'archived') {
    list = list.filter(b => !b.active);
  } else {
    list = list.filter(b => b.active);
  }

  // Search logic
  const term = search.value.toLowerCase();
  if (term) {
    list = list.filter(b => 
      (b.nomFamille || '').toLowerCase().includes(term) || 
      (b.codeFamille || '').toLowerCase().includes(term)
    );
  }

  // Sort by relevance (Score descending)
  return list.sort((a, b) => b.score - a.score);
});

const paginatedBeneficiaries = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return filteredBeneficiaries.value.slice(start, start + itemsPerPage);
});

const pageCount = computed(() => Math.ceil(filteredBeneficiaries.value.length / itemsPerPage));

// -------------------- HELPERS --------------------
const getScoreColor = (score: number) => {
  if (score >= 80) return 'error';
  if (score >= 65) return 'warning';
  return 'success';
};

const getUrgencyIcon = (score: number) => {
  if (score >= 80) return 'mdi-alert-decagram';
  if (score >= 65) return 'mdi-alert-circle-outline';
  return 'mdi-check-circle-outline';
};

const deleteFamily = async (id: string) => {
  if (confirm('Archiver cette famille ?')) {
    try {
      await beneficiaryStore.deleteBeneficiary(id);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  }
};
</script>

<template>
  <VContainer fluid class="pa-6 bg-grey-lighten-4 min-vh-100">
    <!-- HEADER & KPIs -->
    <VRow class="mb-4 align-end">
      <VCol cols="12" md="6">
        <h1 class="text-h3 font-weight-bold mb-1">Impact Terrain</h1>
        <p class="text-subtitle-1 text-grey-darken-1">Focus sur les familles nécessitant une action prioritaire.</p>
      </VCol>
      <VCol cols="12" md="6" class="d-flex justify-md-end gap-4 flex-wrap">
        <VCard min-width="120" class="pa-3 text-center rounded-lg" elevation="1">
          <div class="text-caption text-grey text-uppercase font-weight-bold">Total</div>
          <div class="text-h5 font-weight-black">{{ stats.total }}</div>
        </VCard>
        <VCard min-width="120" class="pa-3 text-center rounded-lg border-s-lg border-error" elevation="1">
          <div class="text-caption text-error text-uppercase font-weight-bold">Critiques</div>
          <div class="text-h5 font-weight-black text-error">{{ stats.critical }}</div>
        </VCard>
        <VCard min-width="120" class="pa-3 text-center rounded-lg" elevation="1">
          <div class="text-caption text-primary text-uppercase font-weight-bold">Nouveaux</div>
          <div class="text-h5 font-weight-black text-primary">{{ stats.pending }}</div>
        </VCard>
      </VCol>
    </VRow>

    <!-- NAVIGATION TABS & SEARCH -->
    <VCard rounded="xl" class="mb-6 pa-2" elevation="2">
      <VRow align="center" no-gutters>
        <VCol cols="12" md="6">
          <VTabs v-model="activeTab" color="primary" align-tabs="start">
            <VTab value="urgent" prepend-icon="mdi-lightning-bolt" class="text-none">À traiter</VTab>
            <VTab value="all" prepend-icon="mdi-account-group" class="text-none">Tous</VTab>
            <VTab value="archived" prepend-icon="mdi-archive-outline" class="text-none">Archivés</VTab>
          </VTabs>
        </VCol>
        <VCol cols="12" md="6" class="pa-2">
          <div class="d-flex align-center gap-2">
            <VTextField
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Chercher par nom ou code..."
              hide-details
              density="comfortable"
              variant="solo"
              flat
              rounded="lg"
              class="search-bar"
            />
            <VBtn v-if="canCreate" icon="mdi-plus" color="primary" rounded="lg" size="large" to="/beneficiaries/new" aria-label="Nouvelle famille" />
          </div>
        </VCol>
      </VRow>
    </VCard>

    <!-- INTELLIGENT LIST -->
    <div v-if="beneficiaryStore.isLoading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-grey">Analyse de la base de données...</p>
    </div>

    <VExpansionPanels variant="accordion" class="custom-panels">
      <VExpansionPanel
        v-for="family in paginatedBeneficiaries"
        :key="family.id"
        class="mb-3 rounded-xl overflow-hidden border-card"
        elevation="0"
      >
        <VExpansionPanelTitle class="pa-0">
          <template #default="{ expanded }">
            <VRow no-gutters class="align-center w-100 pa-4 pr-0">
              <!-- AVATAR & BASIC INFO -->
              <VCol cols="12" sm="4" class="d-flex align-center">
                <VAvatar :color="getScoreColor(family.score)" variant="tonal" class="mr-4" size="48">
                  <VIcon>{{ getUrgencyIcon(family.score) }}</VIcon>
                </VAvatar>
                <div>
                  <div class="text-h6 font-weight-bold leading-tight line-clamp-1">{{ family.nomFamille }}</div>
                  <div class="text-caption text-grey">Code: {{ family.codeFamille }} • {{ family.nbMembres }} membres</div>
                </div>
              </VCol>

              <!-- STATUS BADGES -->
              <VCol cols="6" sm="3" class="hidden-xs d-flex align-center">
                 <VChip v-if="family.nbHandicapes > 0" size="x-small" color="purple" variant="flat" class="mr-2">Handicap</VChip>
                 <VChip v-if="family.revenuMensuel < 300" size="x-small" color="indigo" variant="flat">Précaire</VChip>
              </VCol>

              <!-- VULNERABILITY SCORE -->
              <VCol cols="6" sm="3">
                <div class="pr-6">
                  <div class="d-flex justify-space-between text-caption mb-1">
                    <span>Vulnérabilité</span>
                    <span class="font-weight-bold">{{ family.score }}%</span>
                  </div>
                  <VProgressLinear :model-value="family.score" :color="getScoreColor(family.score)" height="6" rounded />
                </div>
              </VCol>

              <!-- QUICK ACTIONS (Outside Toggle) -->
              <VCol cols="2" class="text-right hidden-sm-and-down">
                <VBtn icon="mdi-pencil-outline" variant="text" size="small" :to="`/beneficiaries/edit/${family.id}`" @click.stop />
                <VBtn icon="mdi-dots-vertical" variant="text" size="small" @click.stop />
              </VCol>
            </VRow>
          </template>
        </VExpansionPanelTitle>

        <VExpansionPanelText class="bg-grey-lighten-5 pa-4">
          <VRow>
            <VCol cols="12" md="4" class="border-e-md">
               <h4 class="text-overline text-grey mb-2">Coordination Sociale</h4>
               <p class="text-body-2 mb-1"><VIcon size="16" class="mr-2">mdi-phone-outline</VIcon>{{ family.telephone }}</p>
               <p class="text-body-2"><VIcon size="16" class="mr-2">mdi-map-marker-outline</VIcon>{{ family.adresse }}</p>
               <div class="mt-4">
                 <VBtn color="primary" variant="tonal" size="small" class="text-none" block prepend-icon="mdi-map">Ouvrir sur la carte</VBtn>
               </div>
            </VCol>
            <VCol cols="12" md="8">
               <h4 class="text-overline text-grey mb-2">Historique Proche</h4>
               <div v-if="family.situationSociale" class="text-body-2 text-italic bg-white pa-3 rounded-lg border mb-4">
                 "{{ family.situationSociale }}"
               </div>
               <div class="d-flex gap-2">
                 <VBtn color="success" size="small" class="text-none" prepend-icon="mdi-plus">Nouvelle visite</VBtn>
                 <VBtn color="info" variant="outlined" size="small" class="text-none" prepend-icon="mdi-eye">Dossier Complet</VBtn>
                 <VSpacer />
                 <VBtn color="error" variant="text" size="small" class="text-none" @click="deleteFamily(family.id)">Archiver</VBtn>
               </div>
            </VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <!-- EMPTY STATE -->
    <VCard v-if="filteredBeneficiaries.length === 0 && !beneficiaryStore.isLoading" rounded="xl" class="pa-12 text-center" variant="flat">
       <VIcon size="64" color="grey-lighten-1">mdi-account-search-outline</VIcon>
       <h3 class="text-h5 text-grey-darken-1 mt-4">Aucun dossier trouvé</h3>
       <p class="text-grey">Ajustez vos filtres ou effectuez une nouvelle recherche.</p>
    </VCard>

    <!-- PAGINATION -->
    <div class="d-flex justify-center mt-6">
      <VPagination v-model="page" :length="pageCount" :total-visible="5" rounded="lg" color="primary" />
    </div>
  </VContainer>
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.search-bar { width: 100%; }
.border-card { border: 1px solid #e0e0e0 !important; }
.border-s-lg { border-left-width: 6px !important; }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }

/* Expansion Panel Overrides */
.v-expansion-panel-title--active {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
.custom-panels :deep(.v-expansion-panel-item__title) {
  min-height: 80px;
}
</style>
