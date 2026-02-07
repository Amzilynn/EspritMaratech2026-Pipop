<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const primary = theme.current.value.colors.primary;
const secondary = theme.current.value.colors.secondary;

const chartOptions = computed(() => {
    return {
        series: [
            {
                name: "Visites",
                data: [35, 60, 40, 75, 50, 85, 95],
            },
            {
                name: "Aides Distribuées",
                data: [30, 50, 35, 60, 40, 70, 80],
            }
        ],
        chart: {
            type: 'area',
            height: 350,
            fontFamily: 'inherit',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        colors: [primary, secondary],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.1 } },
        xaxis: {
            categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: { show: true },
        grid: { strokeDashArray: 4, borderColor: 'rgba(0,0,0,0.1)' },
        tooltip: { theme: 'light' },
        legend: { show: true, position: 'top', horizontalAlign: 'right' }
    };
});
</script>

<template>
    <v-card elevation="10" class="withbg">
        <v-card-item>
            <div class="d-flex align-center justify-space-between pt-sm-2">
                <v-card-title class="text-h5">Activité Hebdomadaire</v-card-title>
            </div>
            <div class="mt-6">
                <apexchart type="area" height="350" :options="chartOptions" :series="chartOptions.series" />
            </div>
        </v-card-item>
    </v-card>
</template>
