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
  { header: 'Tableau de bord' },
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    BgColor: 'primary',
    to: '/',
    roles: ['ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE']
  },
  { header: 'Gestion' },
  {
    title: 'Familles Bénéficiaires',
    icon: 'mdi-emoticon-happy',
    BgColor: 'primary',
    to: '/beneficiaries',
    roles: ['ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE']
  },
  {
    title: 'Visites',
    icon: 'mdi-map-marker-path',
    BgColor: 'primary',
    to: '/visits',
    roles: ['ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE']
  },
  {
    title: 'Aides',
    icon: 'mdi-gift',
    BgColor: 'primary',
    to: '/aides',
    roles: ['ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE']
  },
  {
    title: 'Localisation',
    icon: 'mdi-crosshairs-gps',
    BgColor: 'primary',
    to: '/localisation',
    roles: ['BENEVOLE', 'RESPONSABLE_TERRAIN']
  },
  { header: 'Administration', roles: ['ADMIN', 'RESPONSABLE_TERRAIN'] },
  {
    title: 'Bénévoles',
    icon: 'mdi-account-heart',
    BgColor: 'primary',
    to: '/benevoles',
    roles: ['ADMIN', 'RESPONSABLE_TERRAIN']
  },
  {
    title: 'Responsables',
    icon: 'mdi-account-tie',
    BgColor: 'primary',
    to: '/responsables',
    roles: ['ADMIN']
  },
  { header: 'Analyses', roles: ['ADMIN', 'RESPONSABLE_TERRAIN'] },
  {
    title: 'Rapports',
    icon: 'mdi-chart-pie',
    BgColor: 'primary',
    to: '/reports',
    roles: ['ADMIN', 'RESPONSABLE_TERRAIN']
  },
  {
    title: 'Priorités & Risques',
    icon: 'mdi-alert-decagram',
    BgColor: 'primary',
    to: '/cartography',
    roles: ['ADMIN', 'RESPONSABLE_TERRAIN']
  },
  {
    title: 'Planification',
    icon: 'mdi-calendar-clock',
    BgColor: 'primary',
    to: '/planning',
    roles: ['RESPONSABLE_TERRAIN']
  },
];


export default sidebarItem;
