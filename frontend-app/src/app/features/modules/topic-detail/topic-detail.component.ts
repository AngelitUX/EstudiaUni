import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService } from '../services/modules.service';
import { QuizService } from '../services/quiz.service';
import { ToastService } from '../../../core/services/toast.service';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-topic-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="topic-detail-container animate-fade-in" *ngIf="topic">
      <header class="topic-header">
        <button class="btn-back mb-4" (click)="goBack()">← Volver</button>
        <h2>{{ topic.title }}</h2>
        <div class="badges">
          <span class="badge">Nivel {{ topic.difficultyLevel }}</span>
          <span class="badge">{{ topic.estimatedMinutes }} minutos</span>
          <span class="badge status-badge" *ngIf="progress">Dominio: {{ progress.masteryLevel || 0 }}%</span>
        </div>
      </header>

      <section class="content-section glass-card">
        <h3>Conceptos Clave</h3>
        <p class="summary">{{ topic.content?.summary }}</p>
        
        <div class="markdown-body" [innerHTML]="parsedMarkdown"></div>
        
        <div class="examples" *ngIf="topic.content?.examples?.length > 0">
          <h4>Ejemplos:</h4>
          <ul>
            <li *ngFor="let ex of topic.content.examples">{{ ex }}</li>
          </ul>
        </div>
      </section>

      <section class="action-section mt-4 glass-card text-center">
        <h3>¿Listo para probar tu conocimiento?</h3>
        <p class="text-secondary mb-4">Genera un Mini-Quiz adaptativo con inteligencia artificial para evaluar este tema.</p>
        <button class="btn btn-primary" (click)="startQuiz()" [disabled]="startingQuiz">
          {{ startingQuiz ? 'Generando...' : 'Tomar Quiz (5 Pts)' }}
        </button>
      </section>
    </div>
    
    <div *ngIf="loading" class="topic-detail-container loading-state">
      Cargando contenido...
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
    
    .topic-detail-container { 
      padding: 2rem; 
      max-width: 900px; 
      margin: 0 auto;
      min-height: 100vh;
      color: #ffffff;
    }
    .topic-header h2 {
      font-family: var(--font-heading);
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .mb-4 { margin-bottom: 1.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mt-4 { margin-top: 2rem; }
    .badges { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
    .badge { 
      background: rgba(133, 92, 214, 0.2); 
      color: #a78bfa; 
      padding: 0.4rem 1rem; 
      border-radius: 99px; 
      font-weight: 600;
      font-size: 0.9rem;
    }
    .status-badge { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .btn-back {
      background: none;
      border: none;
      color: var(--accent-primary);
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0;
    }
    .btn-back:hover {
      color: #fff;
      transform: translateX(-4px);
    }
    
    .btn {
      padding: 0.7rem 1.2rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
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
    .btn-primary {
      background: linear-gradient(135deg, #855cd6, #6b46b8);
      color: #ffffff;
    }
    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(133, 92, 214, 0.3);
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .glass-card {
      background: rgba(13, 15, 23, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
    }
    .content-section { margin-top: 2rem; }
    .content-section h3 {
      color: #ffffff;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .summary { font-size: 1.1rem; color: #d1d5db; margin-bottom: 2rem; line-height: 1.6; }
    .markdown-body { font-size: 1.05rem; line-height: 1.7; color: #e5e7eb; }
    
    ::ng-deep .markdown-body h1, 
    ::ng-deep .markdown-body h2, 
    ::ng-deep .markdown-body h3,
    ::ng-deep .markdown-body h4 {
      font-family: var(--font-heading);
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      color: #ffffff;
    }
    ::ng-deep .markdown-body p { margin-bottom: 1.2rem; color: #e5e7eb; }
    ::ng-deep .markdown-body code { 
      background: rgba(133, 92, 214, 0.2); 
      padding: 0.2rem 0.5rem; 
      border-radius: 6px; 
      font-family: monospace; 
      color: #c4b5fd;
      font-size: 0.95em;
    }
    ::ng-deep .markdown-body ul,
    ::ng-deep .markdown-body ol {
      color: #e5e7eb;
      margin-bottom: 1.2rem;
    }
    
    .examples { 
      margin-top: 2rem; 
      background: rgba(133, 92, 214, 0.1); 
      padding: 1.5rem; 
      border-radius: 12px; 
      border: 1px solid rgba(133, 92, 214, 0.3); 
    }
    .examples h4 {
      color: #a78bfa;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }
    .examples li { 
      margin-bottom: 0.5rem; 
      color: #e5e7eb;
    }
    .action-section {
      background: rgba(13, 15, 23, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2.5rem;
    }
    .action-section h3 {
      color: #ffffff;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .text-secondary {
      color: #9ca3af;
    }
    .text-center { text-align: center; }
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #9ca3af;
      font-size: 1.1rem;
    }
  `]
})
export class TopicDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  modulesService = inject(ModulesService);
  quizService = inject(QuizService);
  sanitizer = inject(DomSanitizer);
  toast = inject(ToastService);

  topic: any = null;
  progress: any = null;
  loading = true;
  startingQuiz = false;
  parsedMarkdown: SafeHtml = '';

  moduleId = '';
  topicId = '';

  ngOnInit() {
    this.moduleId = this.route.snapshot.paramMap.get('moduleId') || '';
    this.topicId = this.route.snapshot.paramMap.get('topicId') || '';

    if (this.moduleId && this.topicId) {
      this.modulesService.getTopic(this.moduleId, this.topicId).subscribe({
        next: async (res) => {
          if (!res) {
            this.loading = false;
            return;
          }
          // El servicio ahora devuelve el topic directamente
          this.topic = res;
          this.progress = res.masteryLevel || 0;
          
          if (this.topic?.content?.keyConceptsMarkdown) {
            const rawHtml = await marked.parse(this.topic.content.keyConceptsMarkdown);
            this.parsedMarkdown = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching topic', err);
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/modules']);
  }

  startQuiz() {
    this.startingQuiz = true;
    this.quizService.generateQuiz(this.topicId, 5).subscribe({
      next: (res) => {
        this.router.navigate(['/simulation', res.attemptId]);
      },
      error: (err) => {
        const message = err.error?.message || 'Error al iniciar quiz. Por favor intenta nuevamente.';
        this.toast.error(message);
        this.startingQuiz = false;
      }
    });
  }
}
