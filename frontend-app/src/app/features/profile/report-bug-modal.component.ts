import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../core/services/firestore.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-report-bug-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container glass" (click)="$event.stopPropagation()">
        <div class="modal-topbar">
          <h1>Reportar Problema</h1>
          <button class="btn-close" (click)="closeModal()">✕</button>
        </div>
        <div class="modal-scroll">
          <p class="desc-text">¿Encontraste un error, tienes una sugerencia o necesitas ayuda? Escríbenos a continuación.</p>
          
          <div class="form-group">
            <label>Tipo de reporte</label>
            <select [(ngModel)]="report.type">
              <option value="Bug">Error / Bug</option>
              <option value="Sugerencia">Sugerencia</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Título breve</label>
            <input type="text" [(ngModel)]="report.title" placeholder="Ej: No me carga el mini ensayo" maxlength="100">
          </div>
          
          <div class="form-group">
            <label>Descripción detallada</label>
            <textarea [(ngModel)]="report.description" rows="5" placeholder="Explícanos con más detalle lo que sucede..." maxlength="1000"></textarea>
          </div>
          
          <div class="action-bar">
            <button class="btn-cancel" (click)="closeModal()">Cancelar</button>
            <button class="primary" (click)="submitReport()" [disabled]="submitting || !report.title || !report.description">
              {{ submitting ? 'Enviando...' : 'Enviar Reporte' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.55); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); animation: fadeOverlay .25s ease; }
    @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
    .modal-container { position: relative; width: min(520px, 94vw); max-height: 88vh; display: flex; flex-direction: column; border-radius: 18px; background: #ffffff; border: 2px solid var(--glass-border); box-shadow: var(--shadow-lg); animation: slideUp .3s cubic-bezier(.16,1,.3,1); color: var(--text-primary); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(32px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .modal-topbar { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 2px solid var(--glass-border); }
    .modal-topbar h1 { margin: 0; font-size: 1.15rem; font-weight: 800; }
    .btn-close { border: none; background: var(--bg-secondary); color: var(--text-secondary); width: 34px; height: 34px; border-radius: 10px; font-size: 1.1rem; cursor: pointer; display: grid; place-items: center; transition: all .2s; }
    .btn-close:hover { background: rgba(239,68,68,0.25); color: #fca5a5; }
    .modal-scroll { overflow-y: auto; padding: 1.25rem; flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
    .desc-text { margin: 0; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; font-weight: 500; }
    
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.9rem; color: var(--text-primary); font-weight: 700; }
    input, textarea, select { width: 100%; border-radius: 9px; border: 2px solid var(--glass-border); background: #ffffff; color: var(--text-primary); padding: 0.65rem 0.75rem; font: inherit; font-size: 0.95rem !important; box-sizing: border-box; transition: all 0.2s; }
    input:focus, textarea:focus, select:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 2px rgba(133,92,214,0.2); }
    textarea { resize: vertical; min-height: 100px; }
    
    .action-bar { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
    .btn-cancel { padding: 0.65rem 1rem; border-radius: 9px; border: 2px solid var(--glass-border); background: transparent; color: var(--text-secondary); font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-cancel:hover { background: var(--bg-secondary); color: var(--text-primary); }
    .primary { border: 0; border-radius: 9px; background: linear-gradient(135deg, #855cd6, #6b46b8); color: #fff; padding: 0.65rem 1.25rem; font-weight: 600; cursor: pointer; transition: all .2s; box-shadow: 0 4px 12px rgba(133,92,214,0.25); }
    .primary:hover:not([disabled]) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(133,92,214,0.35); }
    .primary[disabled] { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }
  `]
})
export class ReportBugModalComponent {
  @Output() close = new EventEmitter<void>();
  
  private firestoreService = inject(FirestoreService);
  private toast = inject(ToastService);
  
  submitting = false;
  
  report = {
    type: 'Bug',
    title: '',
    description: ''
  };

  closeModal() {
    this.close.emit();
  }

  async submitReport() {
    if (!this.report.title || !this.report.description) return;
    
    this.submitting = true;
    try {
      await this.firestoreService.submitBugReport(this.report);
      this.toast.success('Reporte enviado correctamente. ¡Gracias!');
      this.closeModal();
    } catch (error) {
      console.error(error);
      this.toast.error('Hubo un error al enviar el reporte.');
    } finally {
      this.submitting = false;
    }
  }
}
