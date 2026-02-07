<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Localisation</p>
        <h2>Gestion de la Localisation</h2>
        <p class="subtle">Enregistrer la position GPS des familles bénéficiaires.</p>
      </div>
    </header>

    <div class="form-card">
      <div class="field-group">
        <label class="field-label">Sélectionner une famille</label>
        <select class="field-input" v-model="selectedFamily">
          <option value="Famille Ben Ali">Famille Ben Ali</option>
          <option value="Famille Trabelsi">Famille Trabelsi</option>
          <option value="Famille Gueddafi">Famille Gueddafi</option>
        </select>
      </div>
      <div class="field-group">
        <label class="field-label">Latitude</label>
        <input type="text" class="field-input" v-model="latitude" placeholder="Ex: 36.8065" />
      </div>
      <div class="field-group">
        <label class="field-label">Longitude</label>
        <input type="text" class="field-input" v-model="longitude" placeholder="Ex: 10.1815" />
      </div>
      <button @click="saveLocation" class="btn btn-success">Enregistrer la position</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedFamily = ref('Famille Ben Ali');
const latitude = ref('36.8065');
const longitude = ref('10.1815');

const saveLocation = () => {
  alert(`Position enregistrée pour ${selectedFamily.value}: ${latitude.value}, ${longitude.value}`);
};
</script>

<style scoped>
.page-container { background: linear-gradient(180deg, #f7f8fb 0%, #eef2f7 100%); min-height: 100%; padding: 28px; }
.page-header { margin-bottom: 30px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: #6b7280; margin: 0 0 6px; }
h2 { margin: 0; font-size: 26px; color: #0f172a; }
.subtle { margin: 6px 0 0; color: #6b7280; }
.form-card { background: #ffffff; padding: 32px; border-radius: 14px; box-shadow: 0 10px 28px rgba(15,23,42,0.08); max-width: 600px; }
.field-group { margin-bottom: 20px; display: flex; flex-direction: column; }
.field-label { font-weight: 600; margin-bottom: 8px; color: #374151; font-size: 14px; }
.field-input { padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; }
.btn { padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; }
.btn-success { background: #0f766e; color: #fff; }
</style>
