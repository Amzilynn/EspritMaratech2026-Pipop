import type { Beneficiary } from '@/types/beneficiary';

export const beneficiaries: Beneficiary[] = [
  {
    id: 1,
    name: 'Famille Ben Ali',
    address: '123 Rue de la Paix, Tunis',
    members: 4,
    socialStatus: 'Dans le besoin',
    phone: '55 123 456',
    cin: '09876543',
    archived: false,
  },
  {
    id: 2,
    name: 'Famille Trabelsi',
    address: '456 Avenue de la Liberté, Sfax',
    members: 2,
    socialStatus: 'Vulnérable',
    phone: '22 987 654',
    cin: '01234567',
    archived: false,
  },
    {
    id: 3,
    name: 'Famille Gueddafi',
    address: '789 Boulevard de l\'Environnement, Sousse',
    members: 6,
    socialStatus: 'Dans le besoin',
    phone: '98 111 222',
    cin: '07654321',
    archived: true,
  },
];
