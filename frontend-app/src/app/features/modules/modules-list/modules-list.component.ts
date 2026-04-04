import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModulesService } from '../services/modules.service';

@Component({
  selector: 'app-modules-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="modules-container animate-fade-in">
      <div style="margin-bottom: 1rem;">
        <button class="btn btn-ghost" routerLink="/dashboard" style="padding: 0; display: inline-flex; align-items: center; gap: 0.5rem;">
          ← Volver al Inicio
        </button>
      </div>
      <h2>Mi Ruta de Aprendizaje</h2>
      <p class="subtitle text-secondary">Avanza paso a paso en tu preparación PAES.</p>

      <div *ngIf="loading" class="loading-state">Cargando módulos...</div>

      <div *ngFor="let mod of modules" class="module-section">
        <div class="module-header">
          <h3>{{ mod.title }}</h3>
          <span class="badge">{{ mod.subject | uppercase }}</span>
        </div>

        <div class="topics-grid">
          <div *ngFor="let topic of mod.topics" 
              class="glass-card topic-card" 
              [class.locked]="topic.status === 'locked'"
              [class.completed]="topic.status === 'completed'">
              
            <div class="topic-header">
              <h4>{{ topic.title }}</h4>
              <span class="status-icon">
                <i *ngIf="topic.status === 'completed'">✅</i>
                <i *ngIf="topic.status === 'locked'">🔒</i>
                <i *ngIf="topic.status === 'available' || topic.status === 'in_progress'">🔥</i>
              </span>
            </div>
            
            <p>Dificultad: Nivel {{ topic.difficulty }} | {{ topic.estimatedMinutes }} mins</p>
            
            <div class="progress-bar-container mt-2">
              <div class="progress-bar" [style.width.%]="topic.masteryLevel"></div>
            </div>
            <p class="mastery-text">Dominio: {{ topic.masteryLevel }}%</p>

            <button *ngIf="topic.status !== 'locked'" 
                    [routerLink]="['/topic', mod.id, topic.id]"
                    class="btn btn-outline mt-4 w-full">
              {{ topic.status === 'completed' ? 'Repasar' : 'Estudiar' }}
            </button>
            <button *ngIf="topic.status === 'locked'" class="btn btn-disabled mt-4 w-full" disabled>
              Bloqueado
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Contenedor principal con fondo completo */
    :host {
      display: block;
      min-height: 100vh;
      background: #000000;
      color: #ffffff;
    }
    
    .modules-container { 
      padding: 2rem; 
      max-width: 1200px; 
      margin: 0 auto; 
      min-height: 100vh;
      color: #ffffff;
    }
    .modules-container h2 { 
      font-family: var(--font-heading); 
      font-size: 2rem; 
      font-weight: 700; 
      margin-bottom: 0.5rem; 
      color: #ffffff; 
    }
    .subtitle { 
      margin-bottom: 3rem; 
      color: #9ca3af; 
    }
    .text-secondary {
      color: #9ca3af;
    }
    .module-section { margin-bottom: 4rem; }
<<<<<<< HEAD
    .module-header { 
      display: flex; 
      align-items: center; 
      gap: 1rem; 
      margin-bottom: 1.5rem; 
      border-bottom: 1px solid rgba(255,255,255,0.1); 
      padding-bottom: 1rem;
    }
    .module-header h3 {
      color: #ffffff;
      font-size: 1.5rem;
      margin: 0;
    }
    .badge { 
      background: rgba(133, 92, 214, 0.2); 
      color: #a78bfa; 
      padding: 0.3rem 0.9rem; 
      border-radius: 99px; 
      font-size: 0.8rem; 
      font-weight: bold;
    }
    .topics-grid { 
      display: grid; 
      gap: 1.5rem; 
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    }
    .glass-card {
      background: rgba(13, 15, 23, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      transition: all 0.3s ease;
    }
    .topic-card { 
      padding: 1.5rem; 
      position: relative; 
      overflow: hidden;
    }
    .topic-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(133, 92, 214, 0.2);
      border-color: rgba(133, 92, 214, 0.3);
    }
    .topic-card.locked { opacity: 0.5; filter: grayscale(1); }
    .topic-card.completed { border-color: rgba(16, 185, 129, 0.5); }
    .topic-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: start; 
      margin-bottom: 0.5rem; 
    }
    .topic-header h4 { 
      font-size: 1.2rem; 
      margin: 0; 
      color: #ffffff;
      font-weight: 600;
    }
    .topic-card p {
      color: #9ca3af;
      font-size: 0.9rem;
    }
=======
    .module-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;}
    .badge { background: rgba(99,102,241,0.2); color: #a855f7; padding: 0.2rem 0.8rem; border-radius: 99px; font-size: 0.8rem; font-weight: bold;}
    .topics-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
    .topic-card { padding: 1.5rem; position: relative; overflow: hidden; }
    .topic-card.locked { opacity: 0.75; filter: grayscale(0.5); }
    .topic-card.completed { border-color: rgba(39, 201, 63, 0.4); }
    .topic-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem; }
    .topic-header h4 { font-size: 1.2rem; margin: 0; }
>>>>>>> master
    .status-icon { font-size: 1.2rem; }
    .progress-bar-container { 
      width: 100%; 
      height: 6px; 
      background: rgba(255,255,255,0.1); 
      border-radius: 3px; 
      overflow: hidden; 
    }
    .progress-bar { 
      height: 100%; 
      background: linear-gradient(90deg, #855cd6, #a78bfa); 
      width: 0%; 
      transition: width 0.5s ease; 
    }
    .mastery-text { 
      font-size: 0.85rem; 
      color: #9ca3af; 
      margin-top: 0.5rem; 
    }
    .btn {
      padding: 0.7rem 1.2rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid rgba(133, 92, 214, 0.5);
      color: #a78bfa;
    }
    .btn-outline:hover {
      background: rgba(133, 92, 214, 0.1);
      border-color: #855cd6;
    }
    .btn-disabled { 
      background: rgba(255,255,255,0.05); 
      color: #666; 
      cursor: not-allowed; 
      border: 1px solid rgba(255,255,255,0.05); 
    }
    .btn-ghost {
      background: transparent;
      color: #9ca3af;
      border: none;
      padding: 0.5rem;
    }
    .btn-ghost:hover {
      color: #ffffff;
    }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .w-full { width: 100%; }
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #9ca3af;
      font-size: 1.1rem;
    }
  `]
})
export class ModulesListComponent implements OnInit {
  modulesService = inject(ModulesService);
  modules: any[] = [];
  loading = true;

  ngOnInit() {
    this.modulesService.getLearningPath().subscribe({
      next: (res) => {
        this.modules = res;
        this.loading = false;
      },
      error: () => {
        this.modules = [];
        this.loading = false;
      }
    });
  }
}
