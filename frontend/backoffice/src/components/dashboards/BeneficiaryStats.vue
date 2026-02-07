<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const primary = theme.current.value.colors.primary;
const error = theme.current.value.colors.error;
const warning = theme.current.value.colors.warning;
const info = theme.current.value.colors.info;

const chartOptions = computed(() => {
    return {
        series: [45, 15, 27, 18],
        labels: ['Précaire', 'Nécessiteux', 'Orphelin', 'Handicap'],
        chart: {
            type: 'donut',
            fontFamily: 'inherit',
            height: 300,
        },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        name: { show: true, fontSize: '14px', color: 'inherit' },
                        value: { show: true, fontSize: '20px', fontWeight: 'bold' },
                        total: { show: true, label: 'Total', color: 'inherit' }
                    }
                }
            }
        },
        stroke: { show: false },
        colors: [primary, error, warning, info],
        legend: { position: 'bottom', horizontalAlign: 'center' },
        tooltip: { theme: 'light', fillSeriesColor: false },
    };
});
</script>

<template>
    <v-card elevation="10" class="withbg">
        <v-card-item>
            <div class="d-flex align-center justify-space-between pt-sm-2">
                <v-card-title class="text-h5">Répartition par Statut</v-card-title>
            </div>
            <div class="mt-6">
                <apexchart type="donut" height="300" :options="chartOptions" :series="chartOptions.series" />
            </div>
        </v-card-item>
    </v-card>
</template>
