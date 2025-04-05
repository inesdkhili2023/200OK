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
    claimId: number;
    description: string;
    dateCreation: string; 
    claimStatus: ClaimStatus;
    claimType: ClaimType;
    user?: OurUsers;
}

