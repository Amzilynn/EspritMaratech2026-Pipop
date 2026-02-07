<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Historique</p>
        <h2>Historique des Familles</h2>
        <p class="subtle">Consulter l'historique complet d'une famille bénéficiaire.</p>
      </div>
    </header>

    <div class="form-card" style="max-width: 400px; margin-bottom: 30px;">
      <div class="field-group">
        <label class="field-label">Sélectionner une famille</label>
        <select class="field-input" v-model="selectedFamily">
          <option value="Famille Ben Ali">Famille Ben Ali</option>
          <option value="Famille Trabelsi">Famille Trabelsi</option>
          <option value="Famille Gueddafi">Famille Gueddafi</option>
        </select>
      </div>
    </div>

    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>Visite terrain - 15/10/2023</h3>
          <p>Visite de contrôle annuelle. Situation stable.</p>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>Aide financière - 01/12/2023</h3>
          <p>Montant: 200 TND - Validé</p>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>Inscription - 01/01/2023</h3>
          <p>Famille ajoutée au programme d'assistance.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const selectedFamily = ref('Famille Ben Ali');
</script>

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
</style>
