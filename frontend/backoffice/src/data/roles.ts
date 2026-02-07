import type { Role } from '@/types/role';

export const roles: Role[] = [
  { id: 1, name: 'Administrateur', description: 'Accès complet à toutes les fonctionnalités', permissions: ['all'] },
  { id: 2, name: 'Responsable', description: 'Gestion des aides et des visites', permissions: ['read_beneficiary', 'write_beneficiary'] },
  { id: 3, name: 'Assistant', description: 'Lecture seule', permissions: ['read_only'] },
];
