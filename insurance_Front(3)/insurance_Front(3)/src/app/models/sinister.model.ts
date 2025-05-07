import { SinisterType } from './sinister-type.enum';

export interface Sinister {
    sinisterId?: number;
    idClient?: number;
    dateAccident: Date;
    dateDeclaration: Date;
    accidentLocation: string;
    typeSinister: SinisterType;
    description: string;
    status: 'ACCEPTED' | 'REFUSED' | 'IN_PROGRESS';
    attachmentPath?: string;
    estimatedCompensation?: number;
    

}