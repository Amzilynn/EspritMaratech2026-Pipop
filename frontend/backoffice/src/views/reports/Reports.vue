<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiFetch } from '@/services/api';
import { useTheme } from 'vuetify';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const theme = useTheme();
const primary = theme.current.value.colors.primary;
const error = theme.current.value.colors.error;
const info = theme.current.value.colors.info;
const warning = theme.current.value.colors.warning;

const stats = ref({
    totalBeneficiaries: 0,
    totalAidsValue: 0,
    totalVisits: 0,
    lowStockCount: 0
});

const resources = ref<any[]>([]);
const aids = ref<any[]>([]);
const beneficiaries = ref<any[]>([]);

const isLoading = ref(true);
const isExporting = ref(false);

// PDF Export Function
const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header (Logo & Title)
    doc.setFillColor(33, 150, 243); // Primary Color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("OMNIA HUMANITARIAN OS", 15, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Rapport Analytique - Généré le ${new Date().toLocaleString()}`, 15, 33);

    // 2. Summary Section (KPI Cards style)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Synthèse des Opérations", 15, 55);

    autoTable(doc, {
        startY: 60,
        head: [['Indicateur', 'Valeur Actuelle']],
        body: [
            ['Familles Accompagnées', stats.value.totalBeneficiaries.toString()],
            ['Valeur Totale des Aides', `${stats.value.totalAidsValue.toLocaleString()} TND`],
            ['Nombre de Visites Terrain', stats.value.totalVisits.toString()],
            ['Produits en Seuil Critique', stats.value.lowStockCount.toString()]
        ],
        theme: 'striped',
        headStyles: { fillColor: [33, 150, 243] }
    });

    // 3. Resources Data Table
    doc.setFontSize(14);
    doc.text("État de l'Inventaire", 15, (doc as any).lastAutoTable.finalY + 15);

    const tableBody = resources.value.map(item => [
        item.name,
        item.type,
        `${item.quantity} ${item.unit}`,
        `${item.value} TND`,
        item.quantity < (item.minQuantity || 10) ? 'Critique' : 'OK'
    ]);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Désignation', 'Catégorie', 'Stock', 'P.U', 'Status']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] },
        columnStyles: {
            4: { fontStyle: 'bold' }
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 4) {
                if (data.cell.text[0] === 'Critique') {
                    doc.setTextColor(239, 68, 68);
                } else {
                    doc.setTextColor(16, 185, 129);
                }
            }
        }
    });

    // 4. Beneficiaries Detail Section
    doc.addPage(); // Start a new page for details
    doc.setTextColor(33, 150, 243);
    doc.setFontSize(16);
    doc.text("Détail des Populations Prioritaires", 15, 20);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("Liste exhaustive des familles identifiées nécessitant un suivi particulier.", 15, 28);

    const beneBody = beneficiaries.value.slice(0, 30).map(b => [
        b.nomFamille || 'N/A',
        b.adresse?.split(',')[0] || 'N/A',
        b.nbMembres ? b.nbMembres.toString() : '1',
        b.nbEnfants ? b.nbEnfants.toString() : '0',
        b.statutSocial || 'Sans statut',
        b.revenuMensuel ? `${b.revenuMensuel} TND` : 'Non déclaré'
    ]);

    autoTable(doc, {
        startY: 35,
        head: [['Famille', 'Zone', 'Membres', 'Enfants', 'Statut', 'Revenu']],
        body: beneBody,
        theme: 'striped',
        headStyles: { fillColor: [33, 150, 243] },
        styles: { fontSize: 8 },
        columnStyles: {
            0: { fontStyle: 'bold' }
        }
    });

    // 5. Footer
    const pageWidthFooter = doc.internal.pageSize.getWidth();
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Ce document contient des données sensibles. Toute diffusion non autorisée est passible de poursuites.", pageWidthFooter / 2, finalY, { align: 'center' });

    doc.save(`Omnia_Rapport_Detaille_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Chart Data: Aid Types (Dynamic)
const aidTypeSeries = computed(() => {
    const counts: Record<string, number> = {};
    aids.value.forEach(aid => {
        const t = aid.type || 'Autre';
        counts[t] = (counts[t] || 0) + 1;
    });
    return Object.values(counts);
});

const aidTypeOptions = computed(() => {
    const counts: Record<string, number> = {};
    aids.value.forEach(aid => {
        const t = aid.type || 'Autre';
        counts[t] = (counts[t] || 0) + 1;
    });
    return {
        labels: Object.keys(counts),
        colors: [primary, info, warning, error, '#9333ea', '#06b6d4'],
        chart: { type: 'donut', fontFamily: 'inherit' },
        legend: { position: 'bottom' },
        plotOptions: { pie: { donut: { size: '65%' } } }
    };
});

// Chart Data: Monthly Distribution (Dynamic)
const monthlyData = computed(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        last6Months.push((currentMonth - i + 12) % 12);
    }

    const seriesData = last6Months.map(mIdx => {
        return aids.value.filter(a => new Date(a.dateDistribution).getMonth() === mIdx).length;
    });

    return {
        series: [{ name: 'Aides Distribuées', data: seriesData }],
        categories: last6Months.map(mIdx => months[mIdx])
    };
});

const monthlyOptions = computed(() => ({
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    colors: [primary],
    xaxis: { categories: monthlyData.value.categories },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
    dataLabels: { enabled: false }
}));

async function fetchData() {
    isLoading.value = true;
    try {
        const [beneData, aidsData, visitData, resourceData] = await Promise.all([
            apiFetch('/beneficiaires').catch(() => []), 
            apiFetch('/visits/aids/all').catch(() => []), 
            apiFetch('/visits').catch(() => []),
            apiFetch('/resources').catch(() => [])
        ]);

        resources.value = resourceData;
        aids.value = aidsData;
        beneficiaries.value = beneData;

        // Calculate Stats using correct field names
        const totalValue = aidsData.reduce((acc: number, curr: any) => acc + (Number(curr.valeurEstimee) || 0), 0);
        
        stats.value = {
            totalBeneficiaries: beneData.length,
            totalAidsValue: totalValue,
            totalVisits: visitData.length,
            lowStockCount: resourceData.filter((r: any) => r.quantity < (r.minQuantity || 10)).length
        };

    } catch (err) {
        console.error('Report fetch error:', err);
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchData);
</script>

<template>
  <section class="page-container">
    <header class="page-header d-flex justify-space-between align-center mb-8">
      <div>
        <p class="eyebrow">Analytique Opérationnelle</p>
        <h2 class="text-h4 font-weight-black">Indicateurs de Performance</h2>
        <p class="text-body-1 text-grey-darken-1">Mesure de l'impact social et efficacité de la distribution.</p>
      </div>
      <VBtn 
        color="primary" 
        prepend-icon="mdi-file-pdf-box" 
        variant="tonal" 
        rounded="pill" 
        elevation="0"
        @click="exportToPDF"
        :loading="isExporting"
        class="font-weight-bold"
      >
        Télécharger PDF
      </VBtn>
    </header>

    <div v-if="isLoading" class="d-flex justify-center align-center h-100 py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else>
        <!-- KPI Row -->
        <VRow class="mb-6">
            <VCol cols="12" sm="6" lg="3">
                <VCard elevation="10" rounded="xl" class="pa-6 border-s-lg border-primary">
                    <div class="text-overline text-grey mb-1">Impact Familial</div>
                    <div class="text-h4 font-weight-black">{{ stats.totalBeneficiaries }}</div>
                    <div class="text-caption text-primary">Familles accompagnées</div>
                </VCard>
            </VCol>
            <VCol cols="12" sm="6" lg="3">
                <VCard elevation="10" rounded="xl" class="pa-6 border-s-lg border-success">
                    <div class="text-overline text-grey mb-1">Valeur Distribuée</div>
                    <div class="text-h4 font-weight-black">{{ stats.totalAidsValue.toLocaleString() }} TND</div>
                    <div class="text-caption text-success">Total ressources injectées</div>
                </VCard>
            </VCol>
             <VCol cols="12" sm="6" lg="3">
                <VCard elevation="10" rounded="xl" class="pa-6 border-s-lg border-info">
                    <div class="text-overline text-grey mb-1">Activité Terrain</div>
                    <div class="text-h4 font-weight-black">{{ stats.totalVisits }}</div>
                    <div class="text-caption text-info">Interventions réalisées</div>
                </VCard>
            </VCol>
            <VCol cols="12" sm="6" lg="3">
                <VCard elevation="10" rounded="xl" class="pa-6 border-s-lg border-error">
                    <div class="text-overline text-grey mb-1">Alerte Stock</div>
                    <div class="text-h4 font-weight-black text-error">{{ stats.lowStockCount }}</div>
                    <div class="text-caption text-error">Ressources en seuil critique</div>
                </VCard>
            </VCol>
        </VRow>

        <!-- Charts Row -->
        <VRow>
            <VCol cols="12" md="5">
                <VCard elevation="10" rounded="xl" class="pa-6 h-100">
                    <h3 class="text-h6 font-weight-bold mb-6">Mix des Aides</h3>
                    <apexchart type="donut" height="320" :options="aidTypeOptions" :series="aidTypeSeries" />
                </VCard>
            </VCol>
            <VCol cols="12" md="7">
                <VCard elevation="10" rounded="xl" class="pa-6 h-100">
                    <h3 class="text-h6 font-weight-bold mb-6">Volume Mensuel d'Intervention</h3>
                    <apexchart type="bar" height="320" :options="monthlyOptions" :series="monthlyData.series" />
                </VCard>
            </VCol>
        </VRow>

        <!-- Resources Table -->
        <VCard elevation="10" rounded="xl" class="mt-8 pa-0 overflow-hidden">
            <div class="pa-6 border-b d-flex align-center">
                <h3 class="text-h6 font-weight-bold">État des Stocks & Logistique</h3>
                <VSpacer />
                <VBtn color="primary" size="small" variant="text" append-icon="mdi-chevron-right">Gérer l'inventaire</VBtn>
            </div>
            <v-table class="px-4">
                <thead class="bg-grey-lighten-4">
                    <tr>
                        <th class="font-weight-bold">Désignation</th>
                        <th class="font-weight-bold">Catégorie</th>
                        <th class="font-weight-bold">Stock Actuel</th>
                        <th class="font-weight-bold">Valeur Unitaire</th>
                        <th class="font-weight-bold">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in resources" :key="item.id">
                        <td class="font-weight-medium">{{ item.name }}</td>
                        <td><VChip size="x-small" label>{{ item.type }}</VChip></td>
                        <td>{{ item.quantity }} {{ item.unit }}</td>
                        <td>{{ item.value }} TND</td>
                         <td>
                            <VChip v-if="item.quantity < (item.minQuantity || 10)" color="error" size="x-small" variant="flat">Critique</VChip>
                            <VChip v-else color="success" size="x-small" variant="flat">Opérationnel</VChip>
                        </td>
                    </tr>
                    <tr v-if="resources.length === 0">
                        <td colspan="5" class="text-center pa-8 text-grey">Aucune donnée de stock disponible.</td>
                    </tr>
                </tbody>
            </v-table>
        </VCard>
    </div>
  </section>
</template>

<style scoped>
.page-container { background: #f4f7fa; min-height: 100%; padding: 32px; }
.border-s-lg { border-left-width: 8px !important; }
.border-b { border-bottom: 1px solid rgba(0,0,0,0.05) !important; }
</style>
