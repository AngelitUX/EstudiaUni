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
        <button class="btn btn-outline mb-4" (click)="goBack()">← Volver a Módulos</button>
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
    .topic-detail-container { padding: 2rem; max-width: 900px; margin: auto; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .badges { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
    .badge { background: rgba(99,102,241,0.2); color: #a855f7; padding: 0.3rem 1rem; border-radius: 99px; font-weight: 500;}
    .status-badge { background: rgba(39, 201, 63, 0.2); color: #27c93f; }
    .content-section { margin-top: 2rem; }
    .summary { font-size: 1.1rem; color: #cbd5e1; margin-bottom: 2rem; }
    .markdown-body { font-size: 1.05rem; line-height: 1.7; color: #f8fafc; }
    
    ::ng-deep .markdown-body h1, 
    ::ng-deep .markdown-body h2, 
    ::ng-deep .markdown-body h3 {
      font-family: var(--font-heading);
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      color: #fff;
    }
    ::ng-deep .markdown-body p { margin-bottom: 1.2rem; }
    ::ng-deep .markdown-body code { background: rgba(0,0,0,0.3); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; color: #fdfba8;}
    
    .examples { margin-top: 2rem; background: rgba(99,102,241,0.05); padding: 1.5rem; border-radius: 12px; border: 1px dashed rgba(99,102,241,0.3); }
    .examples li { margin-bottom: 0.5rem; }
    .text-center { text-align: center; }
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
