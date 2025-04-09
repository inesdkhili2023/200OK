import { Agency
  
 } from "./agency.model";
export interface OurUsers {
    iduser:number,
    email:string,
    name:string;
    lastname:string;
    password:string;
    role:string;
    agency?:Agency;

  }
  