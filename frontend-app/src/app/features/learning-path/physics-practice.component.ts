import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-physics-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
      <h3 style="color: #00e5ff; margin-bottom: 0.5rem;">Simulador de Física Activo</h3>
      <p style="color: #fff; font-size: 0.9rem; margin-bottom: 1rem;">
        Esta es una práctica interactiva de física. Completar la simulación para continuar.
      </p>
      <button 
        (click)="onComplete.emit()" 
        style="padding: 0.75rem 1.5rem; background: #00ff66; border: none; border-radius: 8px; color: #000; font-weight: bold; cursor: pointer; transition: transform 0.2s;"
        onmouseover="this.style.transform='scale(1.05)'"
        onmouseout="this.style.transform='scale(1)'"
      >
        Simular Completado ✓
      </button>
    </div>
  `
})
export class PhysicsPracticeComponent {
  @Input() gameData: any;
  @Output() onComplete = new EventEmitter<void>();
}
