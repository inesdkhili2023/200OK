import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-attentance',
  templateUrl: './login-attentance.component.html',
  styleUrls: ['./login-attentance.component.css']
})
export class LoginAttentanceComponent implements AfterViewInit, OnDestroy {

  @ViewChild('video') videoRef!: ElementRef;
  @ViewChild('canvas') canvasRef!: ElementRef;

  private videoStream: MediaStream | null = null;
  loginMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngAfterViewInit() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoStream = stream;
      this.videoRef.nativeElement.srcObject = stream;
    });
  }
  
  ngOnDestroy() {
    // Fermer la caméra quand le composant est détruit
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
  }

  captureAndLogin() {
    const video: HTMLVideoElement = this.videoRef.nativeElement;
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d')!;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');

    this.http.post<any>('http://localhost:1010/auth/face-login', { image: imageData })
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          this.loginMessage = res.message;

          if (res.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error("Face login failed", err);
          this.loginMessage = "Login échoué : " + err.error?.message || err.message;
        }
      });
  }
}
