export interface Sinister {
    sinisterId?: number;
    idClient?: number;
    dateAccident: Date;
    dateDeclaration: Date;
    accidentLocation: string;
    typeSinister: string;
    description: string;
    status: 'ACCEPTED' | 'REFUSED' | 'IN_PROGRESS';
}