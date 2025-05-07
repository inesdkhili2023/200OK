import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class FaceDetectionGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    
    const isFaceVerified = localStorage.getItem('faceVerified') === 'true';

    if (!isFaceVerified) {
      this.router.navigate(['/detect-face']); // Redirige toujours si non vérifié
      return false;
    }
    localStorage.removeItem('faceVerified');
   
    return true;
  }
}