import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  tempWords: string = '';
  text: string = '';
  isListening = false;

  private transcript = new BehaviorSubject<string>('');
  public transcript$ = this.transcript.asObservable();
  constructor() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  init() {
    this.recognition.addEventListener('result', (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      this.tempWords = transcript;
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log('Speech recognition started');

    this.recognition.addEventListener('end', () => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log('End speech recognition');
      } else {
        this.wordConcat();
        this.recognition.start();
      }
    });
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();
    console.log('End speech recognition');
  }

  wordConcat() {
    if (this.tempWords.trim()) {
      this.text = `${this.text} ${this.tempWords}`.trim();
      this.transcript.next(this.text); // Ajoute ça pour mettre à jour le flux observable
      this.tempWords = '';
    }
  }
  
  
}
