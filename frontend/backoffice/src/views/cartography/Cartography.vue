<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Cartographie</p>
        <h2>Carte des Bénéficiaires</h2>
        <p class="subtle">Visualiser la répartition géographique des familles.</p>
      </div>
    </header>

    <div class="map-container">
      <div class="map-placeholder">
        <p>🗺️ Carte interactive des bénéficiaires</p>
        <p class="note">(Intégration OpenStreetMap ou Google Maps à venir)</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Familles</h3>
        <p class="value">3</p>
      </div>
      <div class="stat-card">
        <h3>Zones Couvertes</h3>
        <p class="value">2</p>
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
.map-container { margin-bottom: 30px; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 28px rgba(15,23,42,0.08); }
.map-placeholder { height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: #fff; }
.map-placeholder p { margin: 8px 0; font-size: 20px; font-weight: 600; }
.map-placeholder .note { font-size: 14px; opacity: 0.9; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
.stat-card { background: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.stat-card h3 { font-size: 14px; text-transform: uppercase; color: #6b7280; margin: 0 0 10px; }
.stat-card .value { font-size: 32px; font-weight: 700; color: #0f766e; margin: 0; }
</style>
