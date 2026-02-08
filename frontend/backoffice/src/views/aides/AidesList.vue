<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAidStore, Aid } from '@/stores/aid.store';
import {
  VContainer, VRow, VCol, VBtn, VCard, VCardTitle, VCardText,
  VIcon, VChip, VTextField, VSpacer, VAvatar, VTabs, VTab,
  VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText,
  VPagination, VDivider, VTable
} from 'vuetify/components';

// -------------------- STORES --------------------
const authStore = useAuthStore();
const aidStore = useAidStore();

// -------------------- STATE --------------------
const search = ref('');
const activeView = ref('list'); // 'list' or 'analysis'
const page = ref(1);
const itemsPerPage = 8;

// -------------------- FETCH DATA --------------------
onMounted(() => {
  aidStore.fetchAids();
});

// -------------------- ANALYSIS LOGIC --------------------
const analysis = computed(() => {
  const aids = aidStore.aids;
  
  // Group by Type
  const byType: Record<string, { count: number, value: number }> = {};
  // Group by Date (Last 6 Months)
  const monthly: Record<string, number> = {};
  
  aids.forEach(a => {
    const t = a.type || 'Autre';
    if (!byType[t]) byType[t] = { count: 0, value: 0 };
    byType[t].count++;
    byType[t].value += (a.valeurEstimee || 0);

    const date = new Date(a.dateDistribution);
    const month = date.toLocaleString('fr-FR', { month: 'short' });
    monthly[month] = (monthly[month] || 0) + (a.valeurEstimee || 0);
  });

  return { byType, monthly };
});

const stats = computed(() => {
  const all = aidStore.aids;
  return {
    total: all.length,
    urgent: all.filter(a => a.natureIntervention === 'Urgente' || a.natureIntervention === 'Urgent').length,
    totalValue: all.reduce((acc, a) => acc + (a.valeurEstimee || 0), 0)
  };
});

// -------------------- SEARCH & FILTER --------------------
const filteredAids = computed(() => {
  let list = [...aidStore.aids];
  const term = search.value.toLowerCase();
  if (term) {
    list = list.filter(a => 
      (a.beneficiaryName || '').toLowerCase().includes(term) || 
      (a.type || '').toLowerCase().includes(term)
    );
  }
  return list.sort((a, b) => new Date(b.dateDistribution).getTime() - new Date(a.dateDistribution).getTime());
});

const paginatedAids = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return filteredAids.value.slice(start, start + itemsPerPage);
});

const pageCount = computed(() => Math.ceil(filteredAids.value.length / itemsPerPage));

// -------------------- HELPERS --------------------
const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');
const getAidColor = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('aliment')) return 'orange';
  if (t.includes('médic')) return 'red';
  if (t.includes('financ')) return 'green';
  return 'blue';
};
</script>

<template>
  <VContainer fluid class="pa-6 bg-grey-lighten-4 min-vh-100">
    <!-- HERO HEADER -->
    <VRow class="mb-6">
      <VCol cols="12" md="6">
        <h1 class="text-h3 font-weight-black mb-1">Aides Octroyées</h1>
        <p class="text-subtitle-1 text-grey-darken-1">Console d'agrégation et d'analyse des ressources distribuées.</p>
      </VCol>
      <VCol cols="12" md="6" class="text-md-right">
        <VBtn 
          :color="activeView === 'list' ? 'primary' : 'white'" 
          class="mr-2 px-6" 
          rounded="pill" 
          elevation="2"
          @click="activeView = 'list'"
        >
          <VIcon start>mdi-format-list-bulleted</VIcon> Liste
        </VBtn>
        <VBtn 
          :color="activeView === 'analysis' ? 'primary' : 'white'" 
          class="px-6" 
          rounded="pill" 
          elevation="2"
          @click="activeView = 'analysis'"
        >
          <VIcon start>mdi-chart-pie</VIcon> Analyse
        </VBtn>
      </VCol>
    </VRow>

    <!-- KPI ROW -->
    <VRow class="mb-6">
      <VCol cols="12" sm="4" v-for="s in [
        { label: 'Aides Totales', val: stats.total, color: 'primary', icon: 'mdi-gift' },
        { label: 'Valeur Totale', val: stats.totalValue.toLocaleString() + ' TND', color: 'success', icon: 'mdi-currency-tnd' },
        { label: 'Urgences', val: stats.urgent, color: 'error', icon: 'mdi-fire' }
      ]" :key="s.label">
        <VCard rounded="xl" class="pa-5 border-s-lg h-100" :class="'border-' + s.color">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-overline text-grey">{{ s.label }}</div>
              <div class="text-h4 font-weight-black">{{ s.val }}</div>
            </div>
            <VIcon :color="s.color" size="48" class="opacity-20">{{ s.icon }}</VIcon>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <!-- LIST VIEW -->
    <div v-if="activeView === 'list'">
      <VCard rounded="xl" class="mb-6 pa-4 border shadow-premium">
        <VTextField
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Filtrer par famille, type d'aide ou zone..."
          hide-details
          variant="solo"
          flat
          rounded="pill"
          class="bg-grey-lighten-4"
        />
      </VCard>

      <div v-if="aidStore.loading" class="text-center py-12">
        <VProgressCircular indeterminate color="primary" />
      </div>

      <VRow v-else>
        <VCol v-for="aid in paginatedAids" :key="aid.id" cols="12" md="6" lg="4">
          <VCard rounded="xl" elevation="3" class="pa-5 hover-card h-100 border">
            <div class="d-flex align-center mb-4">
              <VAvatar :color="getAidColor(aid.type)" size="48" variant="flat" class="mr-4">
                <VIcon color="white">mdi-package-variant</VIcon>
              </VAvatar>
              <div>
                <div class="text-h6 font-weight-bold line-height-tight">{{ aid.beneficiaryName }}</div>
                <div class="text-caption text-grey">{{ formatDate(aid.dateDistribution) }}</div>
              </div>
            </div>
            <VDivider class="mb-4" />
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-subtitle-2 text-grey">Nature</span>
              <VChip size="x-small" label class="font-weight-bold">{{ aid.type }}</VChip>
            </div>
            <div class="d-flex justify-space-between align-center mb-4">
              <span class="text-subtitle-2 text-grey">Valeur</span>
              <span class="text-h6 font-weight-black text-primary">{{ aid.valeurEstimee }} TND</span>
            </div>
            <VBtn block variant="tonal" size="small" rounded="pill">Détails de l'attribution</VBtn>
          </VCard>
        </VCol>
      </VRow>

      <div class="d-flex justify-center mt-10">
        <VPagination v-model="page" :length="pageCount" rounded="pill" color="primary" />
      </div>
    </div>

    <!-- ANALYSIS VIEW -->
    <div v-else>
      <VRow>
        <VCol cols="12" md="6">
          <VCard rounded="xl" class="pa-6 border h-100">
            <VCardTitle class="px-0 pt-0 font-weight-bold">Répartition par Type</VCardTitle>
            <VTable>
              <thead>
                <tr>
                  <th class="text-left">Type d'Aide</th>
                  <th class="text-center">Attributions</th>
                  <th class="text-right">Valeur (TND)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, type) in analysis.byType" :key="type">
                  <td class="font-weight-bold">{{ type }}</td>
                  <td class="text-center"><VChip size="x-small">{{ data.count }}</VChip></td>
                  <td class="text-right font-weight-black">{{ data.value.toLocaleString() }}</td>
                </tr>
              </tbody>
            </VTable>
          </VCard>
        </VCol>
        <VCol cols="12" md="6">
          <VCard rounded="xl" class="pa-6 border h-100 bg-primary text-white">
            <VCardTitle class="px-0 pt-0 font-weight-bold">Impact Cumulé Mensuel</VCardTitle>
            <div class="mt-4">
              <div v-for="(val, month) in analysis.monthly" :key="month" class="mb-4">
                <div class="d-flex justify-space-between mb-1">
                  <span class="text-overline">{{ month }}</span>
                  <span class="font-weight-bold">{{ val.toLocaleString() }} TND</span>
                </div>
                <VSheet height="6" rounded="pill" color="rgba(255,255,255,0.2)">
                  <VSheet :width="(val / stats.totalValue * 200) + '%'" height="100%" color="white" rounded="pill" />
                </VSheet>
              </div>
            </div>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style scoped>
.border-s-lg { border-left-width: 8px !important; }
.shadow-premium { box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important; }
.hover-card:hover { transform: translateY(-4px); transition: 0.3s; border-color: var(--v-primary-base) !important; }
.line-height-tight { line-height: 1.2; }
</style>
