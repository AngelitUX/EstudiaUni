import { Component, inject, HostListener, AfterViewInit, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';

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
          <a (click)="scrollTo('testimonials')">Testimonios</a>
          <a (click)="scrollTo('pricing')">Precios</a>
        </div>
        
        <div class="nav-actions">
          <ng-container *ngIf="!isLoggedIn(); else loggedInNav">
            <button class="btn btn-ghost" (click)="goTo('/login')">Iniciar Sesión</button>
            <button class="btn btn-primary" (click)="goTo('/register')">Crear Cuenta</button>
          </ng-container>
          <ng-template #loggedInNav>
            <div class="user-profile-nav" (click)="goTo('/dashboard')">
              <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarFallback" 
                   [src]="firestoreService.profileSignal()?.photoURL" 
                   alt="Profile" class="nav-avatar">
              <ng-template #avatarFallback>
                <div class="nav-avatar-fallback">{{ profileInitial() }}</div>
              </ng-template>
              <span class="nav-enter-text">Ingresar</span>
            </div>
          </ng-template>
        </div>
        
        <button class="mobile-menu-btn" (click)="mobileMenuOpen = !mobileMenuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen">
        <a (click)="scrollTo('features'); mobileMenuOpen = false">Características</a>
        <a (click)="scrollTo('testimonials'); mobileMenuOpen = false">Testimonios</a>
        <a (click)="scrollTo('pricing'); mobileMenuOpen = false">Precios</a>
        <hr>
        <ng-container *ngIf="!isLoggedIn(); else mobileLoggedIn">
          <button class="btn btn-ghost w-full" (click)="goTo('/login')">Iniciar Sesión</button>
          <button class="btn btn-primary w-full" (click)="goTo('/register')">Crear Cuenta</button>
        </ng-container>
        <ng-template #mobileLoggedIn>
          <button class="btn btn-primary w-full" (click)="goTo('/dashboard')">
            🚀 Entrar al Panel
          </button>
        </ng-template>
      </div>
    </nav>

    <div class="home-container" [class.animations-ready]="animationsReady">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge-container">
            <div class="hero-badge">🚀 La forma inteligente de prepararse para la PAES</div>
          </div>
          
          <h1 class="hero-title">
            Prepárate para la <span class="text-gradient">PAES</span><br>con Inteligencia Artificial
          </h1>
          
          <p class="hero-subtitle">
            La plataforma líder en Chile para tu admisión universitaria.<br>
            Práctica adaptativa, análisis con IA y simulacros completos.
          </p>
          
          <div class="hero-actions">
            <ng-container *ngIf="!isLoggedIn(); else heroLoggedIn">
              <button class="btn btn-primary btn-large btn-glow" (click)="goTo('/register')">
                🚀 Comenzar Gratis
              </button>
              <button class="btn btn-outline btn-large" (click)="goTo('/login')">
                Iniciar Sesión →
              </button>
            </ng-container>
            <ng-template #heroLoggedIn>
              <button class="btn btn-primary btn-large btn-glow" (click)="goTo('/dashboard')">
                ⚡ Ir a mi Dashboard
              </button>
            </ng-template>
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
      <section class="logos-section section-fade logos-fade">
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
            <!-- Triplicados para asegurar loop infinito sin saltos -->
            <div class="logo-item">Universidad de Chile</div>
            <div class="logo-item">PUC</div>
            <div class="logo-item">USACH</div>
            <div class="logo-item">Universidad de Concepción</div>
            <div class="logo-item">UTFSM</div>
            <div class="logo-item">UAI</div>
            <div class="logo-item">UDP</div>
            <div class="logo-item">UDD</div>
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
      <section id="features" class="features-section section-fade features-fade">
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

      <!-- VIDEOS SECTION -->
      <section class="videos-section section-fade videos-fade">
        <h2 class="section-title">Mira cómo <span class="text-gradient">funciona</span></h2>
        
        <div class="videos-grid">
          <div class="video-card glass-card">
            <div class="video-placeholder">
              <div class="play-icon">▶</div>
            </div>
            <h3>Así funciona la práctica adaptativa</h3>
            <p>Descubre cómo nuestro sistema se ajusta a tu nivel</p>
          </div>

          <div class="video-card glass-card">
            <div class="video-placeholder">
              <div class="play-icon">▶</div>
            </div>
            <h3>Mira cómo GPT-4 te explica tus errores</h3>
            <p>IA que analiza y explica cada respuesta incorrecta</p>
          </div>

          <div class="video-card glass-card">
            <div class="video-placeholder">
              <div class="play-icon">▶</div>
            </div>
            <h3>Simulacros idénticos a la PAES real</h3>
            <p>Practica con ensayos que replican el examen oficial</p>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS SECTION -->
      <section id="testimonials" class="testimonials-section section-fade testimonials-fade">
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
      <section id="pricing" class="pricing-section section-fade pricing-fade">
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
            <button class="btn btn-outline w-full" (click)="goTo(isLoggedIn() ? '/dashboard' : '/register')">
              {{ isLoggedIn() ? 'Ir al Panel' : 'Comenzar Gratis' }}
            </button>
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
            <button class="btn btn-primary w-full" (click)="goTo(isLoggedIn() ? '/dashboard' : '/register')">
              {{ isLoggedIn() ? 'Ir al Panel' : 'Comenzar Prueba' }}
            </button>
          </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="cta-section section-fade cta-fade">
        <div class="cta-content glass-card">
          <h2>¿Listo para mejorar tu puntaje?</h2>
          <p>Únete a miles de estudiantes preparándose con EstudiaUni</p>
          <button class="btn btn-primary btn-large btn-glow" (click)="goTo(isLoggedIn() ? '/dashboard' : '/register')">
            {{ isLoggedIn() ? '⚡ Ir a mi Dashboard' : 'Crear Cuenta Gratis 🎓' }}
          </button>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="nav-logo" style="margin-bottom: 0.5rem;">
              <span class="text-gradient">EstudiaUni</span>.cl
            </div>
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
    .section-fade, .bento-card, .video-card, .testimonial-card, .pricing-card {
      opacity: 0;
      transform: translateY(40px) scale(0.98);
      transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform, opacity;
    }
    .is-visible {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
    }
    .w-full { width: 100%; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* ===== NAVBAR ===== */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 1.25rem 2rem;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
    }
    .navbar.scrolled {
      background: rgba(255, 255, 255, 0.98);
      border-bottom: 2px solid var(--glass-border);
      padding: 0.85rem 2rem;
      box-shadow: var(--shadow);
    }
    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }
    .nav-logo {
      font-family: var(--font-heading);
      font-size: 2.3rem;
      font-weight: 800;
      cursor: pointer;
      color: var(--text-primary);
    }
    .nav-links {
      display: flex;
      gap: 2.5rem;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .nav-links a {
      color: var(--text-secondary);
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s;
      font-size: 1.1rem;
    }
    .nav-links a:hover { color: var(--accent-primary); }
    .nav-actions {
      display: flex;
      gap: 1rem;
    }
    .btn-ghost {
      background: transparent;
      color: var(--text-primary);
      border: 2px solid var(--glass-border);
      padding: 0.6rem 1.4rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
      border-radius: 9999px;
    }
    .btn-ghost:hover { 
      background: var(--bg-secondary);
      border-color: var(--accent-primary);
    }
    .user-profile-nav {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.5rem 1.2rem;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1.5px solid rgba(133, 92, 214, 0.4);
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    .user-profile-nav:hover {
      border-color: var(--accent-primary);
      background: #ffffff;
      box-shadow: 0 8px 25px rgba(133, 92, 214, 0.15);
      transform: translateY(-2px);
    }
    .user-profile-nav::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 9999px;
      background: var(--gradient-brand);
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .user-profile-nav:hover::before {
      opacity: 0.15;
    }
    .nav-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2.5px solid #ffffff;
      box-shadow: 0 0 0 2px var(--accent-primary);
      object-fit: cover;
      transition: transform 0.3s;
    }
    .user-profile-nav:hover .nav-avatar {
      transform: scale(1.1);
    }
    .nav-avatar-fallback {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--gradient-brand);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.9rem;
      border: 2.5px solid #ffffff;
      box-shadow: 0 0 0 2px var(--accent-primary);
      transition: transform 0.3s;
    }
    .user-profile-nav:hover .nav-avatar-fallback {
      transform: scale(1.1);
    }
    .nav-enter-text {
      font-weight: 700;
      color: var(--text-primary);
      font-size: 1rem;
      letter-spacing: -0.01em;
    }
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
      background: var(--text-primary);
      transition: 0.3s;
    }
    .mobile-menu {
      display: none;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 2rem 2rem;
      background: white;
      border-bottom: 2px solid var(--glass-border);
    }
    .mobile-menu.open { display: flex; }
    .mobile-menu a {
      color: var(--text-primary);
      padding: 0.5rem 0;
      cursor: pointer;
      font-weight: 600;
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
    .hero-badge-container {
      opacity: 0;
      transform: translateY(-14px);
    }
    .hero-badge {
      display: inline-block;
      padding: 0.5rem 1.25rem;
      background: var(--accent-yellow);
      border: none;
      border-radius: 999px;
      color: var(--text-primary);
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 2rem;
      animation: float-badge 3.5s ease-in-out infinite;
      box-shadow: 0 4px 15px rgba(251, 191, 36, 0.2);
    }
    @keyframes float-badge {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .hero-title {
      font-family: var(--font-heading);
      font-size: 4rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      opacity: 0;
      transform: translateY(18px);
    }
    .hero-subtitle {
      font-size: 1.3rem;
      color: var(--text-secondary);
      max-width: 700px;
      margin: 0 auto 3rem;
      line-height: 1.6;
      opacity: 0;
      transform: translateY(18px);
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3rem;
      opacity: 0;
      transform: translateY(18px);
    }
    .btn-large { padding: 1rem 2.5rem; font-size: 1.1rem; }
    .btn-outline {
      background: white;
      border: 3px solid var(--accent-primary);
      color: var(--accent-primary);
      cursor: pointer;
      border-radius: 9999px;
      transition: all 0.2s;
      font-weight: 700;
    }
    .btn-outline:hover {
      background: var(--accent-primary);
      color: white;
      box-shadow: 0 4px 0 #6b46b8;
    }
    
    /* Eliminado botón con brillo animado - ahora simple */
    .btn-glow {
      /* Sin efectos glow */
    }

    .stats {
      display: flex;
      gap: 4rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 4rem;
    }
    .stat-item {
      text-align: center;
      opacity: 0;
      transform: scale(0.9) translateY(10px);
    }
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
    /* Eliminado glow effect */
    .mockup-container {
      position: relative;
      z-index: 1;
      border-radius: var(--border-radius);
      overflow: hidden;
      background: white;
      border: 2px solid var(--glass-border);
      box-shadow: var(--shadow);
      opacity: 0;
      transform: translateY(18px);
    }
    .home-container.animations-ready .hero-badge-container { animation: fadeInDown 0.8s ease both; }
    .home-container.animations-ready .hero-title { animation: fadeInUp 0.95s ease 0.08s both; }
    .home-container.animations-ready .hero-subtitle { animation: fadeInUp 0.95s ease 0.22s both; }
    .home-container.animations-ready .hero-actions { animation: fadeInUp 0.95s ease 0.36s both; }
    .home-container.animations-ready .stat-item { animation: popIn 0.8s ease both; }
    .home-container.animations-ready .stat-item:nth-child(1) { animation-delay: 0.46s; }
    .home-container.animations-ready .stat-item:nth-child(2) { animation-delay: 0.56s; }
    .home-container.animations-ready .stat-item:nth-child(3) { animation-delay: 0.66s; }
    .home-container.animations-ready .mockup-container { animation: fadeInUp 0.95s ease 0.5s both; }
    .home-container.animations-ready .section-fade { animation: fadeInUp 0.8s ease both; }
    .home-container.animations-ready .logos-fade { animation-delay: 0.15s; }
    .home-container.animations-ready .features-fade { animation-delay: 0.22s; }
    .home-container.animations-ready .videos-fade { animation-delay: 0.3s; }
    .home-container.animations-ready .testimonials-fade { animation-delay: 0.38s; }
    .home-container.animations-ready .pricing-fade { animation-delay: 0.46s; }
    .home-container.animations-ready .cta-fade { animation-delay: 0.54s; }
    .mockup-header {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      background: var(--bg-secondary);
      border-bottom: 2px solid var(--glass-border);
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
      background: var(--bg-secondary);
      padding: 1rem 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border-right: 2px solid var(--glass-border);
    }
    .mockup-nav-item {
      height: 8px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
    .mockup-nav-item.active {
      background: var(--accent-primary);
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
      background: var(--bg-secondary);
      border-radius: 8px;
      border: 2px solid var(--glass-border);
    }
    .mockup-chart {
      height: 150px;
      background: var(--bg-secondary);
      border-radius: 8px;
      border: 2px solid var(--glass-border);
    }

    /* ===== LOGOS CAROUSEL ===== */
    .logos-section {
      padding: 4rem 0;
      overflow: hidden;
      background: var(--bg-color);
      border-top: 2px solid var(--glass-border);
      border-bottom: 2px solid var(--glass-border);
    }
    .logos-title {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 1.5rem;
    }
    .footer-brand .nav-logo {
      font-size: 2.1rem;
      margin-bottom: 0.5rem;
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
      color: var(--text-secondary);
      white-space: nowrap;
      opacity: 0.6;
      transition: opacity 0.3s;
    }
    .logo-item:hover { opacity: 1; }
    @keyframes scroll-logos {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-100% / 3 * 1)); }
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.9) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
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
      border-radius: var(--border-radius);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      border: 2px solid var(--glass-border);
    }
    /* Eliminado efecto before con gradiente */
    .bento-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);
      border-color: var(--accent-primary);
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
      background: var(--bg-secondary);
      border-radius: 4px;
      transition: all 0.3s;
      border: 2px solid var(--glass-border);
    }
    .adaptive-bars .bar.highlight {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
    }
    .ai-visual {
      background: #e0f2fe;
      padding: 1rem;
      border-radius: 12px;
      border: 2px solid var(--accent-secondary);
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
      color: var(--text-primary);
      font-size: 0.9rem;
      font-style: italic;
    }

    /* ===== VIDEOS SECTION ===== */
    .videos-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 6rem 2rem;
    }

    .videos-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .video-card {
      border-radius: var(--border-radius);
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid var(--glass-border);
      background: white;
    }

    .video-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);
      border-color: var(--accent-primary);
    }

    .video-placeholder {
      position: relative;
      width: 100%;
      aspect-ratio: 9 / 16;
      background: linear-gradient(135deg, #e0f2fe, #dbeafe);
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 2px solid var(--glass-border);
    }

    .play-icon {
      width: 60px;
      height: 60px;
      background: var(--accent-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 4px 0 #6b46b8;
    }

    .video-card:hover .play-icon {
      background: #6b46b8;
      transform: scale(1.1);
      box-shadow: 0 2px 0 #5a3a9a;
    }

    .video-card h3 {
      padding: 1.5rem 1.5rem 0.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      color: #fff;
      line-height: 1.4;
    }

    .video-card p {
      padding: 0 1.5rem 1.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    /* ===== TESTIMONIALS ===== */
    .testimonials-section {
      padding: 6rem 2rem;
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
      background: #ffffff;
      border: 3px solid #e9d5ff;
      border-radius: var(--border-radius);
      padding: 2rem;
      transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .testimonial-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);
      border-color: var(--accent-primary);
    }
    .testimonial-card.featured {
      border-color: var(--accent-primary);
      background: #ffffff;
      border-width: 4px;
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
      border: 3px solid var(--accent-primary);
      background: var(--bg-secondary);
    }
    .testimonial-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .testimonial-info h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
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
      color: #855cd6;
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
      border-radius: var(--border-radius);
      text-align: left;
      position: relative;
      border: 2px solid var(--glass-border);
      background: white;
    }
    .pricing-card.premium {
      border: 3px solid var(--accent-primary);
      background: #f0fdf4;
    }
    .premium-badge {
      position: absolute;
      top: -12px;
      right: 2rem;
      background: var(--accent-yellow);
      padding: 0.3rem 1rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .pricing-card h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
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
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .check { color: #855cd6; }
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
      border-radius: var(--border-radius);
      background: white;
      border: 2px solid var(--glass-border);
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
      border-top: 2px solid var(--glass-border);
      padding: 3rem 2rem;
      text-align: center;
      background: var(--bg-secondary);
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
    @media (max-width: 1200px) {
      .nav-links { position: static; transform: none; gap: 1.5rem; }
    }
    @media (max-width: 768px) {
      .nav-links, .nav-actions { display: none; }
      .mobile-menu-btn { display: flex; }
      .hero-title { font-size: 2.5rem; }
      .hero-subtitle { font-size: 1.1rem; }
      .stats { gap: 2rem; }
      .bento-grid { grid-template-columns: 1fr; }
      .bento-large { grid-column: span 1; }
      .videos-grid { grid-template-columns: 1fr; max-width: 400px; }
      .pricing-grid { grid-template-columns: 1fr; }
      .section-title { font-size: 2rem; }
      .mockup-body { min-height: 200px; }
      .mockup-sidebar { display: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero-badge,
      .hero-title,
      .hero-subtitle,
      .hero-actions,
      .stat-item,
      .mockup-container,
      .section-fade {
        opacity: 1 !important;
        transform: none !important;
        animation: none !important;
      }
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  public firestoreService = inject(FirestoreService);
  
  isLoggedIn$ = this.authService.isLoggedIn$;
  user$ = this.authService.user$;
  
  // Use toSignal for easy access in template and expressions
  isLoggedIn = toSignal(this.isLoggedIn$, { initialValue: false });
  user = toSignal(this.user$, { initialValue: null });
  
  profileInitial = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.charAt(0).toUpperCase() || 'U';
  });

  isScrolled = false;
  mobileMenuOpen = false;
  animationsReady = false;

  ngOnInit() {
    this.firestoreService.getUserProfile().subscribe();
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.animationsReady = true;
    });

    // Scroll Reveal Animation Logic
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Una vez visible, dejamos de observar para mejorar rendimiento
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Seleccionamos todos los elementos que queremos animar al hacer scroll
    const animatedElements = document.querySelectorAll('.section-fade, .bento-card, .video-card, .testimonial-card, .pricing-card');
    animatedElements.forEach(el => observer.observe(el));
  }

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
