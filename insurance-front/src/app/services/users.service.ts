import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  changeData(msg: any) {
    throw new Error('Method not implemented.');
  }

  private BASE_URL="http://localhost:1010/user-service";
  public isAuthenticated$ = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isUser$ = new BehaviorSubject<boolean>(this.isUser());
  public isAdmin$ = new BehaviorSubject<boolean>(this.isAdmin());
  public isAgent$ = new BehaviorSubject<boolean>(this.isAgent());
  public currentUser$ = new BehaviorSubject<any>(null);
  currentUserData: any;
  private currentUserSubject = new BehaviorSubject<any>(null);
  constructor(private http:HttpClient  ) { }
// Méthode pour récupérer l'utilisateur connecté
getCurrentUser(): any {
  
  return this.currentUserSubject.value;
  // Retourne l'utilisateur actuel
}

// Méthode pour définir l'utilisateur connecté
setCurrentUser(user: any): void {
  this.currentUserSubject.next(user);
  this.currentUser$.next(user);
  this.isAuthenticated$.next(true);
 // Met à jour l'utilisateur actuel
}
initializeAuthStatus(): void {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  this.isAuthenticated$.next(!!token);
  this.isUser$.next(role === 'USER');
  this.isAdmin$.next(role === 'ADMIN');
  this.isAgent$.next(role === 'AGENT');
}
  ///////////login////////
  async login(email:string,password:string):Promise<any>{
    const url=`${this.BASE_URL}/auth/login`
    try{
      const response=await this.http.post<any>(url,{email,password}).toPromise()
      this.setCurrentUser(response.user);
      this.isAuthenticated$.next(true);
      console.log(response.user);
      return response;
    }catch(error){
      throw error;
    }
    
  }

  ////////login google ///////
  

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
    const url = `${this.BASE_URL}/auth/signupface`
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
    const url = `${this.BASE_URL}/allRole/get-users/${userId}`;
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
  const url = `${this.BASE_URL}/allRole/update/${userId}`;
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
  }
  this.isAuthenticated$.next(false);
}
/////////////send email reset mdp///////////
async sendResetEmail(email: string): Promise<any> {
  const url = `${this.BASE_URL}/auth/forgot-password`;

  try{
    const response = this.http.post<any>(url, { email }).toPromise();
    return response;
}catch(error){
  throw error;
}
}

// Réinitialiser le mot de passe
async resetPassword(token: string, newPassword: string): Promise<any> {
  const url = `${this.BASE_URL}/auth/reset-password`;
  try{
  return this.http.post<any>(url, { token, newPassword }).toPromise();
}catch(error){
  throw error;
}
}
////////confirmed token ////
confirmEmail(token: string): Observable<any> {
  return this.http.post<any>(`${this.BASE_URL}/auth/signup/confirmemail`, { token });
}
////////////block user///////
blockUser(userId: string, token: string): Promise<any> {
  const url = `${this.BASE_URL}/admin/block/${userId}`;
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Correction : Passer les headers dans les options de la requête
  return this.http.post<any>(url, {}, { headers }).toPromise()
    .catch(error => {
      throw error;
    });
}
//////////deblocker//////
deblockUser(userId: string, token: string): Promise<any> {
  const url = `${this.BASE_URL}/admin/deblock/${userId}`;
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Correction : Passer les headers dans les options de la requête
  return this.http.post<any>(url, {}, { headers }).toPromise()
    .catch(error => {
      throw error;
    });
}


//login with google et github
/*loginWithGoogle() {
  window.location.href = `${this.BASE_URL}/oauth2/authorization/google`;
}

loginWithGithub() {
  window.location.href = `${this.BASE_URL}/oauth2/authorization/github`;
}*/
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

}
