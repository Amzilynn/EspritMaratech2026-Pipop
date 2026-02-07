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
  { header: 'Tableau de bord', roles: ['admin'] },
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    BgColor: 'primary',
    to: '/',
    roles: ['admin']
  },
  { header: 'Gestion' },
  {
    title: 'Familles Bénéficiaires',
    icon: MoodHappyIcon,
    BgColor: 'primary',
    to: '/beneficiaries',
    roles: ['admin', 'responsable', 'benevole']
  },
  {
    title: 'Visites',
    icon: CircleDotIcon,
    BgColor: 'primary',
    to: '/visits',
    roles: ['admin', 'responsable', 'benevole']
  },
  {
    title: 'Aides',
    icon: BoxMultiple1Icon,
    BgColor: 'primary',
    to: '/aides',
    roles: ['admin', 'responsable', 'benevole']
  },
  {
    title: 'Localisation',
    icon: AlertCircleIcon,
    BgColor: 'primary',
    to: '/localisation',
    roles: ['benevole']
  },
  {
    title: 'Historique',
    icon: BorderAllIcon,
    BgColor: 'primary',
    to: '/history',
    roles: ['responsable', 'benevole']
  },
  { header: 'Administration', roles: ['admin', 'responsable'] },
  {
    title: 'Utilisateurs',
    icon: UserPlusIcon,
    BgColor: 'primary',
    to: '/users',
    roles: ['admin']
  },
  {
    title: 'Rôles & Accès',
    icon: ApertureIcon,
    BgColor: 'primary',
    to: '/roles',
    roles: ['admin']
  },
  {
    title: 'Bénévoles',
    icon: UserPlusIcon,
    BgColor: 'primary',
    to: '/benevoles',
    roles: ['responsable']
  },
  { header: 'Rapports', roles: ['responsable'] },
  {
    title: 'Cartographie',
    icon: BorderAllIcon,
    BgColor: 'primary',
    to: '/cartography',
    roles: ['responsable']
  },
  {
    title: 'Planification',
    icon: BorderAllIcon,
    BgColor: 'primary',
    to: '/planning',
    roles: ['responsable']
  },
];


export default sidebarItem;
