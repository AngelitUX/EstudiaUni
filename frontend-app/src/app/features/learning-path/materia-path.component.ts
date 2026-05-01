import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';

type PathItem = 
  | { type: 'chapter', title: string, subtitle: string }
  | { type: 'node', id: string, capituloId: string, title: string, status: 'completed' | 'active' | 'locked', nodeIndex: number };

@Component({
  selector: 'app-materia-path',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="materia-page" *ngIf="materia() as m">
      
      <!-- HEADER -->
      <header class="path-header">
        <button class="btn-back" routerLink="/ruta">
          <span>←</span>
        </button>
        <div class="header-info">
          <h2>{{ m.title }}</h2>
        </div>
      </header>

      <!-- DUOLINGO PATH -->
      <div class="duo-path-container">
        <!-- Central Line -->
        <div class="path-center-line"></div>

        <ng-container *ngFor="let item of pathItems()">
          
          <!-- CHAPTER DIVIDER -->
          <div *ngIf="item.type === 'chapter'" class="chapter-divider">
            <div class="div-line"></div>
            <div class="div-content">
              <span class="div-title">{{ item.title }}</span>
            </div>
            <div class="div-line"></div>
          </div>

          <!-- SECTION NODE -->
          <div *ngIf="item.type === 'node'" class="node-row">
            <div class="node-wrapper" [style.transform]="'translateX(' + getOffset(item.nodeIndex) + 'px)'">
              
              <!-- Active Tooltip -->
              <div class="active-tooltip" *ngIf="item.status === 'active'">
                EMPEZAR
                <div class="tooltip-arrow"></div>
              </div>

              <!-- Node Button -->
              <button class="duo-node" 
                [class.node-completed]="item.status === 'completed'"
                [class.node-active]="item.status === 'active'"
                [class.node-locked]="item.status === 'locked'"
                (click)="handleNodeClick(item)">
                
                <div class="node-inner">
                  <!-- Icons based on status -->
                  <svg *ngIf="item.status === 'completed'" class="node-icon icon-star" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  
                  <svg *ngIf="item.status === 'active'" class="node-icon icon-star" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>

                  <svg *ngIf="item.status === 'locked'" class="node-icon icon-lock" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                  </svg>
                </div>
              </button>

              <!-- Node Floating Title -->
              <div class="node-title-float" 
                [class.pos-left]="getOffset(item.nodeIndex) > 0"
                [class.pos-right]="getOffset(item.nodeIndex) <= 0"
                [class.text-completed]="item.status === 'completed'"
                [class.text-active]="item.status === 'active'">
                {{ item.title }}
              </div>
            </div>
          </div>

        </ng-container>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #ffffff; }
    .materia-page { max-width: 600px; margin: 0 auto; padding-bottom: 6rem; position: relative; }

    /* HEADER */
    .path-header { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 2px solid rgba(0,0,0,0.06); padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; }
    .btn-back { background: transparent; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: all 0.2s; }
    .btn-back:hover { background: rgba(0,0,0,0.05); color: var(--text-primary); }
    .header-info h2 { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0; }

    /* PATH CONTAINER */
    .duo-path-container { position: relative; padding: 2rem 0; display: flex; flex-direction: column; align-items: center; overflow: hidden; }

    /* CENTRAL FAINT LINE */
    .path-center-line { position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); width: 24px; background: rgba(0,0,0,0.03); z-index: 0; border-radius: 12px; }

    /* CHAPTER DIVIDER */
    .chapter-divider { display: flex; align-items: center; width: 100%; max-width: 440px; margin: 4.5rem 0 3.5rem; position: relative; z-index: 1; padding: 0 1rem; }
    .div-line { flex: 1; height: 2px; background: rgba(0,0,0,0.08); }
    .div-content { padding: 0 1.25rem; text-align: center; }
    .div-title { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.08em; }

    /* NODE ROW */
    .node-row { width: 100%; display: flex; justify-content: center; margin-bottom: 2.5rem; position: relative; z-index: 2; }
    .node-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; transition: transform 0.3s ease; }

    /* NODE FLOATING TITLE */
    .node-title-float { position: absolute; top: 50%; transform: translateY(-50%); background: #fff; padding: 0.5rem 0.9rem; border-radius: 12px; font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); white-space: nowrap; border: 2px solid rgba(0,0,0,0.06); box-shadow: 0 4px 12px rgba(0,0,0,0.04); pointer-events: none; transition: all 0.2s; }
    .pos-right { left: calc(100% + 20px); }
    .pos-left { right: calc(100% + 20px); }
    .text-completed { color: #3d8c00; border-color: rgba(88,204,2,0.2); }
    .text-active { color: var(--accent-primary); border-color: rgba(133,92,214,0.25); box-shadow: 0 4px 12px rgba(133,92,214,0.1); }

    /* ACTIVE TOOLTIP */
    .active-tooltip { position: absolute; top: -55px; background: #111827; color: #fff; font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; padding: 0.6rem 1rem; border-radius: 12px; letter-spacing: 0.05em; animation: bounce 2s infinite; white-space: nowrap; box-shadow: 0 6px 16px rgba(0,0,0,0.15); z-index: 10; }
    .tooltip-arrow { position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #111827; }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-8px); }
      60% { transform: translateY(-4px); }
    }

    /* DUO NODE BUTTON */
    .duo-node { border: none; border-radius: 50%; padding: 0; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); position: relative; outline: none; -webkit-tap-highlight-color: transparent; }
    .node-inner { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .node-icon { width: 32px; height: 32px; }

    /* COMPLETED STATE */
    .node-completed { background: #58cc02; box-shadow: 0 6px 0 #46a302; }
    .node-completed .node-inner { background: linear-gradient(180deg, #65e003, #58cc02); }
    .node-completed .node-icon { color: white; }
    .node-completed:active { transform: translateY(6px); box-shadow: 0 0 0 #46a302; }

    /* ACTIVE STATE */
    .node-active { background: #ce82ff; box-shadow: 0 8px 0 #a559d6, 0 0 0 8px rgba(206,130,255,0.2); transform: scale(1.1); animation: pulseRing 3s infinite; }
    .node-active .node-inner { background: linear-gradient(180deg, #dfa6ff, #ce82ff); border: 4px solid white; width: 76px; height: 76px; }
    .node-active .node-icon { color: white; width: 36px; height: 36px; }
    .node-active:active { transform: scale(1.1) translateY(8px); box-shadow: 0 0 0 #a559d6, 0 0 0 4px rgba(206,130,255,0.2); }

    /* LOCKED STATE */
    .node-locked { background: #e5e5e5; box-shadow: 0 6px 0 #cccccc; cursor: not-allowed; }
    .node-locked .node-inner { background: #e5e5e5; }
    .node-locked .node-icon { color: #afafaf; }
    .node-locked:active { transform: translateY(6px); box-shadow: 0 0 0 #cccccc; }

    @keyframes pulseRing {
      0% { box-shadow: 0 8px 0 #a559d6, 0 0 0 0 rgba(206,130,255,0.4); }
      70% { box-shadow: 0 8px 0 #a559d6, 0 0 0 15px rgba(206,130,255,0); }
      100% { box-shadow: 0 8px 0 #a559d6, 0 0 0 0 rgba(206,130,255,0); }
    }

    @media (max-width: 600px) {
      .path-center-line { width: 16px; }
      .node-inner { width: 64px; height: 64px; }
      .node-active .node-inner { width: 68px; height: 68px; }
      .node-icon { width: 28px; height: 28px; }
    }
  `]
})
export class MateriaPathComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  materiaId = signal('');
  materia = computed(() => this.paes.getMateriaById(this.materiaId()));
  capitulos = computed(() => this.paes.getCapitulosByMateria(this.materiaId()));

  // Pattern for horizontal zigzag staggering
  private offsets = [0, -40, -65, -40, 0, 40, 65, 40];

  constructor() {
    this.materiaId.set(this.route.snapshot.paramMap.get('materiaId') || '');
  }

  getOffset(index: number): number {
    return this.offsets[index % this.offsets.length];
  }

  pathItems = computed(() => {
    const items: PathItem[] = [];
    let nodeIndex = 0;
    let foundActive = false;

    this.capitulos().forEach((cap, capIndex) => {
      // 1. Add Chapter Divider
      items.push({
        type: 'chapter',
        title: cap.title,
        subtitle: `Capítulo ${capIndex + 1}`
      });

      // 2. Add Sections as nodes
      cap.secciones.forEach((sec) => {
        const prog = this.paes.getSeccionProgress(sec.id);
        const completed = prog?.completed || false;
        
        let status: 'completed' | 'active' | 'locked' = 'locked';

        if (completed) {
          status = 'completed';
        } else if (!foundActive) {
          status = 'active';
          foundActive = true;
        } else {
          status = 'locked';
        }

        items.push({
          type: 'node',
          id: sec.id,
          capituloId: cap.id,
          title: sec.title,
          status,
          nodeIndex: nodeIndex++
        });
      });
    });

    return items;
  });

  handleNodeClick(item: any) {
    if (item.status === 'locked') return;
    this.router.navigate(['/ruta', this.materiaId(), item.capituloId, item.id]);
  }
}
