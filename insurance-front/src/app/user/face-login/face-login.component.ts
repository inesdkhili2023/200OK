import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-face-login',
  template: `
    <h2>Face Login</h2>
    <video #video width="320" height="240" autoplay></video>
    <canvas #canvas width="320" height="240" style="display: none;"></canvas>
    <button (click)="capture()">Capture & Login</button>
    <p *ngIf="loginMessage">{{ loginMessage }}</p>
  `,
  styles: []
})
export class FaceLoginComponent implements OnInit {
  loginMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Ask for webcam access and display the video feed
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video: HTMLVideoElement = document.querySelector('video')!;
        video.srcObject = stream;
      })
      .catch(err => console.error('Error accessing webcam: ', err));
  }

  capture() {
    const video: HTMLVideoElement = document.querySelector('video')!;
    const canvas: HTMLCanvasElement = document.querySelector('canvas')!;
    const context = canvas.getContext('2d')!;
    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Convert the image to a Base64 string (data URL)
    const imageData = canvas.toDataURL('image/png');
    
    // POST the captured image to the Spring Boot backend
    this.http.post<any>('http://localhost:1010/auth/face-login', { image: imageData })
      .subscribe(
        response => this.loginMessage = response.message,
        error => this.loginMessage = 'Login failed: ' + error.error
      );
  }
}
