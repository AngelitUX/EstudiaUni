import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, NewsItem } from './services/admin.service';
import { AdminSidebarComponent } from './admin-sidebar.component';

/**
 * Gestión de las noticias del carrusel del home (colección `news`).
 * El home las lee con FirestoreService.getNews() (cacheado 10 min + limit(20),
 * orden por `date` desc). Este panel limpia ese cache tras cada cambio.
 *
 * Clases con prefijo `admin-` a propósito (ver nota en admin-sidebar.component.ts):
 * styles.css tiene reglas GLOBALES con !important sobre .sidebar/.main-content/etc.
 */

const GRADIENTES: { label: string; value: string }[] = [
  { label: 'Rojo (alerta)',     value: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' },
  { label: 'Azul',              value: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
  { label: 'Verde',             value: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
  { label: 'Morado (marca)',    value: 'linear-gradient(135deg, #855cd6 0%, #6d28d9 100%)' },
  { label: 'Naranjo',           value: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  { label: 'Cian',              value: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)' },
];

interface NewsForm {
  title: string;
  excerpt: string;
  source: string;
  dateISO: string;   // del <input type="date">, formato YYYY-MM-DD
  dateText: string;
  linkUrl: string;
  imageUrl: string;
  gradient: string;
  tag: string;
}

function emptyForm(): NewsForm {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return {
    title: '', excerpt: '', source: '', dateISO: iso, dateText: '',
    linkUrl: '', imageUrl: '', gradient: GRADIENTES[3].value, tag: '',
  };
}

/** "2026-05-19" -> "19 de mayo, 2026" (sin desfase de zona horaria) */
function isoToTexto(iso: string): string {
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return iso;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const mes = d.toLocaleDateString('es-CL', { month: 'long' });
  return `${d.getDate()} de ${mes}, ${d.getFullYear()}`;
}

@Component({
  selector: 'app-admin-news',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  template: `
    <div class="admin-layout">
      <app-admin-sidebar></app-admin-sidebar>

      <main class="admin-main-content animate-fade-in-down">
        <header class="content-header">
          <div class="header-left">
            <h1>Noticias del Home</h1>
            <p class="subtitle">Las tarjetas del carrusel "Últimas noticias PAES" de la portada. El home muestra las 20 más recientes (por fecha).</p>
          </div>
          <div class="header-actions">
            <button class="btn-refresh" (click)="load()" [disabled]="loading()">
              {{ loading() ? '⏳' : '🔄' }} Actualizar
            </button>
            <button class="btn-primary" (click)="openNew()">➕ Nueva noticia</button>
          </div>
        </header>

        <div class="loading-state" *ngIf="loading()">
          <div class="spinner"></div>
          <p>Cargando noticias...</p>
        </div>

        <div class="empty-state glass-card" *ngIf="!loading() && news().length === 0">
          <div class="empty-icon">📰</div>
          <h3>No hay noticias</h3>
          <p>Agrega la primera con "Nueva noticia".</p>
        </div>

        <div class="news-list" *ngIf="!loading() && news().length > 0">
          <div class="news-row glass-card-simple" *ngFor="let n of news()">
            <div class="news-thumb" [style.background]="n.gradient">
              <img [src]="n.imageUrl" alt="" (error)="onImgError($event)" />
            </div>
            <div class="news-info">
              <div class="news-meta-row">
                <span class="news-tag" [style.background]="n.gradient">{{ n.tag || 'sin etiqueta' }}</span>
                <span class="news-src">{{ n.source }}</span>
                <span class="news-dot">•</span>
                <span class="news-date">{{ n.dateText || n.date }}</span>
              </div>
              <h3 class="news-title">{{ n.title }}</h3>
              <p class="news-excerpt">{{ n.excerpt }}</p>
              <a class="news-link" [href]="n.linkUrl" target="_blank" rel="noopener noreferrer">{{ n.linkUrl }}</a>
            </div>
            <div class="news-actions">
              <button class="btn-icon" title="Editar" (click)="openEdit(n)">✏️</button>
              <button class="btn-icon btn-danger" title="Eliminar" (click)="remove(n)">🗑️</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- MODAL FORMULARIO -->
    <div class="admin-modal-overlay" *ngIf="showForm()" (click)="closeForm()">
      <div class="admin-modal glass-card" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <h2>{{ editingId() ? 'Editar noticia' : 'Nueva noticia' }}</h2>
          <button class="btn-icon" (click)="closeForm()">✕</button>
        </header>

        <div class="modal-body">
          <div class="form-grid">
            <label class="fld fld-full">
              <span>Título *</span>
              <textarea rows="2" [(ngModel)]="form.title" placeholder="Inscripción PAES 2026: DEMRE lanza advertencia..."></textarea>
            </label>

            <label class="fld fld-full">
              <span>Bajada / extracto *</span>
              <textarea rows="3" [(ngModel)]="form.excerpt" placeholder="Resumen corto de la noticia (2-3 líneas)"></textarea>
            </label>

            <label class="fld">
              <span>Fuente *</span>
              <input [(ngModel)]="form.source" placeholder="El Mostrador" />
            </label>

            <label class="fld">
              <span>Etiqueta (badge)</span>
              <input [(ngModel)]="form.tag" placeholder="¡Advertencia!" />
            </label>

            <label class="fld">
              <span>Fecha *</span>
              <input type="date" [(ngModel)]="form.dateISO" (ngModelChange)="onDateChange()" />
            </label>

            <label class="fld">
              <span>Fecha visible</span>
              <input [(ngModel)]="form.dateText" placeholder="19 de mayo, 2026" />
            </label>

            <label class="fld fld-full">
              <span>URL de la noticia (link externo) *</span>
              <input [(ngModel)]="form.linkUrl" placeholder="https://..." />
            </label>

            <label class="fld fld-full">
              <span>URL de la imagen de portada *</span>
              <input [(ngModel)]="form.imageUrl" placeholder="https://... o assets/imagesHome/seccion noticias/..." />
            </label>

            <label class="fld fld-full">
              <span>Color del degradado (overlay de la portada)</span>
              <select [(ngModel)]="form.gradient">
                <option *ngFor="let g of gradientes" [value]="g.value">{{ g.label }}</option>
              </select>
            </label>
          </div>

          <!-- PREVIEW -->
          <div class="preview-wrap">
            <span class="preview-label">Vista previa de la tarjeta</span>
            <div class="pv-card">
              <div class="pv-img">
                <img *ngIf="form.imageUrl" [src]="form.imageUrl" alt="" (error)="onImgError($event)" />
                <div class="pv-overlay" [style.background]="form.gradient"></div>
                <span class="pv-badge">{{ form.tag || 'Etiqueta' }}</span>
              </div>
              <div class="pv-body">
                <div class="pv-meta">
                  <span>{{ form.source || 'Fuente' }}</span>
                  <span>•</span>
                  <span>{{ form.dateText || form.dateISO }}</span>
                </div>
                <h3>{{ form.title || 'Título de la noticia' }}</h3>
                <p>{{ form.excerpt || 'Bajada de la noticia...' }}</p>
              </div>
            </div>
          </div>
        </div>

        <footer class="modal-footer">
          <p class="form-error" *ngIf="formError()">{{ formError() }}</p>
          <div class="footer-btns">
            <button class="btn-ghost" (click)="closeForm()">Cancelar</button>
            <button class="btn-primary" (click)="save()" [disabled]="saving()">
              {{ saving() ? 'Guardando...' : (editingId() ? 'Guardar cambios' : 'Crear noticia') }}
            </button>
          </div>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #fafafa; color: var(--text-primary); }
    .admin-layout { display: flex; min-height: 100vh; }
    .admin-main-content { flex: 1; margin-left: 260px; padding: 2.5rem; background: #fafafa; }

    .content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; gap: 1.5rem; flex-wrap: wrap; }
    .content-header h1 { font-family: var(--font-heading); font-size: 2.8rem; font-weight: 800; margin: 0; letter-spacing: -0.03em; }
    .subtitle { font-size: 1.1rem; color: var(--text-secondary); margin: 0.5rem 0 0; font-weight: 500; max-width: 640px; }
    .header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

    .btn-refresh { padding: 0.75rem 1.25rem; border-radius: 12px; border: 2px solid var(--glass-border); background: #fff; color: var(--text-secondary); font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-refresh:hover { border-color: rgba(133,92,214,0.4); color: var(--accent-primary); }
    .btn-primary { padding: 0.75rem 1.25rem; border-radius: 12px; border: none; background: var(--accent-primary); color: #fff; font-weight: 800; cursor: pointer; transition: all 0.2s; }
    .btn-primary:hover:not(:disabled) { filter: brightness(1.05); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-ghost { padding: 0.75rem 1.25rem; border-radius: 12px; border: 2px solid var(--glass-border); background: #fff; color: var(--text-secondary); font-weight: 700; cursor: pointer; }

    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 6rem 2rem; color: var(--text-secondary); }
    .spinner { width: 44px; height: 44px; border: 4px solid rgba(133,92,214,0.15); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state { text-align: center; padding: 5rem 2rem; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.8; }
    .empty-state h3 { font-size: 1.5rem; margin: 0 0 0.5rem; font-weight: 800; }
    .empty-state p { color: var(--text-secondary); margin: 0; }

    .glass-card, .glass-card-simple { background: #fff; border: 2px solid var(--glass-border); border-radius: 20px; box-shadow: var(--shadow-sm); }

    .news-list { display: flex; flex-direction: column; gap: 1.25rem; }
    .news-row { display: flex; gap: 1.25rem; padding: 1.25rem; align-items: flex-start; }
    .news-thumb { width: 150px; min-width: 150px; height: 90px; border-radius: 12px; overflow: hidden; position: relative; }
    .news-thumb img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: overlay; opacity: 0.9; }
    .news-info { flex: 1; min-width: 0; }
    .news-meta-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.35rem; }
    .news-tag { color: #fff; padding: 0.15rem 0.55rem; border-radius: 6px; font-weight: 800; font-size: 0.72rem; }
    .news-title { font-size: 1.1rem; font-weight: 800; margin: 0 0 0.35rem; }
    .news-excerpt { font-size: 0.9rem; color: var(--text-secondary); margin: 0 0 0.4rem; line-height: 1.5; }
    .news-link { font-size: 0.8rem; color: var(--accent-secondary); word-break: break-all; }
    .news-actions { display: flex; gap: 0.5rem; }
    .btn-icon { width: 36px; height: 36px; border-radius: 10px; border: 2px solid var(--glass-border); background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: all 0.2s; }
    .btn-icon:hover { background: var(--bg-secondary); }
    .btn-icon.btn-danger:hover { background: #fee2e2; border-color: #fca5a5; }

    /* MODAL */
    .admin-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.55); backdrop-filter: blur(3px); z-index: 200; display: flex; align-items: flex-start; justify-content: center; padding: 3rem 1.5rem; overflow-y: auto; }
    .admin-modal { width: 100%; max-width: 760px; background: #fff; border-radius: 20px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 1.75rem; border-bottom: 1px solid var(--glass-border); }
    .modal-header h2 { margin: 0; font-size: 1.4rem; font-weight: 800; }
    .modal-body { padding: 1.5rem 1.75rem; display: grid; grid-template-columns: 1fr; gap: 1.75rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .fld { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); }
    .fld-full { grid-column: 1 / -1; }
    .fld input, .fld textarea, .fld select { padding: 0.6rem 0.75rem; border: 1.5px solid var(--glass-border); border-radius: 10px; font-size: 0.9rem; font-family: inherit; font-weight: 500; color: var(--text-primary); background: #fff; outline: none; resize: vertical; }
    .fld input:focus, .fld textarea:focus, .fld select:focus { border-color: var(--accent-primary); }

    .preview-wrap { border-top: 1px dashed var(--glass-border); padding-top: 1.25rem; }
    .preview-label { font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .pv-card { margin-top: 0.75rem; width: 300px; max-width: 100%; border: 2px solid var(--glass-border); border-radius: 16px; overflow: hidden; }
    .pv-img { position: relative; height: 150px; background: #e5e7eb; }
    .pv-img img { width: 100%; height: 100%; object-fit: cover; }
    .pv-overlay { position: absolute; inset: 0; opacity: 0.45; }
    .pv-badge { position: absolute; top: 0.6rem; left: 0.6rem; background: rgba(255,255,255,0.92); color: #111; font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 6px; }
    .pv-body { padding: 0.9rem 1rem 1.1rem; }
    .pv-meta { display: flex; gap: 0.4rem; font-size: 0.72rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.35rem; }
    .pv-body h3 { font-size: 0.95rem; font-weight: 800; margin: 0 0 0.35rem; }
    .pv-body p { font-size: 0.82rem; color: var(--text-secondary); margin: 0; line-height: 1.45; }

    .modal-footer { padding: 1.25rem 1.75rem; border-top: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 0.75rem; }
    .form-error { color: #dc2626; font-size: 0.85rem; font-weight: 700; margin: 0; }
    .footer-btns { display: flex; justify-content: flex-end; gap: 0.75rem; }

    @media (max-width: 1024px) {
      .admin-layout { flex-direction: column; }
      .admin-main-content { margin-left: 0; padding: 1.5rem; }
    }
    @media (max-width: 640px) {
      .content-header h1 { font-size: 2rem; }
      .form-grid { grid-template-columns: 1fr; }
      .news-row { flex-direction: column; }
      .news-thumb { width: 100%; }
      .news-actions { align-self: flex-end; }
    }
  `]
})
export class AdminNewsComponent implements OnInit {
  private adminSvc = inject(AdminService);

  readonly gradientes = GRADIENTES;

  news = signal<NewsItem[]>([]);
  loading = signal(false);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  saving = signal(false);
  formError = signal('');

  form: NewsForm = emptyForm();

  ngOnInit() {
    this.load();
  }

  async load() {
    this.loading.set(true);
    this.news.set(await this.adminSvc.getNews());
    this.loading.set(false);
  }

  openNew() {
    this.form = emptyForm();
    this.form.dateText = isoToTexto(this.form.dateISO);
    this.editingId.set(null);
    this.formError.set('');
    this.showForm.set(true);
  }

  openEdit(n: NewsItem) {
    this.form = {
      title: n.title || '',
      excerpt: n.excerpt || '',
      source: n.source || '',
      dateISO: /^\d{4}-\d{2}-\d{2}$/.test(n.date || '') ? n.date : emptyForm().dateISO,
      dateText: n.dateText || '',
      linkUrl: n.linkUrl || '',
      imageUrl: n.imageUrl || '',
      gradient: n.gradient || GRADIENTES[3].value,
      tag: n.tag || '',
    };
    this.editingId.set(n.id || null);
    this.formError.set('');
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  onDateChange() {
    // Regenera el texto visible salvo que el admin ya lo haya personalizado a algo
    // que no corresponde a ninguna fecha automática previa.
    this.form.dateText = isoToTexto(this.form.dateISO);
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).style.visibility = 'hidden';
  }

  async save() {
    const f = this.form;
    const missing: string[] = [];
    if (!f.title.trim()) missing.push('título');
    if (!f.excerpt.trim()) missing.push('bajada');
    if (!f.source.trim()) missing.push('fuente');
    if (!f.dateISO) missing.push('fecha');
    if (!f.linkUrl.trim()) missing.push('URL de la noticia');
    if (!f.imageUrl.trim()) missing.push('URL de la imagen');
    if (missing.length) {
      this.formError.set(`Faltan campos: ${missing.join(', ')}.`);
      return;
    }

    const payload: Omit<NewsItem, 'id'> = {
      title: f.title.trim(),
      excerpt: f.excerpt.trim(),
      source: f.source.trim(),
      date: f.dateISO,
      dateText: (f.dateText || isoToTexto(f.dateISO)).trim(),
      linkUrl: f.linkUrl.trim(),
      imageUrl: f.imageUrl.trim(),
      gradient: f.gradient,
      tag: f.tag.trim(),
    };

    this.saving.set(true);
    this.formError.set('');
    try {
      const id = this.editingId();
      if (id) {
        await this.adminSvc.updateNews(id, payload);
      } else {
        await this.adminSvc.createNews(payload);
      }
      this.showForm.set(false);
      await this.load();
    } catch (err: any) {
      this.formError.set(err?.message || 'No se pudo guardar. Revisa tu conexión y permisos.');
    } finally {
      this.saving.set(false);
    }
  }

  async remove(n: NewsItem) {
    if (!n.id) return;
    if (!confirm(`¿Eliminar la noticia "${n.title}"? Desaparecerá del home.`)) return;
    try {
      await this.adminSvc.deleteNews(n.id);
      await this.load();
    } catch (err: any) {
      alert(err?.message || 'No se pudo eliminar.');
    }
  }
}
