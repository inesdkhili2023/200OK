export interface User {
    idUser: number;
    name: string;
    email: string;
    cin?: string; // Optional if you use CIN
    civility?: string; // Optional, can be 'Mr.', 'Ms.', etc.
    dnass?: Date; // Date of birth or other relevant field
    role?: string; // Optional role like 'Admin', 'Client', etc.
}
