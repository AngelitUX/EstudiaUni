import { Component, inject, signal, computed, HostListener, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaesContentService, autoLoadTest } from './services/paes-content.service';
import { enforceLearningAccess } from './services/learning-access.service';
import { KatexService } from '../../core/services/katex.service';
import { GuideSlidesComponent } from './guide-slides.component';
import { GUIA_TIPOS_TEXTO_SLIDES, QUIZ_TIPOS_TEXTO } from './guide-slides-data';
import { SynonymPracticeComponent } from './synonym-practice.component';
import { MatchPracticeComponent } from './match-practice.component';
import { CategorizePracticeComponent } from './categorize-practice.component';
import { FillBlanksPracticeComponent } from './fill-blanks-practice.component';

@Component({
  selector: 'app-seccion-fisica-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    SynonymPracticeComponent, 
    MatchPracticeComponent, 
    CategorizePracticeComponent, 
    FillBlanksPracticeComponent,
    GuideSlidesComponent
  ],
  template: `
    <div class="sec-page" *ngIf="seccion() as sec">
      <!-- TOP NAV -->
      <div class="guide-nav-container">
        <button class="btn-back" (click)="goBack()">← Volver a la ruta</button>
        
        <div class="materia-progress-mini" *ngIf="materiaProgress() as progress">
          <span class="progress-pct">{{ progress.percentage }}% Completado</span>
          <div class="progress-bar-mini">
            <div class="progress-fill-mini" [style.width.%]="progress.percentage"></div>
          </div>
        </div>
      </div>
      <!-- BREADCRUMB -->
      <nav class="breadcrumb">
        <a routerLink="/dashboard">🏠</a>
        <span class="sep">›</span>
        <a [routerLink]="['/ruta', materiaId()]">{{ materia()?.title }}</a>
        <span class="sep">›</span>
        <span class="current">Capítulo {{ capOrder() }}</span>
      </nav>

      <!-- LESSON HEADER -->
      <div class="lesson-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <span class="lesson-badge">{{ capitulo()?.title }}</span>
          <h1>{{ sec.title }}</h1>
        </div>

        <!-- A11Y AUDIO PANEL (siempre visible, no desplegable) -->
        <div class="a11y-mini-panel-container" *ngIf="!isMathModule()">
          <span class="a11y-panel-label">🎧 Audio Descriptivo</span>
          <div class="a11y-mini-panel">
            <button class="a11y-shortcut" (click)="readGuide()">
              <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Leer Descripción
            </button>
            <button class="a11y-shortcut" *ngIf="sec.test?.contexto_base" (click)="readContext()">
              <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Leer Contexto
            </button>
            <button class="a11y-shortcut" *ngIf="sec.datos_claves?.length" (click)="readTips()">
              <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Leer Tips
            </button>
            <button class="a11y-shortcut a11y-shortcut-stop" (click)="stopReading()">
              <svg class="a11y-icon" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
              Detener
            </button>
          </div>
        </div>
      </div>

      <!-- PRACTICE MODE (Synonym Game etc.) -->


      <!-- MATCH PAIRS MODE -->
      <ng-container *ngIf="sec.isPractice && sec.practiceType === 'match-pairs'">
        <div class="content-card practice-card">
          <app-match-practice [data]="sec.practiceData" (onComplete)="completePractice()"></app-match-practice>
        </div>
      </ng-container>

      <!-- CATEGORIZE MODE -->
      <ng-container *ngIf="sec.isPractice && sec.practiceType === 'categorize'">
        <div class="content-card practice-card">
          <app-categorize-practice [data]="sec.practiceData" (onComplete)="completePractice()"></app-categorize-practice>
        </div>
      </ng-container>

      <!-- FILL IN THE BLANKS MODE -->
      <ng-container *ngIf="sec.isPractice && sec.practiceType === 'fill-blanks'">
        <div class="content-card practice-card">
          <app-fill-blanks-practice [data]="sec.practiceData" (onComplete)="completePractice()"></app-fill-blanks-practice>
        </div>
      </ng-container>

      <!-- SYNONYM MODE -->
      <ng-container *ngIf="sec.isPractice && sec.practiceType === 'synonyms'">
        <div class="content-card practice-card">
          <app-synonym-practice [data]="sec.practiceData" (onComplete)="completePractice()"></app-synonym-practice>
        </div>
      </ng-container>

      <!-- RAPID PRACTICE (Generic Practice Nodes) -->
      <ng-container *ngIf="sec.isPractice && (!sec.practiceType || sec.practiceType === 'rapid')">
        <div class="content-card generic-practice-card">
          <div class="practice-header-dynamic">
            <div class="practice-icon-pulse">⚡</div>
            <h2>¡Desafío Rápido!</h2>
            <p>{{ sec.title }}</p>
          </div>
          
          <div class="context-body mt-2" *ngIf="sec.test?.contexto_base && materiaId() !== 'historia' && materiaId() !== 'ciencias-biologia'">
            <div class="context-body-header">
              <span class="card-icon">📄</span> <b>Texto de Análisis</b>
            </div>
            <p *ngFor="let p of getFormattedParagraphs(sec.test?.contexto_base || '')">
              <span class="p-num" *ngIf="!p.isTitle">[{{ p.number }}]</span>
              <span class="p-text" [class.p-title]="p.isTitle">{{ p.text }}</span>
            </p>
          </div>

          <div class="cta-section">
            <div class="cta-card practice-cta">
              <h3>Modo Ráfaga Activado</h3>
              <p>Pon a prueba tus reflejos mentales con {{ sec.test?.preguntas?.length || 0 }} pregunta(s) directa(s).</p>
              <button class="btn-start-test btn-practice-go" (click)="goToTest()">¡Empezar Práctica! ➔</button>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- SLIDE GUIDE -->
      <ng-container *ngIf="sec.isSlideGuide">
        <app-guide-slides 
          [slides]="getSlidesForGuide(sec.id)" 
          [quizzes]="getQuizzesForGuide(sec.id)" 
          (onFinish)="completePractice()">
        </app-guide-slides>
      </ng-container>

      <!-- NORMAL SECTION CONTENT -->
      <ng-container *ngIf="!sec.isPractice && !sec.isSlideGuide && !sec.isProTip">
      <!-- MINI GUÍA -->
      <div class="content-card guide-card">
        <div class="card-header">
          <span class="card-icon">🧠</span>
          <h3>{{ sec.guia_titulo || '¿Qué aprenderás?' }}</h3>
        </div>
        <div class="guide-body" [innerHTML]="parseMixed(sec.guia_contenido || sec.introduccion)"></div>
        <div class="sec-image-wrap-large" *ngIf="sec.imageUrl">
          <img [src]="sec.imageUrl" alt="Imagen {{ sec.title }}" class="sec-image-large">
        </div>
        <div class="sec-svg-wrap-large" *ngIf="sec.svgContent">
          <div class="sec-svg-container" [innerHTML]="renderSvg(sec.svgContent)"></div>
        </div>
      </div>

      <!-- TIPS CLAVE -->
      <div class="content-card tips-card" *ngIf="sec.datos_claves?.length">
        <div class="card-header">
          <span class="card-icon">🔑</span>
          <h3>Conceptos clave</h3>
        </div>
        <div class="tips-list">
          <div *ngFor="let dato of sec.datos_claves; let i = index" class="tip-item">
            <div class="tip-num" [style.background]="tipColors[i % tipColors.length]">{{ i + 1 }}</div>
            <p [innerHTML]="parseMixed(dato)"></p>
          </div>
        </div>
      </div>

      <!-- TEXTO BASE / EJEMPLO RESUELTO -->
      <div class="content-card context-card" *ngIf="sec.test?.contexto_base && materiaId() !== 'historia'">
        <div class="card-header">
          <span class="card-icon" *ngIf="isScienceOrMath()">📝</span>
          <span class="card-icon" *ngIf="!isScienceOrMath()">📄</span>
          <h3>{{ isScienceOrMath() ? 'Ejemplo Resuelto' : 'Texto de práctica' }}</h3>
          <span class="pregunta-count" *ngIf="!isScienceOrMath()">{{ sec.test?.preguntas?.length || 0 }} {{ (sec.test?.preguntas?.length || 0) === 1 ? 'pregunta' : 'preguntas' }}</span>
        </div>
        <div class="context-body">
          <p *ngFor="let p of getFormattedParagraphs(sec.test?.contexto_base || '')">
            <span class="p-num" *ngIf="!p.isTitle && !isScienceOrMath()">[{{ p.number }}]</span>
            <span class="p-text" [class.p-title]="p.isTitle" [innerHTML]="parseMixed(p.text)"></span>
          </p>
        </div>
      </div>


      <!-- CTA -->
      <div class="cta-section">
        <div class="cta-card">
          <div class="cta-icon">🚀</div>
          <h3>¿Listo para practicar?</h3>
          <p>{{ sec.test?.preguntas?.length || 0 }} preguntas te esperan. ¡Debes responder todo correctamente para avanzar!</p>
          <button class="btn-start-test" (click)="goToTest()">Comenzar Test →</button>
        </div>
      </div>
      </ng-container>

      <!-- PRO TIP UI -->
      <ng-container *ngIf="sec.isProTip">
        <div class="content-card pro-tip-card">
          <div class="pro-tip-header">
            <div class="pro-tip-icon">💡</div>
            <h2>¡Pro Tip!</h2>
          </div>
          <div class="pro-tip-body">
            <h3>{{ sec.title }}</h3>
            <p [innerHTML]="parseMixed(sec.guia_contenido || sec.introduccion)"></p>
          </div>
          <div class="tips-list" *ngIf="sec.datos_claves?.length">
            <div *ngFor="let dato of sec.datos_claves; let i = index" class="tip-item tip-item-pro">
              <div class="tip-num" [style.background]="tipColors[i % tipColors.length]">✔</div>
              <p [innerHTML]="parseMixed(dato)"></p>
            </div>
          </div>
          
          <div class="pro-tip-actions">
            <button class="btn-got-it" (click)="completePractice()">¡Entendido! Avanzar ➔</button>
          </div>
        </div>
      </ng-container>

      <!-- BACK -->
      <button class="btn-back-text" [routerLink]="['/ruta', materiaId()]">← Volver a la ruta</button>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f8f9fa; color: var(--text-primary); }
    .sec-page { max-width: 680px; margin: 0 auto; padding: 1.5rem 1.5rem 5rem; }

    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
    .breadcrumb a:hover { color: var(--accent-primary); }
    .sep { color: rgba(0,0,0,0.2); }
    .current { color: var(--text-primary); font-weight: 600; }

    /* LESSON HEADER */
    .lesson-header { margin-bottom: 1.5rem; animation: fadeSlide 0.5s ease-out; }
    .lesson-badge { display: inline-block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--accent-primary); background: rgba(133,92,214,0.1); padding: 0.25rem 0.8rem; border-radius: 8px; margin-bottom: 0.75rem; }
    .lesson-header h1 { font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0; line-height: 1.2; }

    /* CONTENT CARDS */
    .content-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 18px; padding: 1.5rem; margin-bottom: 1.25rem; animation: fadeSlide 0.5s ease-out; }
    .card-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .card-icon { font-size: 1.3rem; }
    .card-header h3 { font-family: var(--font-heading); font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0; flex: 1; }
    .pregunta-count { font-size: 0.72rem; font-weight: 700; background: rgba(133,92,214,0.08); color: var(--accent-primary); padding: 0.2rem 0.65rem; border-radius: 99px; }

    /* MINI GUIA */
    .guide-card { border-color: rgba(133,92,214,0.15); background: linear-gradient(135deg, rgba(133,92,214,0.04), #fff); }
    .guide-body { font-size: 1rem; color: var(--text-secondary); line-height: 1.75; margin: 0; font-family: 'Helvetica', 'Arial', sans-serif; }
    ::ng-deep .guide-body strong, ::ng-deep .guide-body b { color: #000; font-weight: bold; }
    ::ng-deep .guide-body .katex { color: #000; font-weight: bold; }
    
    .sec-image-wrap-large, .sec-svg-wrap-large { margin: 2rem 0; text-align: center; display: flex; justify-content: center; }
    .sec-image-large { max-width: 100%; width: 500px; border-radius: 16px; border: 4px solid rgba(133,92,214,0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .sec-svg-container { max-width: 100%; width: 650px; }
    ::ng-deep .sec-svg-container svg { width: 100%; height: 100%; display: block; overflow: visible; }
    
    /* CONTEXT */
    .context-body { background: rgba(133,92,214,0.03); border-left: 4px solid var(--accent-primary); border-radius: 0 12px 12px 0; padding: 1.25rem; }
    .context-body p { margin: 0 0 0.85rem; padding-left: 0.5rem; line-height: 1.6; display: flex; gap: 0.6rem; align-items: baseline; }
    .context-body p:last-child { margin-bottom: 0; }
    .p-num { font-weight: 800; color: #b8b8b8; font-size: 0.85rem; user-select: none; min-width: 1.5rem; }
    .p-text { color: var(--text-secondary); font-size: 1rem; font-family: 'Helvetica', 'Arial', sans-serif; }
    ::ng-deep .p-text strong, ::ng-deep .p-text b { color: #000; font-weight: bold; }
    ::ng-deep .p-text .katex { color: #000; font-weight: bold; }
    .p-text.p-title { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: var(--accent-primary); font-style: normal; margin-top: 0.75rem; margin-bottom: 0.35rem; display: block; border-bottom: 2px solid rgba(133,92,214,0.15); padding-bottom: 0.35rem; }

    /* Tips & Key Points */
    .key-points-list { margin: 0; padding-left: 1.5rem; color: var(--text-secondary); font-family: 'Helvetica', 'Arial', sans-serif; }
    .key-points-list li { margin-bottom: 0.5rem; line-height: 1.5; }
    .key-points-list li:last-child { margin-bottom: 0; }
    ::ng-deep .key-points-list strong, ::ng-deep .key-points-list b { color: #000; font-weight: bold; }
    ::ng-deep .key-points-list .katex { color: #000; font-weight: bold; }
    
    .tips-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .tip-item { display: flex; gap: 0.75rem; background: rgba(0,0,0,0.02); padding: 0.75rem; border-radius: 10px; align-items: flex-start; }
    .tip-num { width: 24px; height: 24px; border-radius: 6px; background: var(--accent-primary); color: #fff; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 0.1rem; }
    .tip-item p { margin: 0; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; font-family: 'Helvetica', 'Arial', sans-serif; }
    ::ng-deep .tip-item p strong, ::ng-deep .tip-item p b { color: #000; font-weight: bold; }
    ::ng-deep .tip-item p .katex { color: #000; font-weight: bold; }

    /* CTA */
    .cta-section { margin: 2rem 0; animation: fadeSlide 0.5s ease-out 0.2s both; }
    .cta-card { text-align: center; background: linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02)); border: 2px dashed rgba(133,92,214,0.2); border-radius: 20px; padding: 2.5rem 2rem; }
    .cta-icon { font-size: 2.5rem; margin-bottom: 0.75rem; animation: ctaBounce 2s ease-in-out infinite; }
    .cta-card h3 { font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem; }
    .cta-card p { font-size: 0.88rem; color: var(--text-secondary); margin: 0 0 1.5rem; }
    .btn-start-test { padding: 1rem 2.5rem; border-radius: 999px; border: none; background: var(--accent-primary); color: #fff; font-family: var(--font-heading); font-weight: 800; font-size: 1.05rem; cursor: pointer; box-shadow: 0 5px 0 #6b46b8; transition: all 0.2s; animation: testPulse 2s ease-in-out infinite; }
    .btn-start-test:hover { transform: translateY(3px); box-shadow: 0 2px 0 #6b46b8; }
    .btn-back-text { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0; margin-top: 1rem; }
    .btn-back-text:hover { color: var(--accent-primary); }

    .guide-nav-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .btn-back { background: transparent; border: none; font-size: 0.95rem; font-weight: 700; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; transition: all 0.2s; }
    .btn-back:hover { color: var(--accent-primary); transform: translateX(-4px); }

    .materia-progress-mini { display: flex; align-items: center; gap: 0.75rem; background: rgba(133,92,214,0.04); padding: 0.4rem 0.85rem; border-radius: 99px; border: 1px solid rgba(133,92,214,0.08); }
    .progress-pct { font-size: 0.75rem; font-weight: 800; color: var(--accent-primary); }
    .progress-bar-mini { width: 80px; height: 6px; background: rgba(0, 0, 0, 0.06); border-radius: 99px; overflow: hidden; }
    .progress-fill-mini { height: 100%; background: linear-gradient(90deg, var(--accent-primary), #58cc02); border-radius: 99px; transition: width 0.4s ease; }

    .practice-card { padding: 2rem; border-radius: 20px; background: #fff; border: 2px solid rgba(133,92,214,0.1); animation: fadeSlide 0.4s ease both; }
    .practice-success-actions { margin-top: 2rem; padding-top: 1.5rem; border-top: 2px dashed rgba(133,92,214,0.2); text-align: center; animation: fadeSlide 0.4s ease-out; }
    .success-banner { display: inline-block; font-weight: 700; color: #58cc02; background: rgba(88,204,2,0.1); padding: 0.5rem 1.25rem; border-radius: 99px; margin-bottom: 1rem; }
    .btn-next { background: #58cc02; box-shadow: 0 5px 0 #4caf00; }
    .btn-next:hover { box-shadow: 0 2px 0 #4caf00; }

    /* A11Y MINI PANEL */
    /* A11Y MINI PANEL: botones siempre visibles con ícono (antes un desplegable
       "🎧 Atajos de Audio ▼" y texto "[P]/[O]/[T]/[I]" con el atajo de teclado). */
    .a11y-mini-panel-container { margin-top: 0.5rem; display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; z-index: 100; }
    .a11y-panel-label { font-size: 0.85rem; font-weight: 700; color: var(--accent-primary); }
    .a11y-mini-panel { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .a11y-shortcut {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-family: inherit; font-size: 0.8rem; font-weight: 700;
      color: var(--accent-primary); background: #fff;
      padding: 0.45rem 0.85rem; border-radius: 10px;
      border: 2px solid var(--accent-primary);
      cursor: pointer; transition: all 0.2s;
    }
    .a11y-icon { width: 14px; height: 14px; flex-shrink: 0; }
    .a11y-shortcut:hover { background: var(--accent-primary); color: #fff; }
    .a11y-shortcut-stop { color: #ef4444; border-color: #ef4444; }
    .a11y-shortcut-stop:hover { background: #ef4444; color: #fff; }

    /* PRO TIP UI */
    .pro-tip-card { background: linear-gradient(135deg, #fff, rgba(255, 150, 0, 0.05)); border: 2px solid rgba(255, 150, 0, 0.2); animation: fadeSlide 0.5s ease-out; text-align: center; padding: 2.5rem 2rem; }
    .pro-tip-header { margin-bottom: 1.5rem; }
    .pro-tip-icon { font-size: 3.5rem; margin-bottom: 0.5rem; animation: ctaBounce 2s ease-in-out infinite; text-shadow: 0 10px 20px rgba(255, 150, 0, 0.3); }
    .pro-tip-card h2 { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: #ff9600; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
    .pro-tip-body h3 { font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin: 0 0 1rem; }
    .pro-tip-body p { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; margin: 0 0 2rem; }
    .tip-item-pro { text-align: left; background: #fff; border: 1px solid rgba(0,0,0,0.05); }
    .btn-got-it { margin-top: 2rem; padding: 1.2rem 3rem; border-radius: 999px; border: none; background: #ff9600; color: #fff; font-family: var(--font-heading); font-weight: 800; font-size: 1.15rem; cursor: pointer; box-shadow: 0 5px 0 #cc7800; transition: all 0.2s; }
    .btn-got-it:hover { transform: translateY(3px); box-shadow: 0 2px 0 #cc7800; }

    /* RAPID PRACTICE UI */
    .generic-practice-card { background: linear-gradient(135deg, #fff, rgba(88, 204, 2, 0.05)); border: 2px solid rgba(88, 204, 2, 0.2); }
    .practice-header-dynamic { text-align: center; margin-bottom: 2rem; }
    .practice-icon-pulse { font-size: 3.5rem; margin-bottom: 0.5rem; animation: pulseGlow 2s infinite; text-shadow: 0 0 20px rgba(88, 204, 2, 0.4); }
    .practice-header-dynamic h2 { font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #58cc02; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
    .practice-header-dynamic p { font-size: 1.1rem; color: var(--text-secondary); margin-top: 0.5rem; font-weight: 600; }
    .context-body-header { margin-bottom: 1rem; color: var(--accent-primary); font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; }
    .mt-2 { margin-top: 1.5rem; }
    .practice-cta { background: linear-gradient(135deg, rgba(88, 204, 2, 0.1), rgba(88, 204, 2, 0.02)); border-color: rgba(88, 204, 2, 0.3); }
    .practice-cta h3 { color: #58cc02; }
    .btn-practice-go { background: #58cc02; box-shadow: 0 5px 0 #4caf00; }
    .btn-practice-go:hover { transform: translateY(3px); box-shadow: 0 2px 0 #4caf00; }

    @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ctaBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes pulseGlow { 0% { transform: scale(1); text-shadow: 0 0 10px rgba(88, 204, 2, 0.3); } 50% { transform: scale(1.1); text-shadow: 0 0 25px rgba(88, 204, 2, 0.7); } 100% { transform: scale(1); text-shadow: 0 0 10px rgba(88, 204, 2, 0.3); } }
    @keyframes testPulse { 0%, 100% { box-shadow: 0 5px 0 #6b46b8, 0 0 0 0 rgba(133,92,214,0.3); } 50% { box-shadow: 0 5px 0 #6b46b8, 0 0 0 10px rgba(133,92,214,0); } }
    @media (max-width: 640px) { .cta-card { padding: 2rem 1.25rem; } .practice-card { padding: 1.25rem; } .voice-dropdown-menu { right: auto; left: 0; } }

    /* ── Contencion de desbordamiento horizontal (movil) ──
       Las formulas KaTeX en bloque, las tablas y las imagenes anchas no tenian
       ningun contenedor con scroll: en pantallas estrechas empujaban el ancho de
       toda la pagina y aparecia scroll horizontal. Ahora cada bloque ancho se
       desplaza dentro de si mismo. */
    :host { display: block; max-width: 100%; overflow-x: clip; }
    ::ng-deep .katex-display { overflow-x: auto; overflow-y: hidden; max-width: 100%; padding-bottom: 0.25rem; }
    ::ng-deep table { display: block; max-width: 100%; overflow-x: auto; }
    ::ng-deep img, ::ng-deep svg { max-width: 100%; height: auto; }
    ::ng-deep pre { max-width: 100%; overflow-x: auto; }
  `]
})
export class SeccionFisicaDetailComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private katexSvc = inject(KatexService);
  private sanitizer = inject(DomSanitizer);

  tipColors = ['#855cd6', '#1cb0f6', '#ff9600', '#58cc02', '#ef4444'];

  materiaId = signal('');
  capituloId = signal('');
  seccionId = signal('');
  practiceCompleted = signal(false);

  isMathModule = computed(() => this.materiaId().toLowerCase().includes('mat'));
  isScienceOrMath = computed(() => {
    const id = this.materiaId().toLowerCase();
    return id.includes('mat') || id.includes('ciencias') || id.includes('fisica') || id.includes('bio') || id.includes('qui');
  });

  materia = computed(() => this.paes.getMateriaById(this.materiaId()));
  materiaProgress = computed(() => {
    const id = this.materiaId();
    if (!id) return { completed: 0, total: 0, percentage: 0 };
    return this.paes.getMateriaProgress(id);
  });
  capitulo = computed(() => this.paes.getCapituloById(this.capituloId()));
  seccion = computed(() => this.paes.getSeccionById(this.seccionId()));
  capOrder = computed(() => {
    const caps = this.paes.getCapitulosByMateria(this.materiaId());
    const idx = caps.findIndex(c => c.id === this.capituloId());
    return idx + 1;
  });

  constructor() {
    // Trae el test de esta seccion bajo demanda (1 lectura), en vez de que el
    // servicio cargue los 502 tests en cada arranque. Ver ensureTestLoaded().
    autoLoadTest(() => this.seccionId());

    // Gate freemium: el Plan Basico solo cursa el primer capitulo de cada materia.
    // Reactivo porque el contenido carga async (ver enforceLearningAccess).
    enforceLearningAccess({ materiaId: () => this.materiaId(), seccionId: () => this.seccionId() });

    this.route.paramMap.subscribe(params => {
      // Detect materiaId from URL since it's no longer a route parameter in the isolated routes
      const url = this.router.url;
      let matId = 'fisica';
      if (url.includes('ciencias-fisica')) matId = 'ciencias-fisica';
      this.materiaId.set(matId);
      this.capituloId.set(params.get('capituloId') || '');
      this.seccionId.set(params.get('seccionId') || '');
      this.practiceCompleted.set(false);
    });

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  goBack() {
    if (this.materiaId()) {
      this.router.navigate(['/ruta', this.materiaId()], { fragment: this.seccionId() });
    } else {
      this.router.navigate(['/ruta']);
    }
  }

  goToTest() {
    if (this.isScienceOrMath() && !this.materiaId().toLowerCase().includes('ciencias') && !this.materiaId().toLowerCase().includes('fisica')) {
      this.router.navigate(['/test-math', this.seccionId()]);
    } else {
      this.router.navigate(['/test', this.seccionId()]);
    }
  }

  goBackPath() {
    this.router.navigate(['/ruta', this.materiaId()]);
  }

    parseMixed(text: string | null | undefined): SafeHtml {
    if (!text) return '';
    const renderedSafe = this.katexSvc.renderMixedText(text);
    const rendered = (renderedSafe as any)?.changingThisBreaksApplicationSecurity || String(renderedSafe);
    const bolded = rendered.replace(/\*\*(.*?)\*\*/gs, '<strong style="color:var(--accent-primary)">$1</strong>');
    let withBreaks = bolded.replace(/&lt;br&gt;/gi, '<br>');
    withBreaks = withBreaks.replace(/&lt;(b|i|u|strong|em|div|span|h[1-6]|p|table|tbody|thead|tr|th|td|ul|ol|li)(.*?)&gt;/gi, (match: string, tag: string, attrs: string) => {
      const unescapedAttrs = attrs.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      return `<${tag}${unescapedAttrs}>`;
    });
    withBreaks = withBreaks.replace(/&lt;\/(b|i|u|strong|em|div|span|h[1-6]|p|table|tbody|thead|tr|th|td|ul|ol|li)&gt;/gi, '</$1>');
    return this.sanitizer.bypassSecurityTrustHtml(withBreaks);
  }

  renderSvg(svg: string | undefined): SafeHtml {
    if (!svg) return '';
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getFormattedParagraphs(text: string | null | undefined): { text: string; isTitle: boolean; number?: number }[] {
    if (!text) return [];
    const rawParagraphs = text.split('\n')
      .map(p => p.trim())
      .filter(p => p !== '' && p !== '--- DIVISION_TEXTOS ---');
      
    let paragraphCount = 0;
    return rawParagraphs.map(p => {
      const isTitle = p.startsWith('📖') || p.startsWith('TEXTO') || p.includes('TEXTO I') || p.includes('TEXTO II');
      if (isTitle) {
        paragraphCount = 0;
        return { text: p, isTitle: true };
      } else {
        paragraphCount++;
        return { text: p, isTitle: false, number: paragraphCount };
      }
    });
  }

  getParagraphs(text: string | null | undefined): string[] {
    if (!text) return [];
    return text.split('\n\n').map(p => p.trim()).filter(p => p !== '');
  }

  completePractice() {
    this.paes.markSeccionCompleted(this.seccionId());
    this.goNext();
  }

  goNext() {
    const nextUrl = this.paes.getNextNodeUrl(this.materiaId());
    if (nextUrl) {
      this.router.navigate(nextUrl);
    } else {
      this.router.navigate(['/ruta', this.materiaId()]);
    }
  }

  getSlidesForGuide(id: string) {
    if (id === 'sec-1-0-guia') return GUIA_TIPOS_TEXTO_SLIDES;
    return [];
  }

  getQuizzesForGuide(id: string): any {
    if (id === 'sec-1-0-guia') return { quiz_tipos_texto: QUIZ_TIPOS_TEXTO };
    return {};
  }

  // ==========================================
  // TEXT TO SPEECH (ACCESSIBILITY)
  // ==========================================
  ngOnDestroy() {
    this.stopReading();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (this.isMathModule()) return;

    const key = event.key.toLowerCase();
    if (key === 'p') this.readGuide();
    if (key === 'o') this.readContext();
    if (key === 't') this.readTips();
    if (key === 'i' || key === 'escape') this.stopReading();
    
    // Iniciar test con espacio
    if (key === ' ' || key === 'spacebar') {
      event.preventDefault();
      this.goToTest();
    }
  }

  private cleanHtml(html: string): string {
    if (!html) return '';
    let text = html.replace(/&quot;/g, '"');
    text = text.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ''); // Remove SVG
    text = text.replace(/<br\s*\/?>/gi, '. ');
    text = text.replace(/<[^>]*>?/gm, '');
    text = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
    text = text.replace(/\*/g, '');
    return text.trim();
  }

  private getBestVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.name.toLowerCase().includes('natural') && v.lang.startsWith('es'));
    if (!voice) voice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('es'));
    if (!voice) voice = voices.find(v => v.name.includes('Microsoft') && (v.name.includes('Helena') || v.name.includes('Laura') || v.name.includes('Pablo') || v.name.includes('Sabina')));
    if (!voice) voice = voices.find(v => v.lang.startsWith('es-') || v.lang === 'es');
    return voice || null;
  }

  private speak(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    
    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    window.speechSynthesis.speak(utterance);
  }

  readGuide() {
    const sec = this.seccion();
    if (!sec) return;
    const text = this.cleanHtml(sec.guia_titulo || 'Qué aprenderás') + '. ' + this.cleanHtml(sec.guia_contenido || sec.introduccion);
    this.speak(text);
  }

  readContext() {
    const sec = this.seccion();
    if (!sec?.test?.contexto_base) return;
    const text = 'Texto de práctica. ' + this.cleanHtml(sec.test.contexto_base);
    this.speak(text);
  }

  readTips() {
    const sec = this.seccion();
    if (!sec?.datos_claves?.length) return;
    let text = 'Tips clave: ';
    sec.datos_claves.forEach((tip, idx) => {
      text += `Tip número ${idx + 1}: ${this.cleanHtml(tip)}. `;
    });
    this.speak(text);
  }

  stopReading() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
