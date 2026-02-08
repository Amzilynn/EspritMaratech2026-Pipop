import {
  LayoutDashboardIcon,
  BorderAllIcon,
  AlertCircleIcon,
  CircleDotIcon,
  BoxMultiple1Icon,
  MoodHappyIcon,
  ApertureIcon,
  UserPlusIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  BgColor?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  roles?: string[]; // Add roles property
}

const sidebarItem: menu[] = [
  // ==========================================
  // 👑 ADMIN (GOUVERNANCE SYSTÈME)
  // ==========================================
  { header: 'Pilotage', roles: ['ADMIN'] },
  {
    title: 'Tableau de bord',
    subCaption: 'Santé globale du système',
    icon: 'mdi-monitor-dashboard',
    to: '/',
    roles: ['ADMIN']
  },
  { header: 'Utilisateurs', roles: ['ADMIN'] },
  {
    title: 'Responsables',
    subCaption: 'Superviseurs terrain',
    icon: 'mdi-account-tie-outline',
    to: '/responsables',
    roles: ['ADMIN']
  },
  {
    title: 'Bénévoles',
    subCaption: 'Agents d\'intervention',
    icon: 'mdi-account-group-outline',
    to: '/benevoles',
    roles: ['ADMIN']
  },
  { header: 'Opérations', roles: ['ADMIN'] },
  {
    title: 'Données terrain',
    subCaption: 'Audit familles & visites',
    icon: 'mdi-database-check-outline',
    to: '/beneficiaries',
    roles: ['ADMIN']
  },
  {
    title: 'Carte & Rapports',
    subCaption: 'Impact & Géolocalisation',
    icon: 'mdi-earth',
    to: '/cartography',
    roles: ['ADMIN']
  },
  {
    title: 'Paramètres',
    subCaption: 'Configuration du système',
    icon: 'mdi-cog-outline',
    to: '/settings',
    roles: ['ADMIN']
  },

  // ==========================================
  // 🧭 RESPONSABLE (SUPERVISION & PLANNING)
  // ==========================================
  { header: 'Supervision', roles: ['RESPONSABLE_TERRAIN'] },
  {
    title: 'Vue d’ensemble',
    subCaption: 'Performance & alertes',
    icon: 'mdi-view-quilt-outline',
    to: '/',
    roles: ['RESPONSABLE_TERRAIN']
  },
  { header: 'Utilisateurs', roles: ['RESPONSABLE_TERRAIN'] },
  {
    title: 'Bénévoles',
    subCaption: 'Agents de mon secteur',
    icon: 'mdi-account-group-outline',
    to: '/benevoles',
    roles: ['RESPONSABLE_TERRAIN']
  },
  { header: 'Opérations', roles: ['RESPONSABLE_TERRAIN'] },
  {
    title: 'Suivi des actions',
    subCaption: 'Visites et aides',
    icon: 'mdi-list-status',
    to: '/visits',
    roles: ['RESPONSABLE_TERRAIN']
  },
  {
    title: 'Carte & zones',
    subCaption: 'Couverture géographique du secteur',
    icon: 'mdi-map-marker-radius-outline',
    to: '/cartography',
    roles: ['RESPONSABLE_TERRAIN']
  },
  {
    title: 'Planification',
    subCaption: 'Organisation des interventions',
    icon: 'mdi-calendar-clock',
    to: '/planning',
    roles: ['RESPONSABLE_TERRAIN']
  },
  {
    title: 'Historique global',
    subCaption: 'Audit des actions passées',
    icon: 'mdi-history',
    to: '/history',
    roles: ['RESPONSABLE_TERRAIN']
  },

  // ==========================================
  // 🚶 BÉNÉVOLE (ACTION TERRAIN)
  // ==========================================
  { header: 'Ma Mission', roles: ['BENEVOLE'] },
  {
    title: 'Accueil',
    subCaption: 'Ma journée et mes priorités',
    icon: 'mdi-home-heart',
    to: '/',
    roles: ['BENEVOLE']
  },
  {
    title: 'Familles',
    subCaption: 'Consultation des dossiers bénéficiaires',
    icon: 'mdi-account-heart-outline',
    to: '/beneficiaries',
    roles: ['BENEVOLE']
  },
  {
    title: 'Nouvelle visite',
    subCaption: 'Enregistrer une intervention maintenant',
    icon: 'mdi-clipboard-plus-outline',
    to: '/visits/new',
    roles: ['BENEVOLE']
  },
  {
    title: 'Aides distribuées',
    subCaption: 'Déclarer les ressources remises',
    icon: 'mdi-package-variant-closed-check',
    to: '/aides',
    roles: ['BENEVOLE']
  },
  {
    title: 'Carte terrain',
    subCaption: 'Localiser les familles à proximité',
    icon: 'mdi-map-marker-path',
    to: '/cartography',
    roles: ['BENEVOLE']
  },
  {
    title: 'Historique famille',
    subCaption: 'Consulter les actions passées',
    icon: 'mdi-text-box-search-outline',
    to: '/history',
    roles: ['BENEVOLE']
  },
];


export default sidebarItem;
