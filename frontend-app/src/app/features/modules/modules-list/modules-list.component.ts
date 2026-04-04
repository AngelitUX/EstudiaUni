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
        <button class="btn btn-ghost" routerLink="/dashboard" style="padding: 0; display: inline-flex; align-items: center; gap: 0.5rem; color: #9da0a7; background: transparent; border: none; cursor: pointer;">
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
    .modules-container { padding: 2rem; max-width: 1200px; margin: auto; }
    .subtitle { margin-bottom: 3rem; }
    .module-section { margin-bottom: 4rem; }
    .module-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;}
    .badge { background: rgba(99,102,241,0.2); color: #a855f7; padding: 0.2rem 0.8rem; border-radius: 99px; font-size: 0.8rem; font-weight: bold;}
    .topics-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
    .topic-card { padding: 1.5rem; position: relative; overflow: hidden; }
    .topic-card.locked { opacity: 0.75; filter: grayscale(0.5); }
    .topic-card.completed { border-color: rgba(39, 201, 63, 0.4); }
    .topic-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem; }
    .topic-header h4 { font-size: 1.2rem; margin: 0; }
    .status-icon { font-size: 1.2rem; }
    .progress-bar-container { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
    .progress-bar { height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); width: 0%; transition: width 0.5s ease; }
    .mastery-text { font-size: 0.85rem; color: #9da0a7; margin-top: 0.5rem; }
    .btn-disabled { background: rgba(255,255,255,0.05); color: #666; cursor: not-allowed; border: 1px solid rgba(255,255,255,0.05); }
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
