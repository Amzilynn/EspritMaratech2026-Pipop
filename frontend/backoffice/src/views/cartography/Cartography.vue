<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useMapStore } from '@/stores/map.store';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Vuetify components
import {
  VCard,
  VSlider,
  VDivider,
  VBtn,
  VIcon,
  VProgressLinear,
  VTextField,
  VChip,
  VSpacer
} from 'vuetify/components';

// -------------------- STORES --------------------
const mapStore = useMapStore();

// -------------------- MAP STATE --------------------
const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let heatLayer: any = null;
// -------------------- REGIONS DATA --------------------
const governoratesList = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte', 'Béja', 
    'Jendouba', 'Le Kef', 'Siliana', 'Kairouan', 'Kassérine', 'Sidi Bouzid', 'Sousse', 
    'Monastir', 'Mahdia', 'Sfax', 'Gafsa', 'Tozeur', 'Kebili', 'Gabès', 'Médenine', 'Tataouine'
];

// Computed counts for smart visualization
const regionStats = computed(() => {
    const stats: Record<string, number> = {};
    mapStore.beneficiaries.forEach(b => {
        const gov = governoratesList.find(g => b.adresse?.includes(g));
        if (gov) stats[gov] = (stats[gov] || 0) + 1;
    });
    return stats;
});
// ------------------------------------------------------

const showFilters = ref(true);
const regionSearch = ref('');

const filteredGovernorates = computed(() => {
    return governoratesList.filter(g => g.toLowerCase().includes(regionSearch.value.toLowerCase()));
});

// -------------------- INITIALIZATION --------------------
onMounted(async () => {
    mapStore.minScore = 0; // Force visibility of all zones on first load
    await mapStore.fetchMapData();
    initMap();
});

function initMap() {
    if (!mapContainer.value) return;

    // Initialize map centered on Tunisia
    map = L.map(mapContainer.value, {
        center: [34.0, 9.5],
        zoom: 7,
        zoomControl: false // Custom placement for accessibility
    });

    // Add professional light tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    updateHeatmap();
}

// -------------------- INTERACTIVITY --------------------
let markerLayer: L.LayerGroup | null = null;

function updateHeatmap() {
    if (!map) return;

    if (heatLayer) map.removeLayer(heatLayer);
    if (markerLayer) map.removeLayer(markerLayer);

    // 1. Update Heatmap
    // @ts-ignore
    heatLayer = (L as any).heatLayer(mapStore.heatmapPoints, {
        radius: 30,
        blur: 15,
        maxZoom: 13,
        gradient: { 0.4: '#3388ff', 0.6: '#facc15', 0.7: '#f59e0b', 0.8: '#ef4444', 1.0: '#991b1b' }
    }).addTo(map);

    // 2. Update Interactive Markers
    markerLayer = L.layerGroup();
    mapStore.filteredData.forEach(fam => {
        if (fam.latitude && fam.longitude) {
            const marker = L.circleMarker([fam.latitude, fam.longitude], {
                radius: 6,
                fillColor: getScoreColor(fam.vulnerabilityScore),
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            });

            const popupContent = `
                <div style="font-family: inherit; min-width: 200px">
                    <h4 style="margin: 0 0 5px; color: #1e293b">${fam.nomFamille}</h4>
                    <p style="margin: 0 0 10px; font-size: 12px; color: #64748b">${fam.adresse}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 8px">
                        <span style="font-size: 13px; font-weight: 700; color: ${getScoreColor(fam.vulnerabilityScore)}">Score: ${fam.vulnerabilityScore}%</span>
                        <a href="/beneficiaries/edit/${fam.id}" style="font-size: 11px; text-decoration: none; color: #2563eb; font-weight: bold">Détails →</a>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, { className: 'premium-popup' });
            marker.addTo(markerLayer!);
        }
    });
    markerLayer.addTo(map);
}

// -------------------- HELPERS --------------------
function getScoreColor(score: number) {
    if (score >= 80) return '#ef4444'; // Critical - Red
    if (score >= 65) return '#f59e0b'; // High - Orange
    if (score >= 40) return '#facc15'; // Moderate - Yellow
    return '#3388ff'; // Low - Blue
}

// Tunisia Governorates Coordinates (Approximate Center)
const GOV_COORDS: Record<string, [number, number]> = {
    'Tunis': [36.8188, 10.1659], 'Ariana': [36.8625, 10.1956], 'Ben Arous': [36.7533, 10.2222],
    'Manouba': [36.8078, 10.0864], 'Nabeul': [36.4511, 10.7357], 'Zaghouan': [36.4025, 10.1428],
    'Bizerte': [37.2746, 9.8739], 'Béja': [36.7256, 9.1817], 'Jendouba': [36.5011, 8.7794],
    'Le Kef': [36.1742, 8.7049], 'Siliana': [36.0840, 9.3708], 'Kairouan': [35.6781, 10.0963],
    'Kassérine': [35.1676, 8.8365], 'Sidi Bouzid': [35.0382, 9.4858], 'Sousse': [35.8256, 10.6360],
    'Monastir': [35.7780, 10.8263], 'Mahdia': [35.5047, 11.0622], 'Sfax': [34.7406, 10.7603],
    'Gafsa': [34.4250, 8.7842], 'Tozeur': [33.9189, 8.1335], 'Kebili': [33.7050, 8.9690],
    'Gabès': [33.8815, 10.0982], 'Médenine': [33.3547, 10.5055], 'Tataouine': [32.9297, 10.4518]
};

watch(() => mapStore.heatmapPoints, () => {
    updateHeatmap();
}, { deep: true });

watch(() => mapStore.selectedRegion, (newRegion) => {
    if (newRegion && map && GOV_COORDS[newRegion]) {
        map.flyTo(GOV_COORDS[newRegion], 10, {
            duration: 1.5,
            easeLinearity: 0.25
        });
    } else if (!newRegion && map) {
        map.flyTo([34.0, 9.5], 7);
    }
});

const topHotspots = computed(() => {
    return [...mapStore.filteredData]
        .sort((a, b) => b.vulnerabilityScore - (a.vulnerabilityScore || 0))
        .slice(0, 5);
});

onUnmounted(() => {
    if (map) {
        map.remove();
        map = null;
    }
});
</script>

<template>
  <div class="map-view-layout">
    <!-- COLLAPSIBLE SIDEBAR -->
    <div v-show="showFilters" class="nav-sidebar">
      <div class="sidebar-header">
        <h2 class="text-h4 font-weight-black text-uppercase tracking-tighter">Omnia Géo</h2>
        <p class="text-subtitle-2 text-blue-grey-darken-2 opacity-80">Intelligence Opérationnelle</p>
      </div>

      <div class="scroll-area">
        <VDivider class="mb-6" />

        <!-- THRESHOLD SELECTOR -->
        <div class="mb-8">
          <div class="d-flex justify-space-between align-center mb-4">
            <span class="text-overline tracking-wider" style="color: #475569">Seuil de Priorité</span>
            <VChip color="primary" size="x-small" variant="flat" class="font-weight-black">> {{ mapStore.minScore }}%</VChip>
          </div>
          <VSlider
            v-model="mapStore.minScore"
            :min="0"
            :max="90"
            :step="5"
            color="primary"
            track-color="blue-grey-lighten-4"
            hide-details
            thumb-size="16"
          />
        </div>

        <!-- GOVERNORATE SELECTOR -->
        <div class="mb-6">
          <span class="text-overline d-block mb-4 tracking-widest" style="color: #475569">Secteurs (24)</span>
          <VTextField
            v-model="regionSearch"
            placeholder="Rechercher..."
            density="compact"
            variant="solo"
            flat
            rounded="lg"
            bg-color="#f1f5f9"
            class="mb-4 custom-field"
            hide-details
            prepend-inner-icon="mdi-magnify"
          />
          
          <div class="gov-grid">
            <div 
              v-for="gov in filteredGovernorates" 
              :key="gov"
              class="gov-card"
              :class="{ active: mapStore.selectedRegion === gov }"
              @click="mapStore.selectedRegion = mapStore.selectedRegion === gov ? null : gov"
            >
              <span class="text-caption font-weight-bold text-white">{{ gov }}</span>
              <div class="d-flex align-center">
                <VIcon size="10" color="grey-lighten-2" class="mr-1">mdi-account-group</VIcon>
                <span class="text-caption text-grey-lighten-2">{{ regionStats[gov] || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ALERT LIST -->
        <div v-if="topHotspots.length > 0">
          <span class="text-overline text-error d-block mb-3 tracking-widest">Points Critiques</span>
          <div v-for="fam in topHotspots" :key="fam.id" 
               @click="() => { if(fam.latitude && fam.longitude && map) (map as L.Map).flyTo([fam.latitude,fam.longitude], 12) }"
               class="alert-card pa-4 mb-3 rounded-xl border border-white border-opacity-10 bg-white-05 cursor-pointer">
            <div class="text-subtitle-2 font-weight-black text-white">{{ fam.nomFamille }}</div>
            <div class="text-caption text-blue-grey-lighten-4 mb-2 truncate">{{ fam.adresse }}</div>
            <div class="d-flex align-center gap-2">
              <VProgressLinear :model-value="fam.vulnerabilityScore" color="error" height="6" rounded />
              <span class="text-caption text-error font-weight-black">{{ fam.vulnerabilityScore }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN MAP AREA -->
    <div class="map-view-main">
      <div class="hud-controls">
        <VBtn
          icon="mdi-tune"
          color="white"
          variant="flat"
          @click="showFilters = !showFilters"
          size="small"
          class="hud-btn"
        />
        <div class="hud-pill">
          <div class="pulse-dot"></div>
          <span class="text-caption font-weight-black text-uppercase tracking-widest" style="color: #1e293b">
            {{ mapStore.heatmapPoints.length }} Zones Actives
          </span>
        </div>
        <VSpacer />
        <div class="hud-pill d-none d-sm-flex">
          <span class="text-caption font-weight-bold mr-3" style="color: #64748b">Intensité:</span>
          <div class="heat-scale"></div>
        </div>
      </div>

      <div ref="mapContainer" class="map-host"></div>
      
      <!-- EMPTY STATE OVERLAY -->
      <div v-if="mapStore.heatmapPoints.length === 0" class="overlay-empty">
        <VCard color="grey-darken-4" class="pa-12 text-center" rounded="xl" elevation="24">
          <VIcon size="80" color="primary" class="mb-6 pulse-icon">mdi-target-variant</VIcon>
          <h3 class="text-h5 font-weight-bold text-white mb-2">Aucun Signal de Vulnérabilité</h3>
          <p class="text-body-2 text-grey-lighten-1 mb-8">Ajustez le seuil pour visualiser les cibles prioritaires.</p>
          <VBtn color="primary" rounded="pill" size="large" @click="mapStore.minScore = 0" class="px-8 font-weight-black">
            Vider les filtres
          </VBtn>
        </VCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Master Container - Clean Light Theme */
.map-view-layout {
  display: flex;
  height: calc(100vh - 120px);
  background: #f8fafc;
  border-radius: 24px;
  overflow: hidden;
  margin: 12px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Glass Sidebar - Light Version */
.nav-sidebar {
  width: 400px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.sidebar-header { padding: 32px 28px 24px; }
.sidebar-header h2 { color: #1e293b !important; }

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 28px 40px;
}

/* Custom Scrollbar */
.scroll-area::-webkit-scrollbar { width: 4px; }
.scroll-area::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }

/* Grid of Regions */
.gov-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-height: 350px;
  overflow-y: auto;
  padding: 4px;
}

.gov-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.gov-card span { color: #475569 !important; }

.gov-card:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
  transform: translateY(-3px);
}

.gov-card.active {
  background: #2563eb !important;
  border-color: #2563eb;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
}
.gov-card.active span, .gov-card.active i { color: white !important; }

/* Alert Cards */
.alert-card {
  transition: all 0.2s ease;
  background: white;
  border: 1px solid #e2e8f0;
}
.alert-card:hover {
  background: #f8fafc;
  transform: translateX(5px);
  border-color: #3b82f6;
}

/* Main Map Area */
.map-view-main {
  flex: 1;
  position: relative;
  background: #f1f5f9;
}

.map-host { width: 100%; height: 100%; }

/* HUD Controls */
.hud-controls {
  position: absolute;
  top: 24px;
  left: 24px;
  right: 24px;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 16px;
}

.hud-controls > * { pointer-events: auto; }

.hud-pill {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 12px 28px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.hud-btn { 
  border-radius: 12px !important; 
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  background: white !important;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 12px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.heat-scale {
  width: 100px;
  height: 6px;
  background: linear-gradient(to right, #3388ff, #facc15, #ef4444);
  border-radius: 20px;
}

/* Empty State Overlays */
.overlay-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  z-index: 500;
}

.pulse-icon { animation: bounce 3s infinite ease-in-out; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

/* Leaflet Overrides */
:deep(.leaflet-popup-content-wrapper) {
  background: white;
  color: #1e293b;
  border-radius: 18px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
:deep(.leaflet-popup-tip) { background: white; }
:deep(.leaflet-control-zoom) { border: none !important; border-radius: 12px !important; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important; }
:deep(.leaflet-control-zoom-in), :deep(.leaflet-control-zoom-out) {
  background: white !important;
  color: #1e293b !important;
}
</style>
