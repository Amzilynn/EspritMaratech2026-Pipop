export interface Beneficiary {
  id: string | number;
  codeFamille?: string;
  nomFamille: string;
  adresse: string;
  telephone: string;
  nbMembres: number;
  nbEnfants?: number;
  nbPersonnesAgees?: number;
  nbHandicapes?: number;
  revenuMensuel?: number;
  typeLogement?: string;
  statutSocial?: string;
  situationSociale?: string;
  active: boolean;
  score?: number;
  riskLevel?: string;
  latitude?: number;
  longitude?: number;
}
