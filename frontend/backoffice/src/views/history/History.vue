<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useBeneficiaryStore } from '@/stores/beneficiaryStore';
import { useVisitStore } from '@/stores/visit.store';

const beneficiaryStore = useBeneficiaryStore();
const visitStore = useVisitStore();

const selectedFamilyId = ref<string | null>(null);

onMounted(async () => {
  await beneficiaryStore.fetchBeneficiaries();
  await visitStore.fetchVisits();
  if (beneficiaryStore.beneficiaries.length > 0) {
    selectedFamilyId.value = beneficiaryStore.beneficiaries[0].id;
  }
});

const familyHistory = computed(() => {
  if (!selectedFamilyId.value) return [];
  
  // Filter visits where this family was visited
  return visitStore.visits.filter(v => 
    v.visitBeneficiaires?.some((vb: any) => vb.beneficiaireId === selectedFamilyId.value || vb.beneficiaire?.id === selectedFamilyId.value)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Historique</p>
        <h2>Historique des Familles</h2>
        <p class="subtle">Consulter l'historique complet d'une famille bénéficiaire.</p>
      </div>
    </header>

    <div class="form-card" style="max-width: 500px; margin-bottom: 30px;">
      <div class="field-group">
        <label class="field-label">Sélectionner une famille</label>
        <select class="field-input" v-model="selectedFamilyId">
          <option v-for="fam in beneficiaryStore.beneficiaries" :key="fam.id" :value="fam.id">
            {{ fam.nomFamille }} ({{ fam.codeFamille || 'N/A' }})
          </option>
        </select>
      </div>
    </div>

    <div v-if="visitStore.loading" class="text-center pa-10">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2 subtle">Chargement de l'historique...</p>
    </div>
    
    <div v-else-if="visitStore.error" class="text-center pa-10">
      <v-icon color="error" size="48">mdi-alert-circle-outline</v-icon>
      <p class="text-error mt-2">{{ visitStore.error }}</p>
    </div>
    
    <div v-else-if="familyHistory.length === 0" class="timeline text-center">
      <p class="py-10 text-grey">Aucune visite enregistrée pour cette famille.</p>
    </div>

    <div v-else class="timeline">
      <div v-for="visit in familyHistory" :key="visit.id" class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="d-flex justify-space-between align-start">
            <h3>Visite terrain - {{ new Date(visit.date).toLocaleDateString() }}</h3>
            <v-chip size="x-small" color="primary" variant="flat">Effectuée</v-chip>
          </div>
          <p class="text-subtitle-2 mb-1">Visiteur: {{ visit.visitorName }}</p>
          <p class="mb-3">{{ visit.notes || 'Aucune note pour cette visite.' }}</p>
          
          <!-- Détails de l'intervention -->
          <div v-if="visit.visitBeneficiaires?.[0]?.aids?.length" class="aid-details-box mt-2">
            <h4 class="text-overline mb-1">Détails de l'intervention :</h4>
            <div v-for="aid in visit.visitBeneficiaires[0].aids" :key="aid.id" class="d-flex align-center text-body-2 mb-1">
              <v-icon size="14" color="success" class="mr-2">mdi-package-variant-closed</v-icon>
              <span>{{ aid.type }} - {{ aid.natureIntervention }} ({{ aid.quantite }} {{ aid.unite }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-container { background: linear-gradient(180deg, #f7f8fb 0%, #eef2f7 100%); min-height: 100%; padding: 28px; }
.page-header { margin-bottom: 30px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: #6b7280; margin: 0 0 6px; }
h2 { margin: 0; font-size: 26px; color: #0f172a; }
.subtle { margin: 6px 0 0; color: #6b7280; }
.form-card { background: #ffffff; padding: 24px; border-radius: 14px; box-shadow: 0 10px 28px rgba(15,23,42,0.08); }
.field-group { display: flex; flex-direction: column; }
.field-label { font-weight: 600; margin-bottom: 8px; color: #374151; font-size: 14px; }
.field-input { padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; }
.timeline { background: #fff; border-radius: 14px; padding: 32px; box-shadow: 0 10px 28px rgba(15,23,42,0.08); }
.timeline-item { display: flex; gap: 20px; margin-bottom: 32px; position: relative; }
.timeline-item:last-child { margin-bottom: 0; }
.timeline-item:not(:last-child)::after { content: ''; position: absolute; left: 11px; top: 30px; width: 2px; height: calc(100% + 32px); background: #e5e7eb; }
.timeline-dot { width: 24px; height: 24px; border-radius: 50%; background: #0f766e; flex-shrink: 0; z-index: 1; }
.timeline-content { flex: 1; }
.timeline-content h3 { margin: 0 0 8px; font-size: 16px; color: #0f172a; }
.timeline-content p { margin: 0; color: #6b7280; }
.aid-details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
.text-overline { font-size: 10px; font-weight: 700; color: #64748b; }
</style>
