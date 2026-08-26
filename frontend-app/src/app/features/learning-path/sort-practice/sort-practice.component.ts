import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sort-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sort-wrapper" *ngIf="items.length > 0">
      <div class="header-area">
        <div class="instruction-badge">🧩 {{ instruction }}</div>
      </div>
      
      <div class="list-area">
        <div class="list-item" *ngFor="let item of items; let i = index" 
             [style.animationDelay]="(i * 0.1) + 's'"
             [class.correct-anim]="isCorrect">
          <div class="item-number">{{ i + 1 }}</div>
          <div class="item-content">
            {{ item.text }}
          </div>
          <div class="controls" *ngIf="!isCorrect">
            <button class="btn-ctrl btn-up" (click)="moveUp(i)" [disabled]="i === 0" title="Mover arriba">
              <span class="ctrl-icon">⬆️</span>
            </button>
            <button class="btn-ctrl btn-down" (click)="moveDown(i)" [disabled]="i === items.length - 1" title="Mover abajo">
              <span class="ctrl-icon">⬇️</span>
            </button>
          </div>
          <div class="controls-locked" *ngIf="isCorrect">
             <span class="locked-icon">🔒</span>
          </div>
        </div>
      </div>

      <div class="action-area" *ngIf="!showFeedback || !isCorrect">
        <button class="btn-main-action" (click)="checkOrder()">COMPROBAR ORDEN</button>
      </div>
      
      <div class="feedback-panel" *ngIf="showFeedback" [class.correct]="isCorrect" [class.incorrect]="!isCorrect">
        <div class="feedback-content">
          <div class="feedback-icon">{{ isCorrect ? '🎉' : '🤔' }}</div>
          <div class="feedback-text">
            <h3 class="feedback-title">{{ isCorrect ? '¡Excelente!' : 'Casi...' }}</h3>
            <p class="feedback-message">{{ isCorrect ? 'El orden es completamente correcto.' : 'El orden aún no es el correcto. ¡Sigue intentando!' }}</p>
          </div>
        </div>
        <button class="btn-next-action" *ngIf="isCorrect" (click)="finish()">CONTINUAR RUTA</button>
      </div>
    </div>
  `,
  styles: [`
    /* Inter ya viene self-hosteada desde styles.css (global). Antes habia un
       @import a fonts.googleapis.com aqui, que disparaba una peticion a un
       tercer origen al montar este componente. */

    .sort-wrapper {
      max-width: 650px;
      margin: 0 auto;
      padding: 1.5rem;
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
      min-height: 500px;
      display: flex;
      flex-direction: column;
    }
    .header-area {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }
    .instruction-badge {
      background: white;
      padding: 0.8rem 1.5rem;
      border-radius: 20px;
      font-weight: 800;
      color: #2d3748;
      border: 1px solid #e2e8f0;
      font-size: 1.15rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      animation: slideDown 0.4s ease;
    }
    .list-area {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      flex: 1;
      padding-bottom: 3rem;
    }
    .list-item {
      display: flex;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.2rem;
      align-items: center;
      gap: 1.2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
      animation: slideInRight 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
    }
    .list-item:hover {
      transform: translateX(5px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.08);
      border-color: #cbd5e0;
    }
    .list-item.correct-anim {
      border-color: #2ecc71;
      background: #f0fdf4;
    }
    .item-number {
      background: #edf2f7;
      color: #4a5568;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    .item-content {
      flex: 1;
      font-size: 1.15rem;
      color: #2d3748;
      font-weight: 600;
      line-height: 1.5;
    }
    .controls {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .btn-ctrl {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      color: #4a5568;
      border-radius: 8px;
      width: 40px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ctrl:hover:not(:disabled) {
      background: #ebf8ff;
      border-color: #90cdf4;
      transform: scale(1.1);
    }
    .btn-ctrl:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      background: #edf2f7;
    }
    .ctrl-icon {
      font-size: 1.1rem;
    }
    .controls-locked {
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .locked-icon {
      font-size: 1.5rem;
      opacity: 0.8;
    }

    .action-area {
      text-align: center;
      margin-top: 1rem;
      padding-bottom: 2rem;
    }
    .btn-main-action {
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
    .btn-main-action:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 25px rgba(79, 172, 254, 0.4);
    }
    .btn-main-action:active {
      transform: translateY(1px);
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
      box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
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

    @keyframes slideInRight {
      0% { transform: translateX(50px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideUp {
      0% { transform: translateY(100%); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
      0% { transform: translateY(-50px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class SortPracticeComponent implements OnInit {
  @Input() practiceData: any;
  @Output() completed = new EventEmitter<boolean>();

  instruction: string = 'Ordena los siguientes elementos correctamente:';
  items: any[] = [];
  
  showFeedback: boolean = false;
  isCorrect: boolean = false;

  ngOnInit() {
    if (this.practiceData) {
      if (this.practiceData.instruction) {
        this.instruction = this.practiceData.instruction;
      } else if (this.practiceData.title) {
         this.instruction = this.practiceData.title;
      }
      
      if (this.practiceData.items) {
        // Deep copy the items
        let originalItems = JSON.parse(JSON.stringify(this.practiceData.items));
        // We assume practiceData.items is sorted in the correct expected order.
        // We will assign expectedIndex to each.
        originalItems.forEach((item: any, idx: number) => {
          item.expectedIndex = idx;
        });
        
        // Shuffle for the initial state
        this.items = originalItems.sort(() => Math.random() - 0.5);
        // Make sure it's not accidentally correct initially
        while(this.checkIfCorrect(this.items) && this.items.length > 1) {
           this.items = originalItems.sort(() => Math.random() - 0.5);
        }
      }
    }
  }

  moveUp(index: number) {
    if (index > 0) {
      const temp = this.items[index - 1];
      this.items[index - 1] = this.items[index];
      this.items[index] = temp;
      this.showFeedback = false;
    }
  }

  moveDown(index: number) {
    if (index < this.items.length - 1) {
      const temp = this.items[index + 1];
      this.items[index + 1] = this.items[index];
      this.items[index] = temp;
      this.showFeedback = false;
    }
  }
  
  checkIfCorrect(arr: any[]): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].expectedIndex !== i) return false;
    }
    return true;
  }

  checkOrder() {
    this.isCorrect = this.checkIfCorrect(this.items);
    this.showFeedback = true;
  }

  finish() {
    this.completed.emit(true);
  }
}