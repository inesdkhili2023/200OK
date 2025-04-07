import { OurUsers } from "./user.model";

export enum ClaimType {
    CLAIM = 'CLAIM',
    IDEAS = 'IDEAS'
}

export enum ClaimStatus {
    UNTREATED = 'UNTREATED',
    INPROGRESS = 'INPROGRESS',
    TREATED = 'TREATED'
}

export interface Claim {
    claimId: number | null;
    description: string;
    dateCreation: string | null; 
    claimStatus: ClaimStatus;
    claimType: ClaimType;
    user?: OurUsers | null;
}

