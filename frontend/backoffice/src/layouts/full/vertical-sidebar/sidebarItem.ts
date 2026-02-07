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
  { header: 'Tableau de bord', roles: ['ADMIN'] },
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    BgColor: 'primary',
    to: '/',
    roles: ['ADMIN']
  },
  { header: 'Gestion' },
  {
    title: 'Familles Bénéficiaires',
    icon: MoodHappyIcon,
    BgColor: 'primary',
    to: '/beneficiaries',
    roles: ['ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE']
  },
  {
    title: 'Visites',
    icon: CircleDotIcon,
    BgColor: 'primary',
    to: '/visits',
    roles: ['ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE']
  },
  {
    title: 'Aides',
    icon: BoxMultiple1Icon,
    BgColor: 'primary',
    to: '/aides',
    roles: ['ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE']
  },
  {
    title: 'Localisation',
    icon: AlertCircleIcon,
    BgColor: 'primary',
    to: '/localisation',
    roles: ['BENEVOLE']
  },
  {
    title: 'Historique',
    icon: BorderAllIcon,
    BgColor: 'primary',
    to: '/history',
    roles: ['RESPONSABLE_TERRAIN', 'BENEVOLE']
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
  { header: 'Rapports', roles: ['RESPONSABLE_TERRAIN'] },
  {
    title: 'Cartographie',
    icon: BorderAllIcon,
    BgColor: 'primary',
    to: '/cartography',
    roles: ['RESPONSABLE_TERRAIN']
  },
  {
    title: 'Planification',
    icon: BorderAllIcon,
    BgColor: 'primary',
    to: '/planning',
    roles: ['RESPONSABLE_TERRAIN']
  },
];


export default sidebarItem;
