import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private BASE_URL="http://localhost:9090";
  constructor(private http:HttpClient  ) { }

  ///////////login////////
  async login(email:string,password:string):Promise<any>{
    const url=`${this.BASE_URL}/auth/login`
    try{
      const response=await this.http.post<any>(url,{email,password}).toPromise()
      return response;
    }catch(error){
      throw error;
    }
    
  }

  ////////register////////
  async register(userData:any, token:string):Promise<any>{
    const url = `${this.BASE_URL}/admin/register`
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    console.log("Headers envoyés :", headers);
    try{
      const response =  this.http.post<any>(url, userData, {headers}).toPromise()
      console.log("Réponse de l'API:", response);
      return response;
      
    }catch(error){
      throw error;
    }
  }

  ////////Signup////////
  async signup(userData:any):Promise<any>{
    const url = `${this.BASE_URL}/auth/signup`
    try{
      const response =  this.http.post<any>(url, userData).toPromise()
      console.log("Réponse de l'API:", response);
      return response;
      
    }catch(error){
      throw error;
    }
  }

  ////////////liste_user(require admin token)////////
  async getAllUsers(token:string):Promise<any>{
    const url = `${this.BASE_URL}/admin/get-all-users`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try{
      const response =  this.http.get<any>(url, {headers}).toPromise()
      return response;
    }catch(error){
      throw error;
    }
  }
  ////////////profile(require admin or user token)//////
  async getYourProfile(token:string):Promise<any>{
    const url = `${this.BASE_URL}/allRole/get-all-profile`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try{
      const response =  this.http.get<any>(url, {headers}).toPromise()
      return response;
    }catch(error){
      throw error;
    }
  }
  //////////user by id /////////////
  async getUsersById(userId: string, token:string):Promise<any>{
    const url = `${this.BASE_URL}/adminuser/get-users/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try{
      const response =  this.http.get<any>(url, {headers}).toPromise()
      return response;
    }catch(error){
      throw error;
    }
  }
///////////supprimer user by id ///////
async deleteUser(userId: string, token:string):Promise<any>{
  const url = `${this.BASE_URL}/admin/delete/${userId}`;
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  })
  try{
    const response =  this.http.delete<any>(url, {headers}).toPromise()
    return response;
  }catch(error){
    throw error;
  }
}
//////////////update user by id //////
async updateUser(userId: string, userData: any, token:string):Promise<any>{
  const url = `${this.BASE_URL}/adminuser/update/${userId}`;
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  })
  try{
    const response =  this.http.put<any>(url, userData, {headers}).toPromise()
    return response;
  }catch(error){
    throw error;
  }
}
/***AUTHEMNTICATION METHODS */
logOut():void{
  if(typeof localStorage !== 'undefined'){
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
  }
}

isAuthenticated(): boolean {
  if(typeof localStorage !== 'undefined'){
    const token = localStorage.getItem('token');
    return !!token;
  }
  return false;

}

isAdmin(): boolean {
  if(typeof localStorage !== 'undefined'){
    const role = localStorage.getItem('role');
    return role === 'ADMIN'
  }
  return false;

}

isUser(): boolean {
  if(typeof localStorage !== 'undefined'){
    const role = localStorage.getItem('role');
    return role === 'USER'
  }
  return false;

}

isAgent(): boolean {
  if(typeof localStorage !== 'undefined'){
    const role = localStorage.getItem('role');
    return role === 'AGENT'
  }
  return false;

}

// Get the current user ID from localStorage
getCurrentUserId(): number | null {
  if(typeof localStorage !== 'undefined'){
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
  return null;
}

}