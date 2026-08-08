import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-true-false-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="true-false-wrapper" *ngIf="items.length > 0">
      <div class="header-area">
        <div class="progress-bar-container">
          <div class="progress-track">
            <div class="progress-fill" [style.width]="((currentIndex) / items.length) * 100 + '%'">
               <div class="progress-glow"></div>
            </div>
          </div>
        </div>
        <div class="score-badge">
          ⭐ {{score}} / {{items.length}}
        </div>
      </div>

      <div class="game-area" *ngIf="currentIndex < items.length">
        <div class="statement-card" [class.slide-out]="slidingOut" [class.slide-in]="slidingIn">
          <div class="card-icon" *ngIf="!items[currentIndex].svgContent">🤔</div>
          <div class="svg-container" *ngIf="items[currentIndex].svgContent" [innerHTML]="renderSvg(items[currentIndex].svgContent)"></div>
          <p class="statement-text">{{ items[currentIndex].statement }}</p>
        </div>
        
        <div class="action-buttons" *ngIf="!showFeedback && !slidingOut">
          <button class="btn-tf btn-true" (click)="answer(true)">
            <span class="btn-icon">👍</span>
            <span class="btn-label">Verdadero</span>
          </button>
          <button class="btn-tf btn-false" (click)="answer(false)">
            <span class="btn-icon">👎</span>
            <span class="btn-label">Falso</span>
          </button>
        </div>
      </div>

      <div class="feedback-panel" *ngIf="showFeedback" [class.correct]="lastAnswerCorrect" [class.incorrect]="!lastAnswerCorrect">
        <div class="feedback-content">
          <div class="feedback-icon">{{ lastAnswerCorrect ? '🎉' : '💔' }}</div>
          <div class="feedback-text">
            <h3 class="feedback-title">{{ lastAnswerCorrect ? '¡Excelente!' : 'Casi...' }}</h3>
            <p class="feedback-message">{{ items[currentIndex].feedback }}</p>
          </div>
        </div>
        <button class="btn-next-action" (click)="next()">CONTINUAR</button>
      </div>
      
      <div class="completion-state" *ngIf="currentIndex >= items.length">
        <div class="completion-icon">🏆</div>
        <h3 class="completion-title">¡Desafío Completado!</h3>
        <p class="completion-score">Acertaste {{score}} de {{items.length}}</p>
        <div class="completion-bar">
          <div class="completion-fill" [style.width]="(score / items.length) * 100 + '%'"></div>
        </div>
        <button class="btn-finish-action" (click)="finish()">CONTINUAR RUTA</button>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');

    .true-false-wrapper {
      max-width: 650px;
      margin: 0 auto;
      padding: 1rem;
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
      min-height: 480px;
      display: flex;
      flex-direction: column;
    }
    /* Header */
    .header-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .progress-bar-container {
      flex: 1;
    }
    .progress-track {
      height: 12px;
      background: #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
      border-radius: 10px;
      transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .progress-glow {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: shimmer 2s infinite;
    }
    .score-badge {
      background: white;
      padding: 0.5rem 1.2rem;
      border-radius: 20px;
      font-weight: 800;
      color: #2d3748;
      border: 1px solid #e2e8f0;
      font-size: 1.1rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }

    /* Card */
    .game-area {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      flex: 1;
    }
    .statement-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      padding: 3rem 2rem;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    }
    .statement-card.slide-out {
      transform: translateX(-100px) scale(0.95);
      opacity: 0;
    }
    .statement-card.slide-in {
      animation: slideInRight 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    .card-icon {
      font-size: 4rem;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
      animation: float 3s ease-in-out infinite;
    }
    .statement-text {
      font-size: 1.4rem;
      line-height: 1.6;
      color: #2d3748;
      font-weight: 500;
      margin: 0;
    }

    /* Buttons */
    .action-buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      animation: fadeIn 0.3s ease forwards;
    }
    .btn-tf {
      flex: 1;
      max-width: 220px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      padding: 1.5rem 1rem;
      border-radius: 20px;
      border: 2px solid transparent;
      cursor: pointer;
      background: white;
      color: #4a5568;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 6px 12px rgba(0,0,0,0.05);
    }
    .btn-tf:hover {
      transform: translateY(-5px);
    }
    .btn-tf:active {
      transform: translateY(2px);
    }
    .btn-true {
      border-color: rgba(46, 204, 113, 0.4);
    }
    .btn-true:hover {
      background: rgba(46, 204, 113, 0.2);
      border-color: #2ecc71;
      box-shadow: 0 10px 25px rgba(46, 204, 113, 0.3);
    }
    .btn-false {
      border-color: rgba(231, 76, 60, 0.4);
    }
    .btn-false:hover {
      background: rgba(231, 76, 60, 0.2);
      border-color: #e74c3c;
      box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
    }
    .btn-icon {
      font-size: 2.8rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    .btn-label {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    /* Feedback Panel (Duolingo style bottom slide) */
    .feedback-panel {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 2.5rem 2rem 2rem 2rem;
      border-radius: 24px 24px 0 0;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      z-index: 10;
      box-shadow: 0 -10px 30px rgba(0,0,0,0.3);
    }
    .feedback-panel.correct {
      background: linear-gradient(135deg, #2ecc71, #27ae60);
      color: white;
    }
    .feedback-panel.incorrect {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white;
    }
    .feedback-content {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
    }
    .feedback-icon {
      font-size: 3.5rem;
      background: rgba(255,255,255,0.2);
      width: 80px; height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    .feedback-text {
      flex: 1;
    }
    .feedback-title {
      font-size: 1.8rem;
      margin: 0 0 0.5rem 0;
      font-weight: 800;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .feedback-message {
      font-size: 1.15rem;
      line-height: 1.5;
      margin: 0;
      opacity: 0.95;
      font-weight: 500;
    }
    .btn-next-action {
      width: 100%;
      padding: 1.2rem;
      border: none;
      border-radius: 16px;
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      background: white;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-next-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.2);
    }
    .btn-next-action:active {
      transform: translateY(1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .feedback-panel.correct .btn-next-action {
      color: #27ae60;
    }
    .feedback-panel.incorrect .btn-next-action {
      color: #c0392b;
    }

    /* Completion */
    .completion-state {
      text-align: center;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      padding: 4rem 2rem;
      animation: fadeIn 0.5s ease;
      margin-top: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }
    .completion-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
      animation: bounce 2s infinite;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
    }
    .completion-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #2b6cb0;
      margin-bottom: 1rem;
    }
    .completion-score {
      font-size: 1.4rem;
      color: #4a5568;
      margin-bottom: 2.5rem;
      font-weight: 500;
    }
    .completion-bar {
      height: 10px;
      background: #e2e8f0;
      border-radius: 5px;
      margin: 0 auto 3rem auto;
      max-width: 300px;
      overflow: hidden;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
    }
    .completion-fill {
      height: 100%;
      background: #2ecc71;
      border-radius: 5px;
    }
    .btn-finish-action {
      background: linear-gradient(135deg, #4facfe, #00f2fe);
      color: white;
      border: none;
      padding: 1.2rem 3rem;
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: 1px;
      border-radius: 100px;
      cursor: pointer;
      box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-finish-action:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 25px rgba(79, 172, 254, 0.4);
    }
    .btn-finish-action:active {
      transform: translateY(1px);
    }

    /* Keyframes */
    @keyframes slideInRight {
      0% { transform: translateX(100px) scale(0.95); opacity: 0; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }
    @keyframes slideUp {
      0% { transform: translateY(100%); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    @keyframes fadeIn {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1); }
    }
  `]
})
export class TrueFalsePracticeComponent implements OnInit {
  @Input() practiceData: any;
  @Output() completed = new EventEmitter<boolean>();

  items: any[] = [];
  currentIndex: number = 0;
  score: number = 0;
  
  showFeedback: boolean = false;
  lastAnswerCorrect: boolean = false;
  
  slidingOut: boolean = false;
  slidingIn: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  renderSvg(svgString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }

  ngOnInit() {
    if (this.practiceData && this.practiceData.items) {
      // shuffle items
      this.items = [...this.practiceData.items].sort(() => Math.random() - 0.5);
    }
  }

  answer(value: boolean) {
    const currentItem = this.items[this.currentIndex];
    this.lastAnswerCorrect = (value === currentItem.isTrue);
    if (this.lastAnswerCorrect) {
      this.score++;
    }
    this.showFeedback = true;
  }

  next() {
    this.showFeedback = false;
    this.slidingOut = true;
    
    // Wait for the slide-out animation to finish before updating index
    setTimeout(() => {
      this.currentIndex++;
      this.slidingOut = false;
      this.slidingIn = true;
      
      // Remove slide-in class after animation completes so it doesn't re-trigger
      setTimeout(() => {
        this.slidingIn = false;
      }, 400); 
    }, 300);
  }

  finish() {
    // If they got more than 60%, they pass
    const passed = (this.score / this.items.length) >= 0.6;
    this.completed.emit(passed);
  }
}
