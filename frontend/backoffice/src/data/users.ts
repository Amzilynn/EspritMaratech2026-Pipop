import type { User } from '@/types/user';

export const users: User[] = [
  { id: 1, name: 'Admin Principal', email: 'admin@omnia.tn', role: 'Administrateur', status: 'Active' },
  { id: 2, name: 'Sami Responsable', email: 'sami@omnia.tn', role: 'Responsable', status: 'Active' },
  { id: 3, name: 'Leila Assistante', email: 'leila@omnia.tn', role: 'Assistant', status: 'Inactive' },
];
