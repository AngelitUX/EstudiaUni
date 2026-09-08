import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface FaqItem {
  q: string;
  a: string;
  icon: string;
}

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="soporte-page">

      <!-- HEADER -->
      <header class="soporte-header">
        <div class="soporte-header-bg">
          <div class="header-orb orb-1"></div>
          <div class="header-orb orb-2"></div>
          <div class="header-orb orb-3"></div>
        </div>
        <div class="soporte-header-content">
          <a routerLink="/" class="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Volver al inicio
          </a>
          <div class="soporte-hero">
            <div class="soporte-icon-wrap">
              <span class="soporte-hero-icon">🎧</span>
            </div>
            <h1>Centro de <span class="text-gradient">Soporte</span></h1>
            <p class="soporte-hero-sub">Estamos aquí para ayudarte. Encuentra respuestas rápidas o contáctanos directamente.</p>

            <!-- Quick search bar (visual) -->
            <div class="search-bar-wrap">
              <span class="search-icon">🔍</span>
              <input
                type="text"
                class="search-bar"
                placeholder="¿En qué podemos ayudarte?"
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
                id="soporte-search-input"
              />
            </div>
          </div>
        </div>
      </header>

      <div class="soporte-body">

        <!-- QUICK ACTIONS -->
        <section class="quick-actions-section">
          <div class="quick-actions-grid">
            <a href="mailto:contacto.estudiauni&#64;gmail.com" class="quick-action-card clickable" id="quick-email">
              <div class="qa-icon">📧</div>
              <div class="qa-text">
                <h3>Email</h3>
                <p><span class="email-user">contacto.estudiauni&#64;</span><span class="email-domain">gmail.com</span></p>
              </div>
              <span class="qa-arrow">↗</span>
            </a>
            <div class="quick-action-card" id="quick-hours">
              <div class="qa-icon">⏰</div>
              <div class="qa-text">
                <h3>Horario</h3>
                <p>Lun–Vie · 9:00–18:00</p>
              </div>
            </div>
            <div class="quick-action-card" id="quick-response">
              <div class="qa-icon">⚡</div>
              <div class="qa-text">
                <h3>Tiempo de respuesta</h3>
                <p>Menos de 24 horas</p>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section class="faq-soporte-section">
          <h2 class="section-title-soporte">Preguntas <span class="text-gradient">Frecuentes</span></h2>
          <p class="section-sub-soporte">Las respuestas a los problemas más comunes</p>

          <div class="faq-soporte-grid">
            <div
              *ngFor="let faq of filteredFaqs(); let i = index"
              class="faq-soporte-card"
              [class.open]="openFaq === i"
              (click)="toggleFaq(i)"
              [id]="'faq-item-' + i"
            >
              <div class="faq-soporte-header">
                <span class="faq-cat-icon">{{ faq.icon }}</span>
                <span class="faq-soporte-q">{{ faq.q }}</span>
                <span class="faq-toggle-icon">{{ openFaq === i ? '−' : '+' }}</span>
              </div>
              <div class="faq-soporte-body" [class.visible]="openFaq === i">
                <p>{{ faq.a }}</p>
              </div>
            </div>

            <div *ngIf="filteredFaqs().length === 0" class="no-results">
              <span>😕</span>
              <p>No encontramos resultados para "{{ searchQuery }}"</p>
              <p class="no-results-hint">Intenta con otras palabras o contáctanos directamente.</p>
            </div>
          </div>
        </section>

        <!-- CONTACT FORM -->
        <section class="contact-section">
          <div class="contact-card">
            <div class="contact-left">
              <div class="contact-left-icon">🤝</div>
              <h2>¿No encontraste lo que buscabas?</h2>
              <p>Cuéntanos tu problema y te respondemos lo antes posible. Nuestro equipo está listo para ayudarte.</p>
              <ul class="contact-tips">
                <li>✅ Describe tu problema con detalle</li>
                <li>✅ Adjunta tu correo para recibir respuesta</li>
                <li>✅ Indica si eres usuario Básico o Pro</li>
              </ul>
            </div>
            <div class="contact-right">
              <form class="contact-form" (ngSubmit)="sendMessage()" #contactFormRef="ngForm">
                <div class="form-group">
                  <label for="contact-name">Nombre</label>
                  <input
                    type="text"
                    id="contact-name"
                    [(ngModel)]="formData.name"
                    name="name"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="contact-email">Correo electrónico</label>
                  <input
                    type="email"
                    id="contact-email"
                    [(ngModel)]="formData.email"
                    name="email"
                    placeholder="tu@correo.cl"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="contact-category">Categoría</label>
                  <select id="contact-category" [(ngModel)]="formData.category" name="category">
                    <option value="">Selecciona una categoría</option>
                    <option value="cuenta">Cuenta y acceso</option>
                    <option value="pago">Pagos y Plan Pro</option>
                    <option value="tecnico">Problema técnico</option>
                    <option value="contenido">Contenido y preguntas</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="contact-message">Mensaje</label>
                  <textarea
                    id="contact-message"
                    [(ngModel)]="formData.message"
                    name="message"
                    placeholder="Describe tu problema o pregunta con el mayor detalle posible..."
                    rows="5"
                    required
                  ></textarea>
                </div>
                <div *ngIf="submitSuccess" class="form-success">
                  <span>✅</span> Abrimos tu correo con el mensaje listo. Si no se abrió, escríbenos directamente a <strong>{{ supportEmail }}</strong>.
                </div>
                <div *ngIf="submitError" class="form-error">
                  <span>❌</span> No pudimos abrir tu correo. Escríbenos directamente a <strong>{{ supportEmail }}</strong>.
                </div>
                <button
                  type="submit"
                  class="btn-send"
                  [disabled]="sending"
                  id="contact-submit-btn"
                >
                  <span *ngIf="!sending">📤 Enviar mensaje</span>
                  <span *ngIf="sending">⏳ Abriendo tu correo...</span>
                </button>
                <p class="form-mail-note">
                  Al enviar se abrirá tu aplicación de correo con el mensaje redactado hacia
                  <a [href]="'mailto:' + supportEmail">{{ supportEmail }}</a>. También puedes escribirnos ahí directamente.
                </p>
              </form>
            </div>
          </div>
        </section>

        <!-- USEFUL LINKS -->
        <section class="useful-links-section">
          <h2 class="section-title-soporte">Recursos <span class="text-gradient">Útiles</span></h2>
          <div class="useful-links-grid">
            <a routerLink="/dashboard" class="useful-link-card" id="link-dashboard">
              <span class="ul-icon">🏠</span>
              <span class="ul-text">Ir al Dashboard</span>
              <span class="ul-arrow">→</span>
            </a>
            <a routerLink="/ensayos" class="useful-link-card" id="link-ensayos">
              <span class="ul-icon">📝</span>
              <span class="ul-text">Ensayos PAES</span>
              <span class="ul-arrow">→</span>
            </a>
            <a routerLink="/ruta" class="useful-link-card" id="link-ruta">
              <span class="ul-icon">🗺️</span>
              <span class="ul-text">Ruta de Aprendizaje</span>
              <span class="ul-arrow">→</span>
            </a>
            <a routerLink="/calculadora-nem" class="useful-link-card" id="link-nem">
              <span class="ul-icon">🧮</span>
              <span class="ul-text">Calculadora NEM</span>
              <span class="ul-arrow">→</span>
            </a>
          </div>
        </section>

      </div>

      <!-- FOOTER SIMPLE -->
      <footer class="soporte-footer">
        <p>© 2026 EstudiaUni · <a routerLink="/">Inicio</a> · <a routerLink="/soporte">Soporte</a></p>
      </footer>

    </div>
  `,
  styles: [`
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 160px; height: auto; object-fit: contain; margin: 12px auto 0 auto; animation: floatLogo 3.5s ease-in-out infinite; }
    :host { display: block; }

    .soporte-page {
      min-height: 100vh;
      background: var(--bg-color, #f8f9fc);
      color: var(--text-primary, #111827);
      font-family: var(--font-body, 'Inter', sans-serif);
    }

    /* ── GRADIENT TEXT ── */
    .text-gradient {
      background: linear-gradient(135deg, #855cd6, #6b46b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── HEADER ── */
    .soporte-header {
      position: relative;
      overflow: hidden;
      padding: 2rem 1.5rem 3.5rem;
      background: linear-gradient(180deg, rgba(133,92,214,0.12) 0%, rgba(133,92,214,0.05) 60%, var(--bg-color, #f8f9fc) 100%);
      border-bottom: 1px solid var(--glass-border, #e5e7eb);
    }
    .soporte-header-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }
    .header-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: orbFloat 8s ease-in-out infinite alternate;
    }
    .orb-1 { width: 400px; height: 400px; background: rgba(139,92,246,0.22); top: -100px; left: -80px; }
    .orb-2 { width: 350px; height: 350px; background: rgba(59,130,246,0.16); bottom: -80px; right: -60px; animation-delay: -3s; }
    .orb-3 { width: 280px; height: 280px; background: rgba(167,139,250,0.10); top: 50px; right: 30%; animation-delay: -6s; }
    @keyframes orbFloat { from { transform: translateY(0px) scale(1); } to { transform: translateY(-30px) scale(1.08); } }

    .soporte-header-content { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--text-secondary, #6b7280);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s;
      margin-bottom: 2rem;
    }
    .back-btn:hover { color: #855cd6; }

    .soporte-hero { text-align: center; }
    .soporte-icon-wrap {
      width: 80px; height: 80px;
      background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2));
      border: 1.5px solid rgba(167,139,250,0.3);
      border-radius: 24px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.5rem;
      backdrop-filter: blur(12px);
    }
    .soporte-hero-icon { font-size: 2.2rem; }
    .soporte-hero h1 {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 900;
      letter-spacing: -0.04em;
      margin: 0 0 0.75rem;
      line-height: 1.1;
      color: var(--text-primary, #111827);
      font-family: var(--font-heading, 'Inter', sans-serif);
    }
    .soporte-hero-sub {
      font-size: 1.1rem;
      color: var(--text-secondary, #6b7280);
      max-width: 520px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }

    /* ── SEARCH BAR ── */
    .search-bar-wrap {
      position: relative;
      max-width: 500px;
      margin: 0 auto;
    }
    .search-icon {
      position: absolute;
      left: 1.1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
      color: var(--text-muted, #9ca3af);
      pointer-events: none;
    }
    .search-bar {
      width: 100%;
      padding: 0.95rem 1.5rem 0.95rem 3rem;
      background: #ffffff;
      border: 1.5px solid var(--glass-border, #e5e7eb);
      border-radius: 14px;
      color: var(--text-primary, #111827);
      font-size: 1rem;
      font-family: var(--font-body, 'Inter', sans-serif);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .search-bar:focus { border-color: #855cd6; box-shadow: 0 0 0 3px rgba(133,92,214,0.15); }
    .search-bar::placeholder { color: var(--text-muted, #9ca3af); }

    /* ── BODY ── */
    .soporte-body { max-width: 1100px; margin: 0 auto; padding: 3rem 1.5rem; }

    /* ── QUICK ACTIONS ── */
    .quick-actions-section { margin-bottom: 4rem; }
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }
    .quick-action-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--bg-secondary, #f1f5f9);
      border: 1.5px solid var(--glass-border, #e5e7eb);
      border-radius: 16px;
      padding: 1.6rem 1.5rem;
      min-height: 120px;
      text-decoration: none;
      color: var(--text-primary, #111827);
      transition: all 0.25s;
      cursor: default;
    }
    /* Clickable card (Email) — stands out with accent border + glow + pointer */
    .quick-action-card.clickable {
      cursor: pointer;
      border: 2px solid rgba(133,92,214,0.45);
      background: linear-gradient(135deg, rgba(133,92,214,0.08), rgba(255,255,255,0.95));
      position: relative;
      box-shadow: 0 6px 16px rgba(133,92,214,0.12);
    }
    .quick-action-card.clickable:hover {
      border-color: rgba(133,92,214,0.7);
      background: linear-gradient(135deg, rgba(133,92,214,0.12), rgba(255,255,255,1));
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(139,92,246,0.18);
    }
    .quick-action-card.clickable:focus-visible {
      outline: 3px solid rgba(133,92,214,0.35);
      outline-offset: 2px;
    }
    .qa-arrow {
      margin-left: auto;
      font-size: 1.1rem;
      color: #855cd6;
      font-weight: 700;
      opacity: 0.7;
      transition: transform 0.2s, opacity 0.2s;
      flex-shrink: 0;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      align-self: center;
    }
    .quick-action-card.clickable .qa-arrow {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background: rgba(133,92,214,0.15);
      box-shadow: 0 3px 10px rgba(133,92,214,0.18);
      font-size: 0.95rem;
      opacity: 1;
    }
    .quick-action-card.clickable:hover .qa-arrow {
      transform: translate(2px, -2px);
      background: rgba(133,92,214,0.25);
    }
    .qa-icon { font-size: 2rem; flex-shrink: 0; }
    .qa-text { flex: 1; min-width: 80px; }
    .qa-text h3 { font-size: 0.95rem; font-weight: 700; color: var(--text-primary, #111827); margin: 0 0 0.2rem; }
    .qa-text p { font-size: 0.85rem; color: var(--text-secondary, #6b7280); margin: 0; overflow-wrap: anywhere; }
    .email-user,
    .email-domain { display: block; }

    /* ── SECTION TITLES ── */
    .section-title-soporte {
      font-size: clamp(1.6rem, 4vw, 2.2rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 0 0 0.5rem;
      color: var(--text-primary, #111827);
      font-family: var(--font-heading, 'Inter', sans-serif);
    }
    .section-sub-soporte { color: var(--text-secondary, #6b7280); font-size: 1rem; margin: 0 0 2rem; }

    /* ── FAQ ── */
    .faq-soporte-section { margin-bottom: 4rem; }
    .faq-soporte-grid { display: flex; flex-direction: column; gap: 0.8rem; }
    .faq-soporte-card {
      background: var(--bg-secondary, #f1f5f9);
      border: 1.5px solid var(--glass-border, #e5e7eb);
      border-radius: 14px;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .faq-soporte-card:hover { border-color: rgba(133,92,214,0.35); }
    .faq-soporte-card.open {
      border-color: rgba(133,92,214,0.45);
      box-shadow: 0 4px 20px rgba(139,92,246,0.08);
    }
    .faq-soporte-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
    }
    .faq-cat-icon { font-size: 1.3rem; flex-shrink: 0; }
    .faq-soporte-q { flex: 1; font-weight: 600; font-size: 0.95rem; color: var(--text-primary, #111827); }
    .faq-toggle-icon {
      font-size: 1.5rem;
      font-weight: 300;
      color: #855cd6;
      flex-shrink: 0;
      line-height: 1;
      width: 24px;
      text-align: center;
    }
    .faq-soporte-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease;
    }
    .faq-soporte-body.visible { max-height: 300px; }
    .faq-soporte-body p {
      margin: 0;
      padding: 0 1.5rem 1.25rem 3.8rem;
      color: var(--text-secondary, #6b7280);
      line-height: 1.65;
      font-size: 0.9rem;
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary, #6b7280);
    }
    .no-results span { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
    .no-results p { margin: 0; font-size: 1rem; }
    .no-results-hint { margin-top: 0.5rem !important; font-size: 0.85rem !important; }

    /* ── CONTACT FORM ── */
    .contact-section { margin-bottom: 4rem; }
    .contact-card {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 3rem;
      background: var(--bg-secondary, #f1f5f9);
      border: 1.5px solid var(--glass-border, #e5e7eb);
      border-radius: 24px;
      padding: 3rem;
    }
    .contact-left-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .contact-left h2 {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 0.75rem;
      color: var(--text-primary, #111827);
      font-family: var(--font-heading, 'Inter', sans-serif);
    }
    .contact-left p { color: var(--text-secondary, #6b7280); line-height: 1.6; font-size: 0.9rem; margin: 0 0 1.5rem; }
    .contact-tips { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
    .contact-tips li { font-size: 0.875rem; color: var(--text-secondary, #6b7280); }

    .contact-form { display: flex; flex-direction: column; gap: 1.1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label {
      font-size: 0.82rem; font-weight: 600;
      color: var(--text-muted, #9ca3af);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
      background: var(--bg-color, #ffffff);
      border: 1.5px solid var(--glass-border, #e5e7eb);
      border-radius: 10px;
      padding: 0.8rem 1rem;
      color: var(--text-primary, #111827);
      font-size: 0.93rem;
      font-family: var(--font-body, 'Inter', sans-serif);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      resize: vertical;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #855cd6;
      box-shadow: 0 0 0 3px rgba(133,92,214,0.12);
    }
    .form-group input::placeholder,
    .form-group textarea::placeholder { color: var(--text-muted, #9ca3af); }

    .form-success {
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.3);
      border-radius: 10px;
      padding: 0.85rem 1rem;
      color: #059669;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .form-error {
      background: rgba(239,68,68,0.08);
      border: 1px solid rgba(239,68,68,0.25);
      border-radius: 10px;
      padding: 0.85rem 1rem;
      color: #dc2626;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .form-mail-note { font-size: 0.78rem; color: var(--text-muted, #9ca3af); line-height: 1.5; margin: 0.25rem 0 0; }
    .form-mail-note a { color: #855cd6; text-decoration: none; }
    .form-mail-note a:hover { text-decoration: underline; }

    .btn-send {
      background: linear-gradient(135deg, #855cd6, #6b46b8);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 0.95rem 2rem;
      font-size: 1rem;
      font-weight: 700;
      font-family: var(--font-body, 'Inter', sans-serif);
      cursor: pointer;
      transition: all 0.25s;
      box-shadow: 0 4px 20px rgba(133,92,214,0.3);
    }
    .btn-send:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(133,92,214,0.4); }
    .btn-send:disabled { opacity: 0.6; cursor: not-allowed; }

    /* ── USEFUL LINKS ── */
    .useful-links-section { margin-bottom: 3rem; }
    .useful-links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    .useful-link-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      background: var(--bg-secondary, #f1f5f9);
      border: 1.5px solid var(--glass-border, #e5e7eb);
      border-radius: 14px;
      padding: 1.1rem 1.25rem;
      text-decoration: none;
      color: var(--text-primary, #111827);
      transition: all 0.22s;
    }
    .useful-link-card:hover {
      border-color: rgba(133,92,214,0.4);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(133,92,214,0.1);
      color: #855cd6;
    }
    .ul-icon { font-size: 1.4rem; }
    .ul-text { flex: 1; font-weight: 600; font-size: 0.92rem; }
    .ul-arrow { color: var(--text-muted, #9ca3af); font-size: 1.1rem; transition: transform 0.2s; }
    .useful-link-card:hover .ul-arrow { transform: translateX(4px); color: #855cd6; }

    /* ── FOOTER ── */
    .soporte-footer {
      border-top: 1.5px solid var(--glass-border, #e5e7eb);
      padding: 1.5rem;
      text-align: center;
    }
    .soporte-footer p { margin: 0; color: var(--text-muted, #9ca3af); font-size: 0.85rem; }
    .soporte-footer a { color: #855cd6; text-decoration: none; }
    .soporte-footer a:hover { text-decoration: underline; }

    /* ── RESPONSIVE ── */
    .search-bar,
    .form-group input,
    .form-group select,
    .form-group textarea {
      font-size: 16px; /* Prevents iOS Safari auto-zoom on input focus */
    }
    .qa-text p {
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    @media (max-width: 768px) {
      .contact-card { grid-template-columns: 1fr; padding: 2rem 1.25rem; gap: 2rem; }
      .quick-actions-grid { grid-template-columns: repeat(2, 1fr); }
      .soporte-body { padding: 2rem 1rem; }
    }
    @media (max-width: 640px) {
      .soporte-header { padding: 1.25rem 1rem 2.25rem; }
      .soporte-hero-icon { font-size: 1.8rem; }
      .soporte-icon-wrap { width: 64px; height: 64px; border-radius: 18px; margin-bottom: 1rem; }
      .soporte-hero h1 { font-size: 1.85rem; }
      .soporte-hero-sub { font-size: 0.95rem; margin-bottom: 1.5rem; }
      .quick-actions-grid { grid-template-columns: 1fr; gap: 0.85rem; }
      .useful-links-grid { grid-template-columns: 1fr; gap: 0.75rem; }
      .contact-card { padding: 1.5rem 1rem; border-radius: 18px; }
      .btn-send { width: 100%; min-height: 48px; }
    }
    @media (max-width: 480px) {
      .faq-soporte-header { padding: 1rem; gap: 0.75rem; }
      .faq-soporte-body p { padding: 0 1rem 1rem 2.8rem; }
    }
  `]
})
export class SoporteComponent implements OnInit, OnDestroy {
  private document = inject(DOCUMENT);
  private faqSchemaScript?: HTMLScriptElement;

  readonly supportEmail = 'contacto.estudiauni@gmail.com';

  searchQuery = '';
  openFaq: number | null = null;
  sending = false;
  submitSuccess = false;
  submitError = false;

  formData = {
    name: '',
    email: '',
    category: '',
    message: ''
  };

  ngOnInit() {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.allFaqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a }
      }))
    };
    this.faqSchemaScript = this.document.createElement('script');
    this.faqSchemaScript.type = 'application/ld+json';
    this.faqSchemaScript.text = JSON.stringify(faqSchema);
    this.document.head.appendChild(this.faqSchemaScript);
  }

  ngOnDestroy() {
    this.faqSchemaScript?.remove();
  }

  private readonly allFaqs: FaqItem[] = [
    {
      q: '¿Cómo creo una cuenta en EstudiaUni?',
      a: 'Haz clic en "Crear Cuenta" desde la página de inicio, ingresa tu correo electrónico y una contraseña segura. Te enviaremos un correo de verificación. Una vez verificado, ya puedes acceder a la plataforma.',
      icon: '👤'
    },
    {
      q: '¿Cuál es la diferencia entre el Plan Básico y el Plan Pro?',
      a: 'El Plan Básico es completamente gratuito e incluye 1 ensayo PAES cada 48 horas, acceso a 1 capítulo de la Ruta de Aprendizaje y consultas limitadas al Tutor IA. El Plan Pro desbloquea ensayos ilimitados, la Ruta completa, acceso total a Foco (Tutor IA), Mini-Ensayos y Mente Veloz sin restricciones.',
      icon: '💎'
    },
    {
      q: '¿Cómo puedo cambiar o recuperar mi contraseña?',
      a: 'En la pantalla de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Ingresa tu correo y recibirás un enlace para restablecerla. Si no lo ves, revisa tu carpeta de spam.',
      icon: '🔑'
    },
    {
      q: '¿Cómo funciona el pago del Plan Pro?',
      a: 'El Plan Pro es un pase de acceso por tiempo definido (1 mes o 1 año) que se paga con un cobro único, no una suscripción con renovación automática. Puedes pagar con tarjetas de crédito y débito a través de Flow, o por transferencia bancaria que un administrador verifica manualmente. Si eliges el pase anual obtienes un 41% de descuento frente a 12 meses sueltos. Al vencer el período, tu cuenta vuelve al Plan Básico hasta que compres un nuevo pase.',
      icon: '💳'
    },
    {
      q: '¿El Plan Pro se renueva o se me cobra automáticamente?',
      a: 'No. Al ser un pago único por un período definido, nunca se te vuelve a cobrar de forma automática y no hay nada que "cancelar": el pase simplemente expira en la fecha que aparece en tu perfil. Si compras un nuevo pase mientras aún te quedan días vigentes, los días nuevos se suman a los que tenías. No se realizan reembolsos parciales por el tiempo no utilizado.',
      icon: '🔄'
    },
    {
      q: 'El Tutor IA (Foco) no está respondiendo, ¿qué hago?',
      a: 'Primero verifica tu conexión a internet. Si el problema persiste, intenta recargar la página. Si continúa sin funcionar, puede ser una mantención programada. Puedes escribirnos al soporte y te avisaremos cuando esté restaurado.',
      icon: '🤖'
    },
    {
      q: '¿Por qué no puedo acceder a ciertos módulos de la Ruta de Aprendizaje?',
      a: 'En el Plan Básico solo tienes acceso al primer capítulo de cada materia. Para desbloquear el acceso completo a la Ruta de Aprendizaje, necesitas el Plan Pro. Algunos módulos pueden estar aún en desarrollo.',
      icon: '🗺️'
    },
    {
      q: '¿Los ensayos PAES son los oficiales del DEMRE?',
      a: 'Sí. Nuestro banco de preguntas incluye preguntas oficiales del DEMRE de años anteriores, debidamente categorizadas por materia y dificultad. También incluimos ensayos simulados basados en los temarios oficiales vigentes.',
      icon: '📝'
    },
    {
      q: '¿Cómo funciona la Calculadora NEM?',
      a: 'La calculadora NEM te permite ingresar tus notas anuales de enseñanza media para obtener tu puntaje NEM estimado según la fórmula oficial del DEMRE. Es completamente gratuita y no requiere registrarte.',
      icon: '🧮'
    },
    {
      q: '¿Cómo elimino mi cuenta?',
      a: 'Para eliminar tu cuenta, envíanos un correo a contacto.estudiauni@gmail.com desde la dirección de tu cuenta con el asunto "Eliminar cuenta". Procesamos la solicitud en un plazo máximo de 5 días hábiles.',
      icon: '🗑️'
    }
  ];

  filteredFaqs() {
    if (!this.searchQuery.trim()) return this.allFaqs;
    const q = this.searchQuery.toLowerCase();
    return this.allFaqs.filter(f =>
      f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }

  onSearch() {
    this.openFaq = null;
  }

  toggleFaq(i: number) {
    this.openFaq = this.openFaq === i ? null : i;
  }

  private readonly categoryLabels: Record<string, string> = {
    cuenta: 'Cuenta y acceso',
    pago: 'Pagos y Plan Pro',
    tecnico: 'Problema técnico',
    contenido: 'Contenido y preguntas',
    otro: 'Otro'
  };

  sendMessage() {
    if (!this.formData.name || !this.formData.email || !this.formData.message) return;
    this.sending = true;
    this.submitSuccess = false;
    this.submitError = false;

    const categoria = this.categoryLabels[this.formData.category] || 'Consulta general';
    const subject = `[Soporte EstudiaUni] ${categoria} — ${this.formData.name}`;
    const body =
      `Nombre: ${this.formData.name}\n` +
      `Correo de contacto: ${this.formData.email}\n` +
      `Categoría: ${categoria}\n` +
      `\n--- Mensaje ---\n${this.formData.message}\n`;
    const mailto = `mailto:${this.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const w = this.document.defaultView;
      if (w) {
        w.location.href = mailto;
      } else {
        throw new Error('no window');
      }
      this.submitSuccess = true;
      this.formData = { name: '', email: '', category: '', message: '' };
      setTimeout(() => { this.submitSuccess = false; }, 8000);
    } catch {
      this.submitError = true;
      setTimeout(() => { this.submitError = false; }, 8000);
    } finally {
      this.sending = false;
    }
  }
}
