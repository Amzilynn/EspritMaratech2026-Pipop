<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useVisitStore } from '@/stores/visit.store';
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
  VAlert,
  VTabs,
  VTab,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelTitle,
  VExpansionPanelText,
  VPagination,
} from 'vuetify/components';

// -------------------- STORES --------------------
const authStore = useAuthStore();
const visitStore = useVisitStore();

// -------------------- STATE --------------------
const search = ref('');
const activeTab = ref('recent');
const page = ref(1);
const itemsPerPage = 6;

// -------------------- PERMISSIONS --------------------
const role = computed(() => authStore.role);
const canCreate = computed(() => ['BENEVOLE', 'ADMIN', 'RESPONSABLE_TERRAIN'].includes(role.value || ''));

// -------------------- FETCH DATA --------------------
onMounted(() => {
  visitStore.fetchVisits();
});

// -------------------- COMPUTED --------------------
const stats = computed(() => {
  const all = visitStore.visits;
  const today = new Date().toISOString().split('T')[0];
  return {
    total: all.length,
    today: all.filter(v => v.date?.startsWith(today)).length,
    noNotes: all.filter(v => !v.notes || v.notes === '-').length
  };
});

const filteredVisits = computed(() => {
  let list = [...visitStore.visits];

  // Segment logic
  if (activeTab.value === 'incomplete') {
    list = list.filter(v => !v.notes || v.notes === '-' || v.notes.length < 10);
  }

  // Search logic
  const term = search.value.toLowerCase();
  if (term) {
    list = list.filter(v => 
      (v.beneficiaryName || '').toLowerCase().includes(term) || 
      (v.visitorName || '').toLowerCase().includes(term)
    );
  }

  // Default sort by date descending
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const paginatedVisits = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return filteredVisits.value.slice(start, start + itemsPerPage);
});

const pageCount = computed(() => Math.ceil(filteredVisits.value.length / itemsPerPage));

// -------------------- HELPERS --------------------
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const deleteVisit = async (id: number) => {
  if (confirm('Supprimer cet enregistrement de visite ?')) {
    try {
      await visitStore.deleteVisit(id);
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
        <h1 class="text-h3 font-weight-bold mb-1">Journal de Visites</h1>
        <p class="text-subtitle-1 text-grey-darken-1">Suivi chronologique et qualitatif des interventions terrain.</p>
      </VCol>
      <VCol cols="12" md="6" class="d-flex justify-md-end gap-4 flex-wrap">
        <VCard min-width="140" class="pa-3 text-center rounded-lg border-s-lg border-primary" elevation="1">
          <div class="text-caption text-grey text-uppercase font-weight-bold">Total visites</div>
          <div class="text-h5 font-weight-black text-primary">{{ stats.total }}</div>
        </VCard>
        <VCard min-width="140" class="pa-3 text-center rounded-lg border-s-lg border-warning" elevation="1">
          <div class="text-caption text-warning text-uppercase font-weight-bold">Notes manquantes</div>
          <div class="text-h5 font-weight-black text-warning">{{ stats.noNotes }}</div>
        </VCard>
      </VCol>
    </VRow>

    <!-- NAVIGATION TABS & SEARCH -->
    <VCard rounded="xl" class="mb-6 pa-2" elevation="2">
      <VRow align="center" no-gutters>
        <VCol cols="12" md="6">
          <VTabs v-model="activeTab" color="primary">
            <VTab value="recent" class="text-none">Historique récent</VTab>
            <VTab value="incomplete" class="text-none">À compléter</VTab>
          </VTabs>
        </VCol>
        <VCol cols="12" md="6" class="pa-2">
          <div class="d-flex align-center gap-2">
            <VTextField
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Chercher par famille ou bénévole..."
              hide-details
              density="comfortable"
              variant="solo"
              flat
              rounded="lg"
            />
            <VBtn v-if="canCreate" icon="mdi-map-marker-plus" color="primary" rounded="lg" size="large" to="/visits/new" />
          </div>
        </VCol>
      </VRow>
    </VCard>

    <!-- LIST OF VISITS -->
    <div v-if="visitStore.loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <VExpansionPanels variant="accordion" class="custom-panels">
      <VExpansionPanel
        v-for="visit in paginatedVisits"
        :key="visit.id"
        class="mb-3 rounded-xl overflow-hidden border-card"
        elevation="0"
      >
        <VExpansionPanelTitle class="pa-0">
          <VRow no-gutters class="align-center w-100 pa-4 pr-0">
             <VCol cols="12" sm="3" class="d-flex align-center">
                <VAvatar color="primary" variant="tonal" class="mr-4" size="48">
                  <VIcon>mdi-account-arrow-right</VIcon>
                </VAvatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">{{ visit.beneficiaryName }}</div>
                  <div class="text-caption text-grey">{{ formatDate(visit.date) }}</div>
                </div>
             </VCol>
             <VCol cols="6" sm="3" class="text-center">
                <VChip size="small" variant="text" class="px-0">
                   <VIcon start size="16">mdi-account-outline</VIcon>
                   {{ visit.visitorName }}
                </VChip>
             </VCol>
             <VCol cols="6" sm="4">
                <div class="text-body-2 text-grey-darken-1 text-truncate" style="max-width: 300px">
                   {{ visit.notes || 'Aucune note saisie' }}
                </div>
             </VCol>
             <VCol cols="2" class="text-right d-none d-sm-block">
                <VIcon v-if="visit.notes && visit.notes !== '-'" color="success">mdi-check-circle</VIcon>
                <VIcon v-else color="warning">mdi-alert-circle-outline</VIcon>
             </VCol>
          </VRow>
        </VExpansionPanelTitle>

        <VExpansionPanelText class="bg-grey-lighten-5 pa-4">
           <div class="text-h6 mb-2">Compte-rendu de visite</div>
           <div class="bg-white pa-4 rounded-lg border mb-4 text-body-1 line-height-relaxed">
             {{ visit.notes || 'Cet enregistrement ne contient pas encore de notes détaillées.' }}
           </div>
           <div class="d-flex gap-2">
             <VBtn color="primary" variant="tonal" size="small" class="text-none" prepend-icon="mdi-pencil" :to="`/visits/edit/${visit.id}`">Modifier les notes</VBtn>
             <VSpacer />
             <VBtn v-if="role === 'ADMIN'" color="error" variant="text" size="small" class="text-none" @click="deleteVisit(visit.id)">Supprimer définitivement</VBtn>
           </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <div class="d-flex justify-center mt-6">
      <VPagination v-model="page" :length="pageCount" rounded="lg" color="primary" />
    </div>
  </VContainer>
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.border-card { border: 1px solid #e0e0e0 !important; }
.border-s-lg { border-left-width: 6px !important; }
.line-height-relaxed { line-height: 1.6; }
</style>
