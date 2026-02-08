<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePlanningStore } from '@/stores/planning.store';
import { useBeneficiaryStore } from '@/stores/beneficiaryStore';
import { useUserStore } from '@/stores/user.store';

const planningStore = usePlanningStore();
const beneficiaryStore = useBeneficiaryStore();
const userStore = useUserStore();

const showDialog = ref(false);
const form = ref({
    dateTournee: '',
    zone: '',
    beneficiaireId: '',
    assignedBenevoleId: '',
    status: 'Planifiée'
});

onMounted(() => {
    planningStore.fetchPlannings();
    beneficiaryStore.fetchBeneficiaries();
    userStore.fetchAllUsers();
});

const benevoles = computed(() => 
    userStore.allUsers.filter((u: any) => u.role?.name === 'BENEVOLE')
);

const families = computed(() => beneficiaryStore.beneficiaries);

async function savePlanning() {
    try {
        await planningStore.createPlanning({
            ...form.value,
            beneficiaire: { id: form.value.beneficiaireId },
            assignedBenevole: { id: form.value.assignedBenevoleId }
        });
        showDialog.value = false;
        // Reset form
        form.value = {
            dateTournee: '',
            zone: '',
            beneficiaireId: '',
            assignedBenevoleId: '',
            status: 'Planifiée'
        };
    } catch (err) {
        console.error(err);
    }
}

function getStatusClass(status: string) {
    if (status === 'Effectuée') return 'status-chip is-valid';
    if (status === 'Planifiée') return 'status-chip is-pending';
    return 'status-chip is-error';
}
</script>

<template>
  <section class="page-container">
    <header class="page-header d-flex justify-space-between align-center">
      <div>
        <p class="eyebrow">Planification</p>
        <h2>Planification des Tournées</h2>
        <p class="subtle">Organiser les visites terrain.</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" @click="showDialog = true">
        Planifier une visite
      </v-btn>
    </header>

    <div class="table-card">
      <div v-if="planningStore.loading" class="pa-10 text-center">
        <v-progress-circular indeterminate color="primary" class="mb-2"></v-progress-circular>
        <p>Chargement des données...</p>
      </div>
      <div v-else-if="planningStore.error" class="pa-10 text-center">
        <v-icon color="error" size="48">mdi-alert-circle-outline</v-icon>
        <p class="text-error mt-2">{{ planningStore.error }}</p>
        <v-btn variant="text" color="primary" @click="planningStore.fetchPlannings()" class="mt-2">Réessayer</v-btn>
      </div>
      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Zone</th>
              <th>Famille</th>
              <th>Bénévole</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="planningStore.plannings.length === 0">
              <td colspan="5" class="text-center font-italic text-grey py-10">Aucune tournée planifiée trouvée.</td>
            </tr>
            <tr v-for="item in planningStore.plannings" :key="item.id">
              <td>{{ new Date(item.dateTournee).toLocaleDateString() }}</td>
              <td>{{ item.zone || 'N/A' }}</td>
              <td>{{ item.beneficiaire?.nomFamille || 'N/A' }}</td>
              <td>{{ item.assignedBenevole ? `${item.assignedBenevole.firstName} ${item.assignedBenevole.lastName}` : 'Non assigné' }}</td>
              <td><span :class="getStatusClass(item.status)">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Dialog de planification -->
    <v-dialog v-model="showDialog" max-width="500px">
      <v-card class="pa-4 rounded-xl">
        <v-card-title class="text-h5 font-weight-bold">Organiser une tournée</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="savePlanning">
            <v-text-field v-model="form.dateTournee" label="Date" type="date" variant="outlined" class="mb-2" />
            <v-text-field v-model="form.zone" label="Zone / Quartier" variant="outlined" class="mb-2" />
            <v-select
              v-model="form.beneficiaireId"
              :items="families"
              item-title="nomFamille"
              item-value="id"
              label="Famille à visiter"
              variant="outlined"
              class="mb-2"
            />
            <v-select
              v-model="form.assignedBenevoleId"
              :items="benevoles"
              :item-title="(item: any) => `${item.firstName} ${item.lastName}`"
              item-value="id"
              label="Bénévole assigné"
              variant="outlined"
              class="mb-2"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showDialog = false">Annuler</v-btn>
          <v-btn color="primary" variant="flat" rounded="lg" @click="savePlanning">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<style scoped>
.page-container { background: linear-gradient(180deg, #f7f8fb 0%, #eef2f7 100%); min-height: 100%; padding: 28px; }
.page-header { margin-bottom: 30px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: #6b7280; margin: 0 0 6px; }
h2 { margin: 0; font-size: 26px; color: #0f172a; }
.subtle { margin: 6px 0 0; color: #6b7280; }
.table-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08); }
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: separate; border-spacing: 0; }
.table th { text-align: left; padding: 14px 16px; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #475569; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.table td { padding: 14px 16px; border-bottom: 1px solid #edf2f7; color: #0f172a; }
.status-chip { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.is-valid { background: #dcfce7; color: #166534; }
.is-pending { background: #fef3c7; color: #92400e; }
</style>
