import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import * as faceapi from 'face-api.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-face-detection',
  templateUrl: './face-detection.component.html',
  styleUrls: ['./face-detection.component.css']
})
export class FaceDetectionComponent implements AfterViewInit,OnDestroy  {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  loadingModels = true;
  faceDetected = false;

  constructor(private router: Router) {}
  ngOnDestroy(): void {
    this.stopWebcam();
  }

  async ngAfterViewInit() {
   
    await this.loadModels();
    this.startWebcam();
  }
  navigateToSignup() {
    
    this.router.navigate(['/signup']);
    //localStorage.removeItem('faceVerified'); 
  }
  async loadModels() {
    this.loadingModels = true;
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
    ]);
    this.loadingModels = false;
  }

  startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoRef.nativeElement.srcObject = stream;
      this.detectLoop();
    });
  }

  async detectLoop() {
    const videoEl = this.videoRef.nativeElement;

    videoEl.onloadedmetadata = () => {
      setInterval(async () => {
        const result = await faceapi.detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions());

        if (result) {
          this.faceDetected = true;
          localStorage.setItem('faceVerified', 'true');
        } else {
          this.faceDetected = false;
        }
      }, 500);
    };
  }
  stopWebcam() {
    const video = this.videoRef.nativeElement;
    const stream = video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    video.srcObject = null;
  }
}
