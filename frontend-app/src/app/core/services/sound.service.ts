import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private correctSound = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3'); // Reliable short digital beep
  private wrongSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');   // Dull error thud
  private toggleSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // Light click

  constructor() {
    // Preload sounds
    this.correctSound.load();
    this.wrongSound.load();
    this.toggleSound.load();
    
    // Lower volume a bit
    this.correctSound.volume = 0.6;
    this.wrongSound.volume = 0.4;
    this.toggleSound.volume = 0.3;
  }

  playCorrect() {
    this.correctSound.currentTime = 0;
    this.correctSound.play().catch(() => {});
  }

  playWrong() {
    this.wrongSound.currentTime = 0;
    this.wrongSound.play().catch(() => {});
  }

  playToggle() {
    this.toggleSound.currentTime = 0;
    this.toggleSound.play().catch(() => {});
  }
}
