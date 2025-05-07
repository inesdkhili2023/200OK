export interface Towing {
  id?: number;
  status: string;
  location: string;
  requestDate: string;
  latitude: number ;
  longitude: number ;
  idAgent: number;
  idUser: number;
  agent?: { id: number; name: string };  // ✅ Add agent object
  user?: { id: number; name: string };   // ✅ Add user object
  
}
