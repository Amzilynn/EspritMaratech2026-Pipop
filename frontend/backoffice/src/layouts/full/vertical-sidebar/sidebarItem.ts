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
}

const sidebarItem: menu[] = [
  { header: 'Tableau de bord' },
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    BgColor: 'primary',
    to: '/'
  },
  { header: 'Gestion' },
  {
    title: 'Familles Bénéficiaires',
    icon: MoodHappyIcon,
    BgColor: 'primary',
    to: '/beneficiaries'
  },
  {
    title: 'Visites',
    icon: CircleDotIcon,
    BgColor: 'primary',
    to: '/visits'
  },
  {
    title: 'Aides',
    icon: BoxMultiple1Icon,
    BgColor: 'primary',
    to: '/aides'
  },
  {
    title: 'Localisation',
    icon: AlertCircleIcon,
    BgColor: 'primary',
    to: '/localisation'
  },
  {
    title: 'Historique',
    icon: BorderAllIcon,
    BgColor: 'primary',
    to: '/history'
  },
  { header: 'Administration' },
  {
    title: 'Utilisateurs',
    icon: UserPlusIcon,
    BgColor: 'primary',
    to: '/users'
  },
  {
    title: 'Rôles & Accès',
    icon: ApertureIcon,
    BgColor: 'primary',
    to: '/roles'
  },
  {
    title: 'Bénévoles',
    icon: UserPlusIcon,
    BgColor: 'primary',
    to: '/benevoles'
  },
  { header: 'Rapports' },
  {
    title: 'Cartographie',
    icon: BorderAllIcon,
    BgColor: 'primary',
    to: '/cartography'
  },
  {
    title: 'Planification',
    icon: BorderAllIcon,
    BgColor: 'primary',
    to: '/planning'
  },
  {
    title: 'Stats & Rapports',
    icon: LayoutDashboardIcon,
    BgColor: 'primary',
    to: '/reports'
  },
];


export default sidebarItem;
