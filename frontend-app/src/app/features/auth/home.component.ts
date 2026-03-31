import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- NAVBAR GLASSMORPHISM -->
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="nav-container">
        <div class="nav-logo" (click)="scrollToTop()">
          <span class="text-gradient">EstudiaUni</span>.cl
        </div>
        
        <div class="nav-links">
          <a (click)="scrollTo('features')">Características</a>
          <a (click)="scrollTo('pricing')">Precios</a>
          <a (click)="scrollTo('testimonials')">Testimonios</a>
          <a (click)="scrollTo('universidades')">Universidades</a>
        </div>
        
        <div class="nav-actions">
          <button class="btn btn-ghost" (click)="goTo('/login')">Iniciar Sesión</button>
          <button class="btn btn-primary" (click)="goTo('/register')">Crear Cuenta</button>
        </div>
        
        <button class="mobile-menu-btn" (click)="mobileMenuOpen = !mobileMenuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen">
        <a (click)="scrollTo('features'); mobileMenuOpen = false">Características</a>
        <a (click)="scrollTo('pricing'); mobileMenuOpen = false">Precios</a>
        <a (click)="scrollTo('testimonials'); mobileMenuOpen = false">Testimonios</a>
        <hr>
        <button class="btn btn-ghost w-full" (click)="goTo('/login')">Iniciar Sesión</button>
        <button class="btn btn-primary w-full" (click)="goTo('/register')">Crear Cuenta</button>
      </div>
    </nav>

    <div class="home-container">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">🚀 La forma inteligente de preparar la PAES</div>
          
          <h1 class="hero-title">
            Prepárate para la <span class="text-gradient">PAES</span><br>con Inteligencia Artificial
          </h1>
          
          <p class="hero-subtitle">
            La plataforma líder en Chile para tu admisión universitaria.<br>
            Práctica adaptativa, análisis con IA y simulacros completos.
          </p>
          
          <div class="hero-actions">
            <button class="btn btn-primary btn-large btn-glow" (click)="goTo('/register')">
              🚀 Comenzar Gratis
            </button>
            <button class="btn btn-outline btn-large" (click)="goTo('/login')">
              Iniciar Sesión →
            </button>
          </div>

          <div class="stats">
            <div class="stat-item">
              <div class="stat-number">5000+</div>
              <div class="stat-label">Preguntas</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">1000+</div>
              <div class="stat-label">Estudiantes</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">95%</div>
              <div class="stat-label">Satisfacción</div>
            </div>
          </div>
        </div>
        
        <!-- MOCKUP PLACEHOLDER -->
        <div class="hero-mockup">
          <div class="mockup-glow"></div>
          <div class="mockup-container glass-card">
            <div class="mockup-header">
              <div class="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="mockup-title">Panel del Alumno - EstudiaUni</span>
            </div>
            <div class="mockup-body">
              <div class="mockup-sidebar">
                <div class="mockup-nav-item active"></div>
                <div class="mockup-nav-item"></div>
                <div class="mockup-nav-item"></div>
                <div class="mockup-nav-item"></div>
              </div>
              <div class="mockup-content">
                <div class="mockup-card-row">
                  <div class="mockup-stat-card"></div>
                  <div class="mockup-stat-card"></div>
                  <div class="mockup-stat-card"></div>
                </div>
                <div class="mockup-chart"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- UNIVERSITY LOGOS CAROUSEL -->
      <section class="logos-section">
        <p class="logos-title">Nuestros estudiantes han ingresado a:</p>
        <div class="logos-carousel">
          <div class="logos-track">
            <div class="logo-item">Universidad de Chile</div>
            <div class="logo-item">PUC</div>
            <div class="logo-item">USACH</div>
            <div class="logo-item">Universidad de Concepción</div>
            <div class="logo-item">UTFSM</div>
            <div class="logo-item">UAI</div>
            <div class="logo-item">UDP</div>
            <div class="logo-item">UDD</div>
            <!-- Duplicados para loop infinito -->
            <div class="logo-item">Universidad de Chile</div>
            <div class="logo-item">PUC</div>
            <div class="logo-item">USACH</div>
            <div class="logo-item">Universidad de Concepción</div>
            <div class="logo-item">UTFSM</div>
            <div class="logo-item">UAI</div>
            <div class="logo-item">UDP</div>
            <div class="logo-item">UDD</div>
          </div>
        </div>
      </section>

      <!-- FEATURES BENTO BOX -->
      <section id="features" class="features-section">
        <h2 class="section-title">¿Por qué <span class="text-gradient">EstudiaUni</span>?</h2>
        
        <div class="bento-grid">
          <div class="bento-card bento-large glass-card">
            <div class="bento-icon">🎯</div>
            <h3>Práctica Adaptativa</h3>
            <p>Nuestro algoritmo inteligente analiza tu rendimiento en tiempo real y ajusta la dificultad de las preguntas. Enfócate solo en lo que realmente necesitas mejorar.</p>
            <div class="bento-visual">
              <div class="adaptive-bars">
                <div class="bar" style="height: 30%"></div>
                <div class="bar" style="height: 50%"></div>
                <div class="bar" style="height: 70%"></div>
                <div class="bar highlight" style="height: 90%"></div>
              </div>
            </div>
          </div>

          <div class="bento-card bento-large glass-card">
            <div class="bento-icon">🤖</div>
            <h3>Análisis con IA</h3>
            <p>Después de cada ensayo, GPT-4 analiza tus respuestas y te entrega retroalimentación personalizada, explicando cada error y sugiriendo estrategias de mejora.</p>
            <div class="bento-visual ai-visual">
              <div class="ai-message">
                <span class="ai-avatar">✨</span>
                <span class="ai-text">"Tu punto débil es Álgebra. Te recomiendo practicar ecuaciones cuadráticas."</span>
              </div>
            </div>
          </div>

          <div class="bento-card glass-card">
            <div class="bento-icon">📊</div>
            <h3>Simulacros PAES</h3>
            <p>Ensayos completos con tiempo real y puntaje estimado.</p>
          </div>

          <div class="bento-card glass-card">
            <div class="bento-icon">📈</div>
            <h3>Seguimiento</h3>
            <p>Visualiza tu progreso e identifica áreas de mejora.</p>
          </div>

          <div class="bento-card glass-card">
            <div class="bento-icon">🎓</div>
            <h3>Contenido Experto</h3>
            <p>Material de profesores especializados en la PAES.</p>
          </div>

          <div class="bento-card glass-card">
            <div class="bento-icon">⚡</div>
            <h3>Acceso Inmediato</h3>
            <p>Comienza gratis hoy. Sin tarjeta requerida.</p>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS SECTION -->
      <section id="testimonials" class="testimonials-section">
        <h2 class="section-title">Lo que dicen nuestros <span class="text-gradient">estudiantes</span></h2>
        
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">
                <img src="https://i.pravatar.cc/80?img=1" alt="Estudiante">
              </div>
              <div class="testimonial-info">
                <h4>Catalina Muñoz</h4>
                <p>Ingeniería Civil - PUC</p>
              </div>
            </div>
            <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"Subí 120 puntos en Matemáticas gracias a la práctica adaptativa. La IA me ayudó a entender exactamente dónde fallaba."</p>
            <div class="testimonial-score">
              <span class="score-before">680</span>
              <span class="score-arrow">→</span>
              <span class="score-after">800</span>
            </div>
          </div>

          <div class="testimonial-card featured">
            <div class="testimonial-header">
              <div class="testimonial-avatar">
                <img src="https://i.pravatar.cc/80?img=3" alt="Estudiante">
              </div>
              <div class="testimonial-info">
                <h4>Sebastián Rojas</h4>
                <p>Medicina - UChile</p>
              </div>
            </div>
            <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"Los simulacros son idénticos a la PAES real. Llegué al examen sintiéndome completamente preparado. El análisis de la IA después de cada ensayo fue clave para mejorar."</p>
            <div class="testimonial-score">
              <span class="score-before">720</span>
              <span class="score-arrow">→</span>
              <span class="score-after">850</span>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">
                <img src="https://i.pravatar.cc/80?img=5" alt="Estudiante">
              </div>
              <div class="testimonial-info">
                <h4>Fernanda López</h4>
                <p>Derecho - UDP</p>
              </div>
            </div>
            <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"Lo que más me gustó es que puedo practicar desde el celular. La plataforma es súper intuitiva y moderna."</p>
            <div class="testimonial-score">
              <span class="score-before">650</span>
              <span class="score-arrow">→</span>
              <span class="score-after">780</span>
            </div>
          </div>
        </div>
      </section>

      <!-- PRICING SECTION -->
      <section id="pricing" class="pricing-section">
        <h2 class="section-title">Planes que se adaptan a ti</h2>
        <p class="section-subtitle">Comienza gratis y actualiza cuando quieras</p>
        
        <div class="pricing-grid">
          <div class="pricing-card glass-card">
            <h3>Básico</h3>
            <div class="price">Gratis<span>/siempre</span></div>
            <ul class="pricing-features">
              <li><span class="check">✓</span> 1 Ensayo Diario</li>
              <li><span class="check">✓</span> 5 Mini-quizzes por día</li>
              <li><span class="check">✓</span> Todo el contenido Mineduc</li>
              <li><span class="x">✗</span> Análisis profundo con IA</li>
              <li><span class="x">✗</span> Estadísticas avanzadas</li>
            </ul>
            <button class="btn btn-outline w-full" (click)="goTo('/register')">Comenzar Gratis</button>
          </div>

          <div class="pricing-card glass-card premium">
            <div class="premium-badge">⭐ Recomendado</div>
            <h3>Premium</h3>
            <div class="price">$9.990<span>/mes</span></div>
            <ul class="pricing-features">
              <li><span class="check">✓</span> Ensayos Ilimitados</li>
              <li><span class="check">✓</span> Quizzes Ilimitados</li>
              <li><span class="check">✓</span> <strong>Análisis IA ilimitado</strong></li>
              <li><span class="check">✓</span> Estadísticas avanzadas</li>
              <li><span class="check">✓</span> Soporte prioritario</li>
            </ul>
            <button class="btn btn-primary w-full" (click)="goTo('/register')">Comenzar Prueba</button>
          </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="cta-section">
        <div class="cta-content glass-card">
          <h2>¿Listo para mejorar tu puntaje?</h2>
          <p>Únete a miles de estudiantes preparándose con EstudiaUni</p>
          <button class="btn btn-primary btn-large btn-glow" (click)="goTo('/register')">
            Crear Cuenta Gratis 🎓
          </button>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="text-gradient">EstudiaUni</span>.cl
            <p>La plataforma inteligente para tu PAES</p>
          </div>
          <div class="footer-links">
            <a href="#">Términos</a>
            <a href="#">Privacidad</a>
            <a href="#">Contacto</a>
          </div>
          <p class="footer-copy">© 2026 EstudiaUni. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* ===== VARIABLES & BASE ===== */
    .home-container { min-height: 100vh; }
    .w-full { width: 100%; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* ===== NAVBAR ===== */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 1rem 2rem;
      transition: all 0.3s ease;
    }
    .navbar.scrolled {
      background: rgba(13, 15, 23, 0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      padding: 0.75rem 2rem;
    }
    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-logo {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 800;
      cursor: pointer;
    }
    .nav-links {
      display: flex;
      gap: 2.5rem;
    }
    .nav-links a {
      color: var(--text-secondary);
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: #fff; }
    .nav-actions {
      display: flex;
      gap: 1rem;
    }
    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
      border: none;
      padding: 0.6rem 1.2rem;
      cursor: pointer;
      font-weight: 500;
      transition: color 0.2s;
    }
    .btn-ghost:hover { color: #fff; }
    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
    }
    .mobile-menu-btn span {
      width: 25px;
      height: 2px;
      background: #fff;
      transition: 0.3s;
    }
    .mobile-menu {
      display: none;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 2rem 2rem;
      background: rgba(13, 15, 23, 0.95);
      backdrop-filter: blur(20px);
    }
    .mobile-menu.open { display: flex; }
    .mobile-menu a {
      color: var(--text-secondary);
      padding: 0.5rem 0;
      cursor: pointer;
    }
    .mobile-menu hr {
      border: none;
      border-top: 1px solid var(--glass-border);
      margin: 0.5rem 0;
    }

    /* ===== HERO ===== */
    .hero-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 8rem 2rem 4rem;
      text-align: center;
    }
    .hero-badge {
      display: inline-block;
      padding: 0.5rem 1.25rem;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 999px;
      color: #a855f7;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 2rem;
    }
    .hero-title {
      font-family: var(--font-heading);
      font-size: 4rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }
    .hero-subtitle {
      font-size: 1.3rem;
      color: var(--text-secondary);
      max-width: 700px;
      margin: 0 auto 3rem;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3rem;
    }
    .btn-large { padding: 1rem 2.5rem; font-size: 1.1rem; }
    .btn-outline {
      background: transparent;
      border: 2px solid var(--glass-border);
      color: white;
      cursor: pointer;
      border-radius: 9999px;
      transition: all 0.2s;
    }
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--accent-primary);
    }
    
    /* Botón con brillo animado */
    .btn-glow {
      position: relative;
      animation: pulse-glow 2s ease-in-out infinite;
    }
    .btn-glow::before {
      content: '';
      position: absolute;
      inset: -3px;
      background: var(--gradient-brand);
      border-radius: inherit;
      z-index: -1;
      opacity: 0;
      animation: glow-pulse 2s ease-in-out infinite;
    }
    @keyframes pulse-glow {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    @keyframes glow-pulse {
      0%, 100% { opacity: 0; filter: blur(10px); }
      50% { opacity: 0.6; filter: blur(15px); }
    }

    .stats {
      display: flex;
      gap: 4rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 4rem;
    }
    .stat-item { text-align: center; }
    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .stat-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* ===== HERO MOCKUP ===== */
    .hero-mockup {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    .mockup-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      height: 80%;
      background: radial-gradient(ellipse, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
      filter: blur(60px);
      z-index: 0;
    }
    .mockup-container {
      position: relative;
      z-index: 1;
      border-radius: 16px;
      overflow: hidden;
      background: rgba(20, 22, 35, 0.8);
      border: 1px solid var(--glass-border);
    }
    .mockup-header {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid var(--glass-border);
    }
    .mockup-dots {
      display: flex;
      gap: 6px;
    }
    .mockup-dots span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ff5f56;
    }
    .mockup-dots span:nth-child(2) { background: #ffbd2e; }
    .mockup-dots span:nth-child(3) { background: #27c93f; }
    .mockup-title {
      flex: 1;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    .mockup-body {
      display: flex;
      min-height: 300px;
    }
    .mockup-sidebar {
      width: 60px;
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .mockup-nav-item {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    .mockup-nav-item.active {
      background: var(--gradient-brand);
    }
    .mockup-content {
      flex: 1;
      padding: 1.5rem;
    }
    .mockup-card-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .mockup-stat-card {
      flex: 1;
      height: 60px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border: 1px solid var(--glass-border);
    }
    .mockup-chart {
      height: 150px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background-image: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
    }

    /* ===== LOGOS CAROUSEL ===== */
    .logos-section {
      padding: 3rem 0;
      overflow: hidden;
      border-top: 1px solid var(--glass-border);
      border-bottom: 1px solid var(--glass-border);
      background: rgba(0, 0, 0, 0.2);
    }
    .logos-title {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 1.5rem;
    }
    .logos-carousel {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .logos-track {
      display: flex;
      gap: 4rem;
      animation: scroll-logos 30s linear infinite;
      width: max-content;
    }
    .logo-item {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      font-weight: 700;
      color: #555;
      white-space: nowrap;
      opacity: 0.6;
      transition: opacity 0.3s;
    }
    .logo-item:hover { opacity: 1; color: #888; }
    @keyframes scroll-logos {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* ===== BENTO BOX FEATURES ===== */
    .features-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 6rem 2rem;
    }
    .section-title {
      text-align: center;
      font-family: var(--font-heading);
      font-size: 2.75rem;
      font-weight: 700;
      margin-bottom: 3.5rem;
    }
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    .bento-card {
      padding: 2rem;
      border-radius: 20px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }
    .bento-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(135deg, transparent, transparent);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      transition: background 0.4s;
    }
    .bento-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(99, 102, 241, 0.25);
    }
    .bento-card:hover::before {
      background: var(--gradient-brand);
    }
    .bento-large {
      grid-column: span 2;
    }
    .bento-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: inline-block;
      transition: transform 0.4s;
    }
    .bento-card:hover .bento-icon {
      transform: scale(1.1) rotate(5deg);
      animation: bounce-icon 0.6s ease;
    }
    @keyframes bounce-icon {
      0%, 100% { transform: scale(1.1) rotate(5deg); }
      50% { transform: scale(1.2) rotate(-5deg); }
    }
    .bento-card h3 {
      font-size: 1.4rem;
      margin-bottom: 0.75rem;
      color: #fff;
      font-family: var(--font-heading);
    }
    .bento-card p {
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 0.95rem;
    }
    .bento-visual {
      margin-top: 1.5rem;
    }
    .adaptive-bars {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      height: 80px;
    }
    .adaptive-bars .bar {
      flex: 1;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      transition: all 0.3s;
    }
    .adaptive-bars .bar.highlight {
      background: var(--gradient-brand);
    }
    .ai-visual {
      background: rgba(99, 102, 241, 0.1);
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
    .ai-message {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .ai-avatar {
      font-size: 1.5rem;
    }
    .ai-text {
      color: #e2e8f0;
      font-size: 0.9rem;
      font-style: italic;
    }

    /* ===== TESTIMONIALS ===== */
    .testimonials-section {
      padding: 6rem 2rem;
      background: rgba(0, 0, 0, 0.2);
    }
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      align-items: start;
    }
    .testimonial-card {
      background: rgba(30, 35, 50, 0.6);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 2rem;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .testimonial-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }
    .testimonial-card.featured {
      border-color: var(--accent-primary);
      background: rgba(99, 102, 241, 0.08);
      transform: scale(1.02);
    }
    .testimonial-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .testimonial-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid var(--accent-primary);
    }
    .testimonial-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .testimonial-info h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #fff;
    }
    .testimonial-info p {
      font-size: 0.85rem;
      color: var(--accent-primary);
    }
    .testimonial-stars {
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    .testimonial-text {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
    }
    .testimonial-score {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-heading);
      font-weight: 700;
    }
    .score-before {
      color: #ef4444;
      font-size: 1.1rem;
    }
    .score-arrow {
      color: var(--text-secondary);
    }
    .score-after {
      color: #10b981;
      font-size: 1.3rem;
    }

    /* ===== PRICING ===== */
    .pricing-section {
      max-width: 900px;
      margin: 0 auto;
      padding: 6rem 2rem;
      text-align: center;
    }
    .section-subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin-top: -2rem;
      margin-bottom: 3rem;
    }
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
    .pricing-card {
      padding: 2.5rem;
      border-radius: 20px;
      text-align: left;
      position: relative;
    }
    .pricing-card.premium {
      border: 2px solid var(--accent-primary);
      background: rgba(99, 102, 241, 0.05);
    }
    .premium-badge {
      position: absolute;
      top: -12px;
      right: 2rem;
      background: var(--gradient-brand);
      padding: 0.3rem 1rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .pricing-card h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: #fff;
    }
    .price {
      font-size: 3rem;
      font-weight: 800;
      font-family: var(--font-heading);
      margin-bottom: 1.5rem;
    }
    .price span {
      font-size: 1rem;
      color: var(--text-secondary);
      font-weight: 400;
    }
    .pricing-features {
      list-style: none;
      margin-bottom: 2rem;
    }
    .pricing-features li {
      padding: 0.6rem 0;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .check { color: #10b981; }
    .x { color: #ef4444; }

    /* ===== CTA SECTION ===== */
    .cta-section {
      padding: 4rem 2rem;
    }
    .cta-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
      padding: 4rem;
      border-radius: 24px;
    }
    .cta-content h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-family: var(--font-heading);
    }
    .cta-content p {
      color: var(--text-secondary);
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    /* ===== FOOTER ===== */
    .footer {
      border-top: 1px solid var(--glass-border);
      padding: 3rem 2rem;
      text-align: center;
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }
    .footer-brand {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }
    .footer-brand p {
      font-size: 0.9rem;
      color: var(--text-secondary);
      font-family: var(--font-body);
      font-weight: 400;
    }
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin: 1.5rem 0;
    }
    .footer-links a {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .footer-links a:hover { color: #fff; }
    .footer-copy {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .bento-grid { grid-template-columns: repeat(2, 1fr); }
      .bento-large { grid-column: span 2; }
      .testimonials-grid { grid-template-columns: 1fr; max-width: 500px; }
      .testimonial-card.featured { transform: none; }
    }
    @media (max-width: 768px) {
      .nav-links, .nav-actions { display: none; }
      .mobile-menu-btn { display: flex; }
      .hero-title { font-size: 2.5rem; }
      .hero-subtitle { font-size: 1.1rem; }
      .stats { gap: 2rem; }
      .bento-grid { grid-template-columns: 1fr; }
      .bento-large { grid-column: span 1; }
      .pricing-grid { grid-template-columns: 1fr; }
      .section-title { font-size: 2rem; }
      .mockup-body { min-height: 200px; }
      .mockup-sidebar { display: none; }
    }
  `]
})
export class HomeComponent {
  private router = inject(Router);
  isScrolled = false;
  mobileMenuOpen = false;

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
