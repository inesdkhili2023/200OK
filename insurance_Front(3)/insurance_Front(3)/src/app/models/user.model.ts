import { Agency
  
 } from "./agency.model";
export interface OurUsers {
    iduser:number;
    email:string;
    name:string;
    lastname:string;
    password:string;
    role:string;
    agency?:Agency;
    cin?: string; // Optional if you use CIN
    civility?: string; // Optional, can be 'Mr.', 'Ms.', etc.
    dnass?: Date; // Date of birth or other relevant field
  }
  