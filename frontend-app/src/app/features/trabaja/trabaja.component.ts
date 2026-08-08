import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trabaja',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- DYNAMIC BACKGROUND -->
    <div class="trabaja-bg">
      <div class="bg-blob blob-purple"></div>
      <div class="bg-blob blob-blue"></div>
      <div class="bg-blob blob-pink"></div>
      <div class="grid-overlay"></div>
    </div>

    <main class="trabaja-main">

      <div class="trabaja-top-nav">
        <a routerLink="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Volver al inicio
        </a>
      </div>

      <!-- HERO -->
      <section class="hero-section">
        <div class="trabaja-icon-wrap">
          <span class="trabaja-hero-icon">🤝</span>
        </div>
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Programa de Creadores
        </div>
        <h1 class="hero-title">
          Únete al equipo de<br>
          <span class="text-gradient">Embajadores EstudiaUni</span>
        </h1>
        <p class="hero-subtitle">
          Comparte la plataforma con tu comunidad y genera ingresos reales por cada estudiante que se una gracias a ti. Sin límite de ganancias.
        </p>
        <div class="hero-cta">
          <a href="mailto:contacto@estudiauni.cl?subject=Quiero ser Embajador EstudiaUni" class="btn-primary-cta">
            Postular ahora →
          </a>
          <p class="cta-note">El proceso toma menos de 2 minutos</p>
        </div>
      </section>

      <!-- BENEFIT CARDS -->
      <section class="benefits-section">
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">💰</div>
            <h3>Ingresos por Referidos</h3>
            <p>Gana comisiones por cada estudiante que se suscriba usando tu enlace o código único. Cuanto más compartes, más ganas.</p>
          </div>
          <div class="benefit-card featured-card">
            <div class="benefit-icon">📊</div>
            <h3>Panel Exclusivo</h3>
            <p>Accede a tu panel personal para ver en tiempo real tus estadísticas, conversiones y el historial de tus ganancias acumuladas.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🚀</div>
            <h3>Crece con EstudiaUni</h3>
            <p>Sé parte de la plataforma educativa más innovadora de Chile. Construye tu marca personal apoyando la educación de calidad.</p>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="how-section">
        <h2 class="section-title">¿Cómo <span class="text-gradient">funciona</span>?</h2>
        <div class="steps-container">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-connector"></div>
            <h4>Postula</h4>
            <p>Completa el formulario con tus datos y cuéntanos sobre tu comunidad o redes sociales.</p>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-connector"></div>
            <h4>Recibe tu código</h4>
            <p>Si eres aceptado, te enviaremos tu enlace y código de referido personalizado.</p>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <h4>Genera ingresos</h4>
            <p>Comparte con tu audiencia y gana por cada suscripción que se concrete gracias a ti.</p>
          </div>
        </div>
      </section>

      <!-- REQUIREMENTS -->
      <section class="req-section">
        <div class="req-card">
          <h2>¿A quién buscamos?</h2>
          <div class="req-grid">
            <div class="req-item">
              <span class="req-check">✓</span>
              <span>Estudiantes o egresados con comunidad en redes sociales</span>
            </div>
            <div class="req-item">
              <span class="req-check">✓</span>
              <span>Profesores, tutores o coaches académicos</span>
            </div>
            <div class="req-item">
              <span class="req-check">✓</span>
              <span>Influencers educativos o de lifestyle estudiantil</span>
            </div>
            <div class="req-item">
              <span class="req-check">✓</span>
              <span>Cualquier persona apasionada por la educación chilena</span>
            </div>
          </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="final-cta-section">
        <h2>¿Listo para empezar?</h2>
        <p>Escríbenos y te contamos todos los detalles del programa</p>
        <a href="mailto:contacto@estudiauni.cl?subject=Quiero ser Embajador EstudiaUni" class="btn-primary-cta">
          Contactar al equipo 🎯
        </a>
      </section>

    </main>

    <!-- FOOTER -->
    <footer class="trabaja-footer">
      <p>© 2026 EstudiaUni — Programa de Embajadores</p>
    </footer>
  `,
  styles: [`
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 160px; height: auto; object-fit: contain; margin: 12px auto 0 auto; animation: floatLogo 3.5s ease-in-out infinite; }
    :host {
      display: block;
      min-height: 100vh;
      background: #fafafa;
      color: #111827;
      font-family: 'Inter', 'Outfit', sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    /* ── BACKGROUND ── */
    .trabaja-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: #fafafa;
    }
    .bg-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.5;
      animation: floatBlob 18s infinite alternate ease-in-out;
    }
    .blob-purple {
      width: 50vw; height: 50vw;
      background: rgba(133, 92, 214, 0.4);
      top: -20vh; left: -10vw;
      animation-duration: 20s;
    }
    .blob-blue {
      width: 40vw; height: 40vw;
      background: rgba(59, 130, 246, 0.3);
      bottom: -10vh; right: -10vw;
      animation-duration: 24s;
    }
    .blob-pink {
      width: 30vw; height: 30vw;
      background: rgba(244, 114, 182, 0.2);
      top: 40vh; right: 20vw;
      opacity: 0.18;
      animation-duration: 16s;
    }
    .grid-overlay { display: none; }
    @keyframes floatBlob {
      0% { transform: translate(0,0) scale(1); }
      100% { transform: translate(3vw, 4vh) scale(1.08); }
    }

    /* ── TOP NAV ── */
    .trabaja-top-nav {
      position: relative;
      z-index: 10;
      display: flex;
      padding: 2rem 0 1rem;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: #6b7280;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s;
    }
    .back-link:hover { color: #855cd6; }

    /* ── ICON WRAP ── */
    .trabaja-icon-wrap {
      width: 80px; height: 80px;
      background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15));
      border: 1.5px solid rgba(167,139,250,0.3);
      border-radius: 24px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.5rem;
      backdrop-filter: blur(12px);
    }
    .trabaja-hero-icon { font-size: 2.2rem; }

    .text-gradient {
      background: linear-gradient(135deg, #855cd6 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* ── MAIN ── */
    .trabaja-main {
      position: relative;
      z-index: 1;
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1.5rem 4rem;
    }

    /* ── HERO ── */
    .hero-section {
      text-align: center;
      padding: 1rem 1rem 3rem;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(133, 92, 214, 0.1);
      border: 1px solid rgba(133, 92, 214, 0.25);
      border-radius: 999px;
      padding: 0.35rem 1rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #855cd6;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1.75rem;
    }
    .badge-dot {
      width: 7px; height: 7px;
      background: #855cd6;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(133, 92, 214, 0.6);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.25rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin: 0 0 1.25rem;
      color: #111827;
    }
    .hero-subtitle {
      font-size: 1.1rem;
      color: #4b5563;
      line-height: 1.7;
      max-width: 600px;
      margin: 0 auto 2.5rem;
    }
    .hero-cta { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
    .cta-note { font-size: 0.78rem; color: #9ca3af; }

    /* ── BUTTON ── */
    .btn-primary-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.9rem 2.2rem;
      background: linear-gradient(135deg, #855cd6 0%, #3b82f6 100%);
      color: #fff;
      font-weight: 700;
      font-size: 1rem;
      border-radius: 999px;
      text-decoration: none;
      box-shadow: 0 8px 32px rgba(133, 92, 214, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-primary-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(133, 92, 214, 0.45);
    }

    /* ── BENEFITS ── */
    .benefits-section { padding: 2rem 0 3rem; }
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
    .benefit-card {
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(133, 92, 214, 0.15);
      border-radius: 20px;
      padding: 2rem 1.5rem;
      text-align: center;
      transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    }
    .benefit-card:hover {
      border-color: rgba(133, 92, 214, 0.4);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(133, 92, 214, 0.12);
    }
    .featured-card {
      border-color: rgba(133, 92, 214, 0.35);
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 8px 32px rgba(133, 92, 214, 0.1);
    }
    .benefit-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .benefit-card h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.6rem;
    }
    .benefit-card p {
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.65;
      margin: 0;
    }

    /* ── HOW IT WORKS ── */
    .how-section {
      padding: 2rem 0 3rem;
      text-align: center;
    }
    .section-title {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 0 0 2.5rem;
      color: #111827;
    }
    .steps-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      position: relative;
    }
    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      position: relative;
      padding: 0 1rem;
    }
    .step-number {
      width: 52px; height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #855cd6, #3b82f6);
      display: grid;
      place-items: center;
      font-size: 1.2rem;
      font-weight: 800;
      color: #fff;
      box-shadow: 0 4px 18px rgba(133, 92, 214, 0.35);
      flex-shrink: 0;
    }
    .step-connector {
      position: absolute;
      top: 26px;
      left: calc(50% + 26px);
      width: calc(100% - 52px);
      height: 2px;
      background: linear-gradient(90deg, rgba(133, 92, 214, 0.4), rgba(59, 130, 246, 0.25));
    }
    .step-item h4 {
      font-size: 1rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    .step-item p {
      font-size: 0.82rem;
      color: #6b7280;
      line-height: 1.6;
      margin: 0;
    }

    /* ── REQUIREMENTS ── */
    .req-section { padding: 1rem 0 3rem; }
    .req-card {
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(133, 92, 214, 0.15);
      border-radius: 24px;
      padding: 2.5rem;
    }
    .req-card h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #111827;
      margin: 0 0 1.75rem;
      letter-spacing: -0.02em;
    }
    .req-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .req-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.9rem;
      color: #374151;
      line-height: 1.5;
    }
    .req-check {
      width: 22px; height: 22px;
      background: rgba(133, 92, 214, 0.12);
      border: 1px solid rgba(133, 92, 214, 0.35);
      border-radius: 6px;
      display: grid;
      place-items: center;
      font-size: 0.75rem;
      color: #855cd6;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 0.1rem;
    }

    /* ── FINAL CTA ── */
    .final-cta-section {
      text-align: center;
      padding: 2rem 1rem 1rem;
    }
    .final-cta-section h2 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #111827;
      margin: 0 0 0.5rem;
    }
    .final-cta-section p {
      color: #6b7280;
      margin: 0 0 1.75rem;
      font-size: 0.95rem;
    }

    /* ── FOOTER ── */
    .trabaja-footer {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 1.5rem;
      border-top: 1px solid rgba(133, 92, 214, 0.1);
      color: #9ca3af;
      font-size: 0.8rem;
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 700px) {
      .trabaja-top-nav { padding: 1.5rem 1rem 0.5rem; }
      .benefits-grid { grid-template-columns: 1fr; }
      .steps-container { grid-template-columns: 1fr; gap: 2rem; }
      .step-connector { display: none; }
      .req-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 480px) {
      .trabaja-main { padding: 0 1rem 3rem; }
      .hero-section { padding: 0.5rem 0 2rem; }
      .hero-subtitle { font-size: 1rem; }
      .req-card { padding: 1.5rem; }
      .req-card h2 { font-size: 1.3rem; }
      .final-cta-section h2 { font-size: 1.4rem; }
      .btn-primary-cta { padding: 0.85rem 1.5rem; font-size: 0.95rem; }
      .section-title { font-size: 1.6rem; }
    }

    @media (max-width: 380px) {
      .trabaja-icon-wrap { width: 64px; height: 64px; }
      .hero-badge { padding: 0.3rem 0.8rem; font-size: 0.72rem; }
      .req-card { padding: 1.1rem; }
    }
  `]
})
export class TrabajaComponent {}
