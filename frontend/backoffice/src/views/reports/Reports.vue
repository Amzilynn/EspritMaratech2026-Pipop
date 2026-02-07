<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Rapports</p>
        <h2>Statistiques & Rapports</h2>
        <p class="subtle">Analyse des données de l'association.</p>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Bénéficiaires</h3>
        <p class="value">3 Familles</p>
      </div>
      <div class="stat-card">
        <h3>Aides Distribuées</h3>
        <p class="value">1 250 TND</p>
      </div>
      <div class="stat-card">
        <h3>Visites Effectuées</h3>
        <p class="value">12 Visites</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-container {
  --ink: #0f172a;
  --muted: #6b7280;
  --brand: #0f766e;
  background: linear-gradient(180deg, #f7f8fb 0%, #eef2f7 100%);
  min-height: 100%;
  padding: 28px;
}
.page-header { margin-bottom: 30px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: var(--muted); margin: 0 0 6px; }
h2 { margin: 0; font-size: 26px; color: var(--ink); }
.subtle { margin: 6px 0 0; color: var(--muted); }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
.stat-card { background: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.stat-card h3 { font-size: 14px; text-transform: uppercase; color: var(--muted); margin: 0 0 10px; }
.stat-card .value { font-size: 32px; font-weight: 700; color: var(--brand); margin: 0; }
</style>
