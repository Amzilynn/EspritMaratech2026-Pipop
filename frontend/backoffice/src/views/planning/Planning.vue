<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <p class="eyebrow">Planification</p>
        <h2>Planification des Tournées</h2>
        <p class="subtle">Organiser les visites terrain.</p>
      </div>
    </header>

    <div class="table-card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Zone</th>
              <th>Familles à visiter</th>
              <th>Bénévole assigné</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15/01/2024</td>
              <td>Tunis Centre</td>
              <td>Famille Ben Ali</td>
              <td>Sami Responsable</td>
              <td><span class="status-chip is-pending">Planifiée</span></td>
            </tr>
            <tr>
              <td>18/01/2024</td>
              <td>Sfax</td>
              <td>Famille Trabelsi</td>
              <td>Leila Assistante</td>
              <td><span class="status-chip is-valid">Effectuée</span></td>
            </tr>
          </tbody>
        </table>
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
.table-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08); }
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: separate; border-spacing: 0; }
.table th { text-align: left; padding: 14px 16px; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #475569; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.table td { padding: 14px 16px; border-bottom: 1px solid #edf2f7; color: #0f172a; }
.status-chip { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.is-valid { background: #dcfce7; color: #166534; }
.is-pending { background: #fef3c7; color: #92400e; }
</style>
