export interface Aide {
  id: number;
  beneficiary: string;
  type: string;
  amount: string;
  date: string;
  status: 'Validé' | 'En attente' | 'Rejeté';
}
