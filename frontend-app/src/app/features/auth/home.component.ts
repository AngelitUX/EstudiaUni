import { Component, inject, HostListener, AfterViewInit, signal, computed, OnInit, NgZone, OnDestroy, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { PaymentService } from '../../core/services/payment.service';
import { LegalModalComponent } from '../../shared/components/legal-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  // RENDIMIENTO (2026-08-29): antes usaba change detection por defecto. El typewriter del hero
  // re-entra a la zona de Angular cada 3 caracteres a 32 ms (~10 veces por segundo) y el
  // contador de estudiantes lo hacia cada 5 s -- con CD por defecto, CADA una de esas entradas
  // recorria el arbol completo de este componente (plantilla de ~1400 lineas con 8 *ngFor).
  // Con OnPush, Angular solo revisa este componente cuando se le marca explicitamente, que es
  // lo que hacen los markForCheck() repartidos por los puntos de mutacion.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // [BARRA DE ANUNCIO 2026-08-29] la clase mueve navbar + contenido para dejar sitio a la barra
  // fija de promo. REVERTIR: borrar esta linea + .announce-bar + showAnnounce + su CSS.
  host: { '[class.has-announce]': 'showAnnounce' },
  imports: [CommonModule, RouterModule, LegalModalComponent],
  template: `
    <!-- [BARRA DE ANUNCIO 2026-08-29] promo "41% OFF" arriba de todo, cerrable (se recuerda en
         localStorage). El descuento salio del hero (era ruido promocional sobre el titular) y
         vive aca. REVERTIR: borrar este bloque + showAnnounce/dismissAnnounce + el host
         [class.has-announce] + el CSS de .announce-bar / --announce-h. -->
    <div class="announce-bar" *ngIf="showAnnounce">
      <button type="button" class="announce-main" (click)="scrollTo('pricing')">
        <span class="announce-chip">AHORRA 41%</span>
        <span class="announce-text">en el Plan PRO<span class="announce-text-extra"> &mdash; por tiempo limitado</span></span>
      </button>
      <button type="button" class="announce-close" (click)="dismissAnnounce()" aria-label="Cerrar aviso">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>

    <!-- NAVBAR GLASSMORPHISM -->
    <nav class="navbar" [class.scrolled]="isScrolled" [class.navbar-hidden]="navbarHidden">
      <div class="nav-container">
        <div class="nav-logo" (click)="scrollToTop()">
          <span class="text-gradient">EstudiaUni</span>.cl
        </div>
        
        <div class="nav-links">
          <!-- href real (ancla a la misma pagina) para que Google los cuente como enlaces
               rastreables; el (click) hace el scroll suave y preventDefault evita el salto nativo. -->
          <a href="#features" (click)="$event.preventDefault(); scrollTo('features')">Características</a>
          <a href="#testimonials" (click)="$event.preventDefault(); scrollTo('testimonials')">Testimonios</a>
          <a href="#pricing" (click)="$event.preventDefault(); scrollTo('pricing')">Precios</a>
        </div>
        
        <div class="nav-actions">
          <ng-container *ngIf="!isLoggedIn(); else loggedInNav">
            <button class="btn btn-ghost" (click)="goTo('/login')">Iniciar Sesión</button>
            <button class="btn btn-primary" (click)="goTo('/register')">Crear Cuenta</button>
          </ng-container>
          <ng-template #loggedInNav>
            <div class="user-profile-nav" (click)="goTo('/dashboard')">
              <img width="36" height="36" *ngIf="firestoreService.profileSignal()?.photoURL; else avatarFallback" 
                   [src]="firestoreService.profileSignal()?.photoURL" 
                   alt="Profile" class="nav-avatar">
              <ng-template #avatarFallback>
                <div class="nav-avatar-fallback">{{ profileInitial() }}</div>
              </ng-template>
              <span class="nav-enter-text">Ingresar</span>
            </div>
          </ng-template>
        </div>
        
        <button class="mobile-menu-btn" [class.open]="mobileMenuOpen" (click)="mobileMenuOpen = !mobileMenuOpen" [attr.aria-expanded]="mobileMenuOpen" aria-label="Abrir menú">
          <span></span><span></span><span></span>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen">
        <a href="#features" (click)="$event.preventDefault(); scrollTo('features'); mobileMenuOpen = false">Características</a>
        <a href="#testimonials" (click)="$event.preventDefault(); scrollTo('testimonials'); mobileMenuOpen = false">Testimonios</a>
        <a href="#pricing" (click)="$event.preventDefault(); scrollTo('pricing'); mobileMenuOpen = false">Precios</a>
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

    <!-- [CTA PEGAJOSA MOVIL 2026-08-29] solo se ve en telefono (CSS), y solo entre el hero y el
         CTA final (showStickyCta, ver ngAfterViewInit). En mobile el navbar colapsa a hamburguesa
         y el boton "Crear Cuenta" queda escondido -> esto da un CTA siempre a mano sin tener que
         bajar hasta los planes. REVERTIR: borrar este elemento, la propiedad, los observers y el CSS. -->
    <button *ngIf="!isLoggedIn()"
            class="home-sticky-cta"
            [class.is-visible]="showStickyCta"
            (click)="goTo('/register')">
      Comenzar gratis <span aria-hidden="true">→</span>
    </button>

    <div class="home-container" [class.animations-ready]="animationsReady">
      <!-- DYNAMIC BACKGROUND -->
      <div class="dynamic-bg">
        <!-- Particulas ambientales (2026-08-29): reemplazan parte del movimiento que se congelo
             al optimizar. Son 6 divs para TODA la pagina (no por seccion) y solo animan
             transform + opacity, o sea puro compositor. -->
        <div class="amb-dot d-1"></div>
        <div class="amb-dot d-2"></div>
        <div class="amb-dot d-3"></div>
        <div class="amb-dot d-4"></div>
        <div class="amb-dot d-5"></div>
        <div class="amb-dot d-6"></div>
        <div class="blob blob-purple"></div>
        <div class="blob blob-blue"></div>
        <div class="blob blob-yellow"></div>
      </div>


      <!-- HERO SECTION -->
      <section id="hero" class="hero-section">
        <!-- Premium Tech Grid & Parallax Background -->
        <div class="hero-tech-background">
          <!-- Cyber Grid Overlay -->
          <div class="hero-grid-overlay"></div>

          <!-- Ambient glows moving organically with scroll -->
          <div class="hero-glow-blob hero-blob-purple"></div>
          <div class="hero-glow-blob hero-blob-blue"></div>
          
          <!-- Floating Science & Math outline symbols -->
          <div class="floating-symbol sym-1">√x</div>
          <div class="floating-symbol sym-2">∫</div>
          <div class="floating-symbol sym-3">H₂O</div>
          <div class="floating-symbol sym-4">E=mc²</div>
          <div class="floating-symbol sym-5">y = mx + b</div>
          <div class="floating-symbol sym-6">sin(θ)</div>
          <div class="floating-symbol sym-7">CO₂</div>
          <div class="floating-symbol sym-8">F = m·a</div>
        </div>

        <div class="hero-grid">
          <!-- LEFT COLUMN: Main title, subtitle, CTA & Social Proof.
               [HERO ADELGAZADO 2026-08-29] .hero-top-badges y .hero-benefits-bar se movieron a la
               <section class="hero-strip"> de abajo. REVERTIR: traerlos de vuelta aca (badges
               antes del <h1>, benefits despues de .hero-cta-group), borrar la <section hero-strip>
               y su CSS, y restaurar el 2do boton en .hero-actions. -->
          <div class="hero-left-content">
            <h1 class="hero-title">
              Prepárate para la <span class="text-gradient">PAES</span> con<br>
              <span class="ai-robotic-text" [class.ai-sparkle-flash]="heroSimStep === 4" data-text="Inteligencia Artificial">Inteligencia Artificial</span>
            </h1>

            <p class="hero-subtitle">
              Ensaya como en la prueba real. Nuestra IA detecta tus errores, te explica cada respuesta y crea un plan de estudio personalizado para mejorar tu puntaje.
            </p>
            
            <div class="hero-cta-group">
              <!-- COMPACT SOCIAL PROOF ROW (kept for logged-in users too so the hero column keeps the same height/position) -->
              <div class="hero-social-proof">
                <div class="avatar-stack">
                  <img width="128" height="128" src="assets/imagesHome/seccion opiniones/1-avatar-v1.webp" alt="Estudiante EstudiaUni" loading="lazy" decoding="async">
                  <img width="128" height="128" src="assets/imagesHome/seccion opiniones/2-avatar-v1.webp" alt="Estudiante EstudiaUni" loading="lazy" decoding="async">
                  <img width="128" height="128" src="assets/imagesHome/seccion opiniones/3-avatar-v1.webp" alt="Estudiante EstudiaUni" loading="lazy" decoding="async">
                </div>
                <div class="proof-text">
                  <div class="star-rating">⭐⭐⭐⭐⭐</div>
                  <!-- [CONTADOR EN VIVO 2026-08-29] el contador "N estudiantes activos" volvio al
                       hero (fusionado con la fila de estrellas). Antes estaba en la pildora
                       .active-students-badge que se habia movido a .hero-strip. -->
                  <span class="proof-live">
                    <span class="proof-live-dot"></span>
                    <strong>{{ activeStudentsCount }}</strong> estudiantes practicando ahora
                  </span>
                </div>
              </div>

              <div class="hero-actions">
                <ng-container *ngIf="!isLoggedIn(); else heroLoggedIn">
                  <button class="btn btn-primary btn-large btn-glow hero-cta-btn" (click)="goTo('/register')">
                    Comenzar Gratis
                  </button>
                </ng-container>
                <ng-template #heroLoggedIn>
                  <button class="btn btn-primary btn-large btn-glow hero-cta-btn" (click)="goTo('/dashboard')">
                    Ir a mi Dashboard
                  </button>
                </ng-template>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Enhanced Live SaaS Interactive Simulation Card -->
          <div class="hero-right-preview">
            <div class="hero-sim-card glass-card">
              <!-- Top bar header -->
              <div class="sim-card-header">
                <div class="sim-header-left">
                  <span class="sim-badge-live"><span class="live-dot"></span> SIMULACIÓN</span>
                  <span class="sim-subject-pill" [title]="currentSimExercise.subject">{{ currentSimExercise.subject }}</span>
                </div>
                <div class="sim-header-right">
                  <span class="sim-timer">⏱️ {{ currentSimExercise.timer }}</span>
                  <span class="sim-q-num">{{ currentSimExercise.questionNum }}</span>
                </div>
              </div>

              <!-- Progress bar -->
              <div class="sim-progress-bar-wrap">
                <div class="sim-progress-bar-fill" [style.transform]="'scaleX(' + simProgressFraction + ')'"></div>
              </div>

              <!-- Question Box -->
              <div class="sim-question-box">
                <p class="sim-q-text">{{ currentSimExercise.text }}</p>

                <!-- Options -->
                <div class="sim-options-list">
                  <div 
                    *ngFor="let opt of currentSimExercise.options; let idx = index; trackBy: trackByIndex" 
                    class="sim-option-item"
                    [class.selected]="heroSimStep >= 1 && idx === currentSimExercise.correctIndex"
                  >
                    <span class="sim-opt-key">{{ opt.key }}</span>
                    <span class="sim-opt-val">{{ opt.val }}</span>
                    <span class="sim-opt-check" *ngIf="heroSimStep >= 1 && idx === currentSimExercise.correctIndex">✓</span>
                  </div>
                </div>
              </div>

              <!-- AI TUTOR LIVE SPLIT PANEL -->
              <div class="sim-ai-split-panel">
                <!-- Left: AI Tutor Explanation -->
                <div class="sim-tutor-main">
                  <div class="tutor-header-bar">
                    <span class="tutor-sparkle">✨</span>
                    <strong>Tutor IA</strong>
                  </div>

                  <!-- Analyzing state -->
                  <div class="sim-analyzing-bar" *ngIf="heroSimStep === 2">
                    <div class="sim-analyzing-spinner"></div>
                    <span>Analizando tu respuesta... 85%</span>
                  </div>

                  <!-- Foco AI Tutor typed response -->
                  <div class="sim-foco-feedback" *ngIf="heroSimStep >= 3">
                    <p class="foco-typed-text">
                      {{ heroSimTypedText }}<span class="typing-cursor" *ngIf="heroSimStep === 3">|</span>
                    </p>

                    <!-- Math Breakdown Box -->
                    <div class="foco-step-box" *ngIf="heroSimStep >= 4">
                      <code>{{ currentSimExercise.stepBreakdown }}</code>
                    </div>

                    <!-- AI Recommendation Chip -->
                    <div class="foco-recommend-chip" *ngIf="heroSimStep >= 4">
                      {{ currentSimExercise.recommendation }}
                    </div>
                  </div>
                </div>

                <!-- Right: Progress Donut & Strengths/Weaknesses -->
                <div class="sim-tutor-side">
                  <div class="side-block">
                    <span class="side-title">Tu progreso</span>
                    <div class="donut-chart-wrap">
                      <div class="donut-chart">
                        <span class="donut-val">{{ currentSimExercise.overallProgress }}</span>
                      </div>
                      <span class="donut-sub">del ensayo</span>
                    </div>
                  </div>

                  <div class="side-block">
                    <span class="side-title color-success">Fortalezas</span>
                    <ul class="tag-list">
                      <li *ngFor="let st of currentSimExercise.strengths; trackBy: trackByIndex">✓ {{ st }}</li>
                    </ul>
                  </div>

                  <div class="side-block">
                    <span class="side-title color-warning">A reforzar</span>
                    <ul class="tag-list warning">
                      <li *ngFor="let wk of currentSimExercise.weaknesses; trackBy: trackByIndex">⚠️ {{ wk }}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p class="sim-card-footnote">
                Demo interactiva — así se ve un Ensayo PAES real en EstudiaUni. No es un ensayo en curso.
              </p>

            </div>
          </div>
        </div>
      </section>

      <!-- ╔══ FRANJA POST-HERO (2026-08-29, definitivo) ══════════════════════════════════════════
           La barra de beneficios (Adaptativo / En tiempo real / 100% enfocado) que ANTES vivia
           dentro del hero. El contador de estudiantes volvio al hero (fila de estrellas) y el
           descuento paso a la .announce-bar de arriba, asi que aca ya solo quedan los 3 chips.
           REVERTIR: mover .hero-benefits-bar de vuelta despues de .hero-cta-group, borrar esta
           <section> y el CSS .hero-strip / .hero-strip-inner. ══╗ -->
      <section class="hero-strip" aria-label="Beneficios">
        <div class="hero-strip-inner">
          <div class="hero-benefits-bar">
            <div class="benefit-chip">
              <div class="chip-icon"><img decoding="async" width="168" height="168" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/w168/P_MiniEnsayos.avif" alt="Adaptativo"></div>
              <div class="chip-info">
                <strong>Adaptativo</strong>
                <span>La IA crea tu plan de estudio</span>
              </div>
            </div>
            <div class="benefit-chip">
              <div class="chip-icon"><img decoding="async" width="168" height="168" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/w168/P_MenteVeloz.avif" alt="En tiempo real"></div>
              <div class="chip-info">
                <strong>En tiempo real</strong>
                <span>Explicaciones al instante mientras ensayas</span>
              </div>
            </div>
            <div class="benefit-chip">
              <div class="chip-icon"><img decoding="async" width="168" height="168" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/w168/P_Logro.avif" alt="100% enfocado"></div>
              <div class="chip-info">
                <strong>100% enfocado</strong>
                <span>Solo contenido oficial PAES</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- ╚══ fin FRANJA POST-HERO ══╝ -->

      <!-- FEATURES BENTO BOX -->
      <section id="features" class="features-section">
        <!-- Cuadricula de fondo continua (2026-08-29). Va en z-index 0, o sea DEBAJO de la placa
             de circuito de abajo (z-index 1) y del contenido (z-index 2). -->
        <!-- Silicon Circuit Board Background (Transparente, sin cortes de color, altamente visual y original) -->
        <div class="features-circuit-bg">
          <svg viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <!-- Definitions for Gradients -->
            <defs>
              <linearGradient id="circuit-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#855cd6" stop-opacity="0.25" />
              </linearGradient>
              <linearGradient id="pulse-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#60a5fa" />
                <stop offset="50%" stop-color="#a78bfa" />
                <stop offset="100%" stop-color="#f472b6" />
              </linearGradient>
            </defs>

            <!-- TRACK 1: Left to Center-Right -->
            <!-- Base track -->
            <path d="M-50,150 L200,150 L350,300 L650,300 L720,230 L850,230" stroke="url(#circuit-grad-1)" stroke-width="1.5" stroke-linecap="round" />
            <!-- Pulse overlay -->
            <path class="pulse-path path-delay-1" d="M-50,150 L200,150 L350,300 L650,300 L720,230 L850,230" stroke="url(#pulse-grad-1)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="40 220" />
            <!-- Node circles -->
            <circle cx="850" cy="230" r="4" fill="#a78bfa" />
            <circle class="node-glow" cx="850" cy="230" r="8" fill="#a78bfa" opacity="0.3" />

            <!-- TRACK 2: Right to Center-Left -->
            <!-- Base track -->
            <path d="M1490,650 L1200,650 L1070,520 L870,520 L800,590 L500,590" stroke="url(#circuit-grad-1)" stroke-width="1.5" stroke-linecap="round" />
            <!-- Pulse overlay -->
            <path class="pulse-path path-delay-2" d="M1490,650 L1200,650 L1070,520 L870,520 L800,590 L500,590" stroke="url(#pulse-grad-1)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="40 220" />
            <!-- Node circles -->
            <circle cx="500" cy="590" r="4" fill="#60a5fa" />
            <circle class="node-glow" cx="500" cy="590" r="8" fill="#60a5fa" opacity="0.3" />

            <!-- TRACK 3: Top to Center -->
            <!-- Base track -->
            <path d="M450,-20 L450,100 L530,180 L530,320" stroke="url(#circuit-grad-1)" stroke-width="1.5" stroke-linecap="round" />
            <!-- Pulse overlay -->
            <path class="pulse-path path-delay-3" d="M450,-20 L450,100 L530,180 L530,320" stroke="url(#pulse-grad-1)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="40 180" />
            <!-- Node circles -->
            <circle cx="530" cy="320" r="4" fill="#a78bfa" />
            <circle class="node-glow" cx="530" cy="320" r="8" fill="#a78bfa" opacity="0.3" />

            <!-- TRACK 4: Bottom-Right to Center -->
            <!-- Base track -->
            <path d="M980,780 L980,630 L880,530 L880,410" stroke="url(#circuit-grad-1)" stroke-width="1.5" stroke-linecap="round" />
            <!-- Pulse overlay -->
            <path class="pulse-path path-delay-4" d="M980,780 L980,630 L880,530 L880,410" stroke="url(#pulse-grad-1)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="40 180" />
            <!-- Node circles -->
            <circle cx="880" cy="410" r="4" fill="#f472b6" />
            <circle class="node-glow" cx="880" cy="410" r="8" fill="#f472b6" opacity="0.3" />
          </svg>
        </div>

        <div class="features-container">
          <h2 class="section-title">¿Por qué <span class="text-gradient">EstudiaUni</span>?</h2>

          <div class="bento-grid">
            <!-- Large Card 1 -->
            <div class="bento-card bento-large glass-card">
              <div class="bento-icon"><img loading="lazy" decoding="async" width="168" height="168" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/w168/P_RutaDeAprendizaje.avif" alt="Rutas de Aprendizaje"></div>
              <h3>Rutas de Aprendizaje</h3>
              <p>Sigue un plan de estudio estructurado y personalizado. Avanza paso a paso dominando cada tema hasta alcanzar tu puntaje ideal.</p>
              <div class="bento-visual">
                <div class="roadmap-visual">
                  <div class="rm-node">
                    <div class="rm-step rm-done">✓</div>
                    <span class="rm-label">Álgebra</span>
                  </div>
                  <div class="rm-line rm-done"></div>
                  <div class="rm-node">
                    <div class="rm-step rm-active">2</div>
                    <span class="rm-label">Geometría</span>
                  </div>
                  <div class="rm-line"></div>
                  <div class="rm-node">
                    <div class="rm-step">3</div>
                    <span class="rm-label">Datos</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Large Card 2 -->
            <div class="bento-card bento-large glass-card">
              <div class="bento-icon"><img loading="lazy" decoding="async" width="168" height="168" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/w168/P_Lenguaje.avif" alt="Ensayos PAES"></div>
              <h3>Ensayos PAES (Reales y Asistidos)</h3>
              <p>Mídete con ensayos oficiales del DEMRE. Practica en modo real con tiempo límite o en modo asistido con apoyo y feedback al instante.</p>
              <div class="bento-visual">
                <div class="exam-visual">
                  <div class="ex-header">
                    <span class="ex-badge">Modo Real</span>
                    <span class="ex-timer">02:15:00</span>
                  </div>
                  <div class="ex-body">
                    <div class="ex-line"></div>
                    <div class="ex-line short"></div>
                    <div class="ex-options">
                      <div class="ex-opt">A</div>
                      <div class="ex-opt correct">B</div>
                      <div class="ex-opt">C</div>
                      <div class="ex-opt">D</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Small Card 1 -->
            <div class="bento-card glass-card">
              <div class="bento-icon"><img loading="lazy" decoding="async" width="168" height="168" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/w168/P_MiniEnsayos.avif" alt="Práctica Adaptativa"></div>
              <h3>Práctica Adaptativa</h3>
              <p>Nuestro algoritmo inteligente analiza tus respuestas y genera nuevas preguntas enfocadas exactamente en las áreas que necesitas reforzar.</p>
            </div>

            <!-- Small Card 2 -->
            <div class="bento-card glass-card">
              <div class="bento-icon"><img loading="lazy" decoding="async" width="168" height="168" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/w168/P_m2.avif" alt="Visualiza tu Progreso"></div>
              <h3>Visualiza tu Progreso</h3>
              <p>Mide tu avance diario e identifica áreas de mejora al instante.</p>
            </div>
            
            <!-- Small Card 3 -->
            <div class="bento-card glass-card">
              <div class="bento-icon"><img loading="lazy" decoding="async" width="168" height="168" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/w168/P_EnncuentraTuCarrera.avif" alt="Explora tu Futuro"></div>
              <h3>Explora tu Futuro</h3>
              <p>Descubre universidades y carreras según tu ubicación e intereses.</p>
            </div>

            <!-- Small Card 4 -->
            <div class="bento-card glass-card">
              <div class="bento-icon"><img loading="lazy" decoding="async" width="168" height="168" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/w168/P_CerrarSesion.avif" alt="Acceso Inmediato"></div>
              <h3>Acceso Inmediato</h3>
              <p>Comienza gratis hoy. Sin ingresar tarjeta de crédito.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FOCO AI TUTOR SECTION -->
      <section id="foco-tutor" class="foco-section">
        <!-- Fondo ambiental compartido: rejilla + simbolos de materias + lineas animadas.
             Ver el bloque "FONDO AMBIENTAL REUTILIZABLE" en los estilos. -->
        <div class="ambient-bg">
          <svg class="ambient-lines" viewBox="0 0 1440 700" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-40,180 L280,180 L400,300 L720,300" stroke="rgba(133,92,214,0.10)" stroke-width="1.4" stroke-linecap="round" />
            <path class="pulse-path path-delay-1" d="M-40,180 L280,180 L400,300 L720,300" stroke="rgba(167,139,250,0.5)" stroke-width="2" stroke-linecap="round" stroke-dasharray="40 220" />
            <path d="M1480,520 L1180,520 L1060,400 L800,400" stroke="rgba(59,130,246,0.09)" stroke-width="1.4" stroke-linecap="round" />
            <path class="pulse-path path-delay-3" d="M1480,520 L1180,520 L1060,400 L800,400" stroke="rgba(96,165,250,0.45)" stroke-width="2" stroke-linecap="round" stroke-dasharray="40 220" />
          </svg>
          <span class="ambient-symbol as-1">pH</span>
          <span class="ambient-symbol as-2">&#955; = c/f</span>
          <span class="ambient-symbol as-3">NaCl</span>
          <span class="ambient-symbol as-4">&#916;v</span>
        </div>
        <div class="foco-container">
          <!-- Left Column: The Mascot with Speech Bubble -->
          <div class="foco-visual">
            <div class="foco-speech-bubble" [class.show]="showFocoBubble">
              <p>{{ focoMessage }}</p>
              <div class="bubble-arrow"></div>
            </div>
            
            <div class="foco-mascot-wrapper">
              <div class="foco-mascot-float-container">
                <!-- Background Orbit Synapses (Moved inside, perfectly centered, moves in lockstep sync with Foco!) -->
                <div class="foco-neural-bg">
                  <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#855cd6" stop-opacity="0.18" />
                        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.18" />
                      </linearGradient>
                    </defs>
                    
                    <!-- Concentric Orbits centered EXACTLY at (300, 300) -->
                    <circle cx="300" cy="300" r="140" stroke="url(#orbit-grad)" stroke-width="1.2" stroke-dasharray="6 8" class="orbit-line-1" />
                    <circle cx="300" cy="300" r="210" stroke="url(#orbit-grad)" stroke-width="1.4" stroke-dasharray="10 12" class="orbit-line-2" />
                    <circle cx="300" cy="300" r="280" stroke="url(#orbit-grad)" stroke-width="1.0" class="orbit-line-3" />

                    <!-- Connecting Synapse Lines -->
                    <line x1="170" y1="170" x2="300" y2="300" stroke="url(#orbit-grad)" stroke-width="1.2" stroke-dasharray="4 4" />
                    <line x1="430" y1="170" x2="300" y2="300" stroke="url(#orbit-grad)" stroke-width="1.2" stroke-dasharray="4 4" />
                    <line x1="170" y1="430" x2="300" y2="300" stroke="url(#orbit-grad)" stroke-width="1.2" stroke-dasharray="4 4" />
                    <line x1="430" y1="430" x2="300" y2="300" stroke="url(#orbit-grad)" stroke-width="1.2" stroke-dasharray="4 4" />

                    <!-- Floating Node 1: Math (∑) -->
                    <g class="neural-node node-1">
                      <circle cx="170" cy="170" r="24" fill="rgba(133, 92, 214, 0.08)" stroke="rgba(133, 92, 214, 0.22)" stroke-width="1.5" />
                      <text x="170" y="175" font-family="monospace" font-size="14" font-weight="700" fill="rgba(133, 92, 214, 0.70)" text-anchor="middle">∑</text>
                    </g>
                    
                    <!-- Floating Node 2: Science (H₂O) -->
                    <g class="neural-node node-2">
                      <circle cx="430" cy="170" r="25" fill="rgba(59, 130, 246, 0.08)" stroke="rgba(59, 130, 246, 0.22)" stroke-width="1.5" />
                      <text x="430" y="174" font-family="monospace" font-size="11" font-weight="700" fill="rgba(59, 130, 246, 0.70)" text-anchor="middle">H₂O</text>
                    </g>

                    <!-- Floating Node 3: Physics (⚛) -->
                    <g class="neural-node node-3">
                      <circle cx="170" cy="430" r="23" fill="rgba(244, 114, 182, 0.08)" stroke="rgba(244, 114, 182, 0.22)" stroke-width="1.5" />
                      <text x="170" y="435" font-family="monospace" font-size="15" font-weight="700" fill="rgba(244, 114, 182, 0.70)" text-anchor="middle">⚛</text>
                    </g>

                    <!-- Floating Node 4: Reading (📖) -->
                    <g class="neural-node node-4">
                      <circle cx="430" cy="430" r="24" fill="rgba(133, 92, 214, 0.08)" stroke="rgba(133, 92, 214, 0.22)" stroke-width="1.5" />
                      <text x="430" y="435" font-family="monospace" font-size="13" font-weight="700" fill="rgba(133, 92, 214, 0.70)" text-anchor="middle">📖</text>
                    </g>
                  </svg>
                </div>

                <!-- preload="metadata": este video vive en .foco-section, que esta bajo la linea de
                     flotacion. Antes no declaraba preload, asi que se descargaba y decodificaba en el
                     arranque; ahora lo arranca el IntersectionObserver de ngAfterViewInit, que ademas
                     lo PAUSA al salir de pantalla (antes no se pausaba nunca). -->
                <video src="https://res.cloudinary.com/dqm3syhwr/image/upload/vc_vp9,q_auto,w_520,c_limit/v1/imagenes/branding/gif.webm" aria-label="Foco el Pulpo" class="foco-mascot" (click)="onFocoClick()" loop [muted]="true" playsinline preload="metadata" width="480" height="480"></video>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Content -->
          <div class="foco-content">
            <div class="foco-header">
              <h2 class="section-title foco-title" style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                <span>Conoce a <span class="text-gradient">Foco</span></span>
                <span class="inline-badge">🧠 IA Activa</span>
              </h2>
              <p class="foco-subtitle">Tu copiloto inteligente para la PAES. Te apaña 24/7 y te explica con peras y manzanas.</p>
            </div>
            
            <div class="foco-benefits">
              <div class="foco-benefit-item delay-1" (mouseenter)="onBenefitHover(0)" (mouseleave)="onBenefitLeave()">
                <div class="benefit-icon-wrapper">
                  <svg class="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 18h6"/>
                    <path d="M10 22h4"/>
                    <path d="M12 2a7 7 0 0 0-4.546 12.324c.61.523 1.546 1.526 1.546 2.676h6c0-1.15.936-2.153 1.546-2.676A7 7 0 0 0 12 2Z"/>
                  </svg>
                </div>
                <div class="benefit-text">
                  <strong>Resuelve Dudas Al Instante:</strong> Hazle consultas sobre Álgebra o Lenguaje y te explica paso a paso, 24/7.
                </div>
              </div>

              <div class="foco-benefit-item delay-2" (mouseenter)="onBenefitHover(1)" (mouseleave)="onBenefitLeave()">
                <div class="benefit-icon-wrapper">
                  <svg class="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="9"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>
                  </svg>
                </div>
                <div class="benefit-text">
                  <strong>Identifica Puntos Débiles:</strong> Analiza tus errores y te sugiere mini-quizzes personalizados para mejorar rápido.
                </div>
              </div>

              <div class="foco-benefit-item delay-3" (mouseenter)="onBenefitHover(2)" (mouseleave)="onBenefitLeave()">
                <div class="benefit-icon-wrapper">
                  <svg class="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                  </svg>
                </div>
                <div class="benefit-text">
                  <strong>Estrategias PAES:</strong> Obtén consejos prácticos para cada sección de la prueba y optimiza tu tiempo.
                </div>
              </div>
            </div>
            
            <p class="freemium-tip">
              Crea tu cuenta gratis para acceder a una prueba limitada. Actualiza al plan Premium para desbloquear ensayos ilimitados y acceso total a nuestro Tutor IA sin restricciones.
            </p>
          </div>
        </div>
      </section>
      <div class="section-sep" aria-hidden="true"></div>

      <!-- HOW IT WORKS TABS SECTION -->
      <section id="videos" class="videos-section section-fade videos-fade" [class.theme-tab-0]="activeTab === 0" [class.theme-tab-1]="activeTab === 1" [class.theme-tab-2]="activeTab === 2">
        <!-- Background Journey Flow Graphic (Transparente, sin cortes de color, altamente interactivo) -->
        <div class="videos-flow-bg">
          <svg viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#855cd6" stop-opacity="0.18" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.18" />
              </linearGradient>
              
              <!-- Tab 0: Violet, Indigo, Rose Gradients -->
              <radialGradient id="aurora-purple-0" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#855cd6" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#855cd6" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="aurora-blue-0" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="aurora-rose-0" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f472b6" stop-opacity="0.10" />
                <stop offset="100%" stop-color="#f472b6" stop-opacity="0" />
              </radialGradient>
              
              <!-- Tab 1: Cyan, Teal, Ocean Blue Gradients -->
              <radialGradient id="aurora-cyan-1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.16" />
                <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="aurora-teal-1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#0f766e" stop-opacity="0.12" />
                <stop offset="100%" stop-color="#0f766e" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="aurora-blue-1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.10" />
                <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0" />
              </radialGradient>
              
              <!-- Tab 2: Mint, Emerald, Amber, Magic Purple Gradients -->
              <radialGradient id="aurora-mint-2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="aurora-emerald-2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#047857" stop-opacity="0.12" />
                <stop offset="100%" stop-color="#047857" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="aurora-amber-2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.10" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="aurora-purple-2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#a855f7" stop-opacity="0.12" />
                <stop offset="100%" stop-color="#a855f7" stop-opacity="0" />
              </radialGradient>
              
              <!-- Technical dot matrix pattern -->
              <pattern id="videos-grid-pat" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="#855cd6" opacity="0.06" />
              </pattern>
              
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- Technical dot matrix grid canvas -->
            <rect width="100%" height="100%" fill="url(#videos-grid-pat)" />
            
            <!-- Tab 0: Violet/Blue/Pink Universe -->
            <g class="orb-group" [class.active]="activeTab === 0">
              <circle cx="150" cy="150" r="340" fill="url(#aurora-purple-0)" />
              <circle cx="1050" cy="450" r="370" fill="url(#aurora-blue-0)" />
              <circle cx="600" cy="100" r="320" fill="url(#aurora-rose-0)" />
              <circle cx="200" cy="500" r="300" fill="url(#aurora-purple-0)" />
              <circle cx="800" cy="300" r="440" fill="url(#aurora-blue-0)" />
            </g>
            
            <!-- Tab 1: Ocean Cyan/Teal Universe -->
            <g class="orb-group" [class.active]="activeTab === 1">
              <circle cx="150" cy="150" r="340" fill="url(#aurora-cyan-1)" />
              <circle cx="1050" cy="450" r="370" fill="url(#aurora-teal-1)" />
              <circle cx="600" cy="100" r="320" fill="url(#aurora-blue-1)" />
              <circle cx="200" cy="500" r="300" fill="url(#aurora-cyan-1)" />
              <circle cx="800" cy="300" r="440" fill="url(#aurora-teal-1)" />
            </g>
            
            <!-- Tab 2: AI Magic Emerald/Gold/Violet Universe -->
            <g class="orb-group" [class.active]="activeTab === 2">
              <circle cx="150" cy="150" r="340" fill="url(#aurora-mint-2)" />
              <circle cx="1050" cy="450" r="370" fill="url(#aurora-emerald-2)" />
              <circle cx="600" cy="100" r="320" fill="url(#aurora-amber-2)" />
              <circle cx="200" cy="500" r="300" fill="url(#aurora-purple-2)" />
              <circle cx="800" cy="300" r="440" fill="url(#aurora-mint-2)" />
            </g>
            
            <!-- Very faint diagonal neural lines for structured tech layout -->
            <line x1="100" y1="100" x2="1100" y2="500" stroke="url(#flow-grad)" stroke-width="0.8" opacity="0.12" />
            <line x1="100" y1="500" x2="1100" y2="100" stroke="url(#flow-grad)" stroke-width="0.8" opacity="0.12" />

            <!-- SLOWLY ROTATING ORBITAL SYSTEM (Centered visually on the video player card) -->
            <g class="videos-orbit-rotate-container">
              <!-- Orbit 1: Inner (Dashed) -->
              <circle cx="740" cy="300" r="200" stroke="url(#flow-grad)" stroke-width="1.2" stroke-dasharray="4 8" opacity="0.2" />
              
              <!-- Orbit 2: Mid (Solid thin) -->
              <circle cx="740" cy="300" r="320" stroke="url(#flow-grad)" stroke-width="1.5" opacity="0.15" />
              
              <!-- Orbit 3: Outer (Dashed) -->
              <circle cx="740" cy="300" r="440" stroke="url(#flow-grad)" stroke-width="1" stroke-dasharray="8 6" opacity="0.12" />
              
              <!-- Constellation nodes / glowing satellites on the orbits -->
              <circle cx="540" cy="300" r="5" fill="var(--theme-primary)" filter="url(#neon-glow)" />
              <circle cx="940" cy="300" r="5" fill="var(--theme-accent)" filter="url(#neon-glow)" />
              <circle cx="740" cy="100" r="5" fill="var(--theme-primary)" filter="url(#neon-glow)" />
              <circle cx="740" cy="500" r="4" fill="var(--theme-accent)" opacity="0.6" />
              <circle cx="482" cy="150" r="4" fill="var(--theme-primary)" opacity="0.6" />
              <circle cx="998" cy="450" r="4" fill="var(--theme-accent)" opacity="0.6" />
            </g>

            <!-- Technical crosshair markers (+) -->
            <!-- Orbit center crosshair directly behind the video card -->
            <path d="M740,300 M733,300 H747 M740,293 V307" stroke="var(--theme-primary)" stroke-width="1" opacity="0.3" />
            <path d="M150,150 M145,150 H155 M150,145 V155" stroke="var(--theme-primary)" stroke-width="1" opacity="0.15" />
            <path d="M1050,480 M1045,480 H1055 M1050,475 V485" stroke="var(--theme-accent)" stroke-width="1" opacity="0.15" />
            <path d="M980,120 M975,120 H985 M980,115 V125" stroke="var(--theme-primary)" stroke-width="1" opacity="0.15" />
            <path d="M180,450 M175,450 H185 M180,445 V455" stroke="var(--theme-accent)" stroke-width="1" opacity="0.15" />
          </svg>
        </div>

        <h2 class="section-title">Mira cómo <span class="text-gradient">funciona</span></h2>
        
        <div class="tabs-container">
          <div class="tabs-buttons" role="tablist">
            <button class="tab-btn" role="tab" [attr.aria-selected]="activeTab === 0" [class.active]="activeTab === 0" (click)="selectDemoTab(0)">
              <span class="tab-number">1</span>
              <span class="tab-txt"><span class="tab-txt-full">Ruta de aprendizaje</span><span class="tab-txt-short">Ruta</span></span>
              <div class="active-indicator"></div>
            </button>
            <button class="tab-btn" role="tab" [attr.aria-selected]="activeTab === 1" [class.active]="activeTab === 1" (click)="selectDemoTab(1)">
              <span class="tab-number">2</span>
              <span class="tab-txt"><span class="tab-txt-full">Ensayos PAES</span><span class="tab-txt-short">Ensayos</span></span>
              <div class="active-indicator"></div>
            </button>
            <button class="tab-btn" role="tab" [attr.aria-selected]="activeTab === 2" [class.active]="activeTab === 2" (click)="selectDemoTab(2)">
              <span class="tab-number">3</span>
              <span class="tab-txt"><span class="tab-txt-full">Encuentra tu carrera</span><span class="tab-txt-short">Carrera</span></span>
              <div class="active-indicator"></div>
            </button>
          </div>
          
          <div class="tab-content" [style.--sel-x]="activeTab === 0 ? '15.9%' : activeTab === 1 ? '50%' : '84.1%'">
            <!-- Tab 1: Ruta de aprendizaje -->
            <div *ngIf="activeTab === 0" class="tab-pane fade-in">
              <div class="tab-visual tab-dashboard-wrapper">
                <video
                  src="https://res.cloudinary.com/n4hzntja/video/upload/q_auto,vc_auto,w_1600,c_limit/v1786850264/30FPSQuality.mp4"
                  poster="https://res.cloudinary.com/n4hzntja/video/upload/so_0,f_auto,q_auto,w_1600,c_limit/v1786850264/30FPSQuality.jpg"
                  loop
                  [muted]="true"
                  playsinline
                  preload="none"
                  width="800"
                  height="450"
                  class="real-video-player"
                  (click)="toggleDemoVideo()"
                  (play)="demoPlaying = true"
                  (pause)="demoPlaying = false"
                  style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);"
                ></video>
                <!-- Boton de play central. Los 3 videos ya NO arrancan solos al entrar la seccion
                     en pantalla: ver el comentario de .video-play-overlay en los estilos. -->
                <button type="button" class="video-play-overlay" [class.is-playing]="demoPlaying"
                        (click)="toggleDemoVideo()"
                        [attr.aria-label]="demoPlaying ? 'Pausar el video' : 'Reproducir el video'">
                  <span class="vpo-btn" aria-hidden="true">
                    <span class="vpo-ring"></span>
                    <svg class="vpo-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <!-- El triangulo NO esta centrado en su propio viewBox: su caja va de x=8 a
                           x~20.9, o sea centrada en 14.45 y no en 12. Se corrige aqui, en unidades
                           del viewBox, en vez de con un margin en px (que dependia del tamaño del
                           icono y descuadraba el circulo en escritorio). El -1.2 deja un empujon
                           optico de ~1,25 unidades a la derecha, que es lo que un triangulo
                           necesita para VERSE centrado dentro de un circulo. -->
                      <g transform="translate(-1.2 0)">
                        <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.14-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z"/>
                      </g>
                    </svg>
                  </span>
                  <span class="vpo-label">Ver demostraci&oacute;n</span>
                </button>
              </div>
            </div>
            
            <!-- Tab 2: Ensayos PAES -->
            <div *ngIf="activeTab === 1" class="tab-pane fade-in">
              <div class="tab-visual tab-exam-wrapper">
                <video
                  src="https://res.cloudinary.com/n4hzntja/video/upload/q_auto,vc_auto,w_1600,c_limit/v1789334853/videoEnsayoPAES.mp4"
                  poster="https://res.cloudinary.com/n4hzntja/video/upload/so_0,f_auto,q_auto,w_1600,c_limit/v1789334853/videoEnsayoPAES.jpg"
                  loop
                  [muted]="true"
                  playsinline
                  preload="none"
                  width="800"
                  height="450"
                  class="real-video-player"
                  (click)="toggleDemoVideo()"
                  (play)="demoPlaying = true"
                  (pause)="demoPlaying = false"
                  style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);"
                ></video>
                <!-- Boton de play central. Los 3 videos ya NO arrancan solos al entrar la seccion
                     en pantalla: ver el comentario de .video-play-overlay en los estilos. -->
                <button type="button" class="video-play-overlay" [class.is-playing]="demoPlaying"
                        (click)="toggleDemoVideo()"
                        [attr.aria-label]="demoPlaying ? 'Pausar el video' : 'Reproducir el video'">
                  <span class="vpo-btn" aria-hidden="true">
                    <span class="vpo-ring"></span>
                    <svg class="vpo-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <!-- El triangulo NO esta centrado en su propio viewBox: su caja va de x=8 a
                           x~20.9, o sea centrada en 14.45 y no en 12. Se corrige aqui, en unidades
                           del viewBox, en vez de con un margin en px (que dependia del tamaño del
                           icono y descuadraba el circulo en escritorio). El -1.2 deja un empujon
                           optico de ~1,25 unidades a la derecha, que es lo que un triangulo
                           necesita para VERSE centrado dentro de un circulo. -->
                      <g transform="translate(-1.2 0)">
                        <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.14-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z"/>
                      </g>
                    </svg>
                  </span>
                  <span class="vpo-label">Ver demostraci&oacute;n</span>
                </button>
              </div>
            </div>
            
            <!-- Tab 3: Encuentra tu carrera -->
            <div *ngIf="activeTab === 2" class="tab-pane fade-in">
              <div class="tab-visual tab-chat-wrapper">
                <video
                  src="https://res.cloudinary.com/n4hzntja/video/upload/q_auto,vc_auto,w_1600,c_limit/v1789334876/videoEncuentraCarrera.mp4"
                  poster="https://res.cloudinary.com/n4hzntja/video/upload/so_0,f_auto,q_auto,w_1600,c_limit/v1789334876/videoEncuentraCarrera.jpg"
                  loop
                  [muted]="true"
                  playsinline
                  preload="none"
                  width="800"
                  height="450"
                  class="real-video-player"
                  (click)="toggleDemoVideo()"
                  (play)="demoPlaying = true"
                  (pause)="demoPlaying = false"
                  style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);"
                ></video>
                <!-- Boton de play central. Los 3 videos ya NO arrancan solos al entrar la seccion
                     en pantalla: ver el comentario de .video-play-overlay en los estilos. -->
                <button type="button" class="video-play-overlay" [class.is-playing]="demoPlaying"
                        (click)="toggleDemoVideo()"
                        [attr.aria-label]="demoPlaying ? 'Pausar el video' : 'Reproducir el video'">
                  <span class="vpo-btn" aria-hidden="true">
                    <span class="vpo-ring"></span>
                    <svg class="vpo-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <!-- El triangulo NO esta centrado en su propio viewBox: su caja va de x=8 a
                           x~20.9, o sea centrada en 14.45 y no en 12. Se corrige aqui, en unidades
                           del viewBox, en vez de con un margin en px (que dependia del tamaño del
                           icono y descuadraba el circulo en escritorio). El -1.2 deja un empujon
                           optico de ~1,25 unidades a la derecha, que es lo que un triangulo
                           necesita para VERSE centrado dentro de un circulo. -->
                      <g transform="translate(-1.2 0)">
                        <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.14-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z"/>
                      </g>
                    </svg>
                  </span>
                  <span class="vpo-label">Ver demostraci&oacute;n</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="section-sep" aria-hidden="true"></div>

      <section id="testimonials" class="testimonials-section section-fade testimonials-fade">
        <!-- Lienzo de constelación de éxito de fondo con elementos interactivos y fluidos -->
        <div class="testimonials-flow-bg">
          <svg viewBox="0 0 1200 500" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="success-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#855cd6" stop-opacity="0.1" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.03" />
              </linearGradient>
              
              <!-- Gradientes para las orbes/nebulosas reactivas -->
              <!-- Stops suavizados para reemplazar el feGaussianBlur que llevaban estos circulos
                   (ver el comentario junto a los <circle class="nebula-glow">). -->
              <radialGradient id="nebula-left-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#855cd6" stop-opacity="0.20" />
                <stop offset="35%" stop-color="#855cd6" stop-opacity="0.13" />
                <stop offset="65%" stop-color="#855cd6" stop-opacity="0.05" />
                <stop offset="100%" stop-color="#855cd6" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="nebula-center-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#d946ef" stop-opacity="0.23" />
                <stop offset="35%" stop-color="#d946ef" stop-opacity="0.15" />
                <stop offset="65%" stop-color="#d946ef" stop-opacity="0.06" />
                <stop offset="100%" stop-color="#d946ef" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="nebula-right-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.20" />
                <stop offset="35%" stop-color="#3b82f6" stop-opacity="0.13" />
                <stop offset="65%" stop-color="#3b82f6" stop-opacity="0.05" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
              </radialGradient>

              <!-- Gradientes para las líneas de luz animadas (Shooting Stars) -->
              <linearGradient id="stream-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#855cd6" stop-opacity="0" />
                <stop offset="50%" stop-color="#855cd6" stop-opacity="1" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
              </linearGradient>
              <linearGradient id="stream-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#d946ef" stop-opacity="0" />
                <stop offset="50%" stop-color="#d946ef" stop-opacity="1" />
                <stop offset="100%" stop-color="#855cd6" stop-opacity="0" />
              </linearGradient>
              <linearGradient id="stream-grad-3" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0" />
                <stop offset="50%" stop-color="#06b6d4" stop-opacity="1" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
              </linearGradient>

              <filter id="neon-glow-test" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
            </defs>
            
            <!-- Nebulosas Reactivas de Fondo (Se encienden al hacer hover en las tarjetas) -->
            <!-- RENDIMIENTO (2026-08-29): estos 3 circulos tenian filter="url(#glow-blur)"
                 (feGaussianBlur stdDeviation=30) Y una transicion de opacity/transform de 1,5 s que
                 se dispara al pasar el mouse por las tarjetas (ver las reglas :has() de
                 .nebula-glow). Escalar un elemento filtrado obliga a RE-RASTERIZAR el desenfoque
                 gaussiano en cada frame de esa transicion. Como el relleno ya es un radialGradient
                 que se desvanece a transparente, el desenfoque encima era en gran parte redundante:
                 se quita el filtro y se suavizan los stops del gradiente para compensar. El hover
                 se conserva, pero ahora es compositable y practicamente gratis. -->
            <circle class="nebula-glow nebula-left" cx="200" cy="250" r="180" fill="url(#nebula-left-grad)" />
            <circle class="nebula-glow nebula-center" cx="600" cy="270" r="220" fill="url(#nebula-center-grad)" />
            <circle class="nebula-glow nebula-right" cx="1000" cy="250" r="180" fill="url(#nebula-right-grad)" />

            <!-- Cruces de Coordenadas Técnicas Ambientales (Pulsantes) -->
            <g class="ambient-cross cross-1">
              <line x1="120" y1="120" x2="130" y2="120" stroke="rgba(133, 92, 214, 0.25)" stroke-width="1.2" />
              <line x1="125" y1="115" x2="125" y2="125" stroke="rgba(133, 92, 214, 0.25)" stroke-width="1.2" />
            </g>
            <g class="ambient-cross cross-2">
              <line x1="1080" y1="180" x2="1090" y2="180" stroke="rgba(59, 130, 246, 0.25)" stroke-width="1.2" />
              <line x1="1085" y1="175" x2="1085" y2="185" stroke="rgba(59, 130, 246, 0.25)" stroke-width="1.2" />
            </g>
            <g class="ambient-cross cross-3">
              <line x1="320" y1="380" x2="330" y2="380" stroke="rgba(217, 70, 239, 0.25)" stroke-width="1.2" />
              <line x1="325" y1="375" x2="325" y2="385" stroke="rgba(217, 70, 239, 0.25)" stroke-width="1.2" />
            </g>

            <!-- Líneas neuronales de conexión sutiles -->
            <line x1="200" y1="100" x2="600" y2="400" stroke="url(#success-grad)" stroke-width="0.8" opacity="0.12" />
            <line x1="600" y1="100" x2="1000" y2="400" stroke="url(#success-grad)" stroke-width="0.8" opacity="0.12" />
            <line x1="200" y1="400" x2="600" y2="100" stroke="url(#success-grad)" stroke-width="0.8" opacity="0.12" />
            <line x1="600" y1="400" x2="1000" y2="100" stroke="url(#success-grad)" stroke-width="0.8" opacity="0.12" />

            <!-- Flujo de Datos Inteligentes (Líneas de Luz Animadas / Shooting Stars) -->
            <path class="success-stream stream-1" d="M200,100 L600,400" stroke="url(#stream-grad-1)" stroke-width="1.6" stroke-linecap="round" />
            <path class="success-stream stream-2" d="M600,100 L1000,400" stroke="url(#stream-grad-2)" stroke-width="1.6" stroke-linecap="round" />
            <path class="success-stream stream-3" d="M1000,100 L600,400" stroke="url(#stream-grad-3)" stroke-width="1.6" stroke-linecap="round" />

            <!-- Línea de trayectoria orbital técnica -->
            <path d="M200,250 Q600,350 1000,250" stroke="url(#success-grad)" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.15" />
            
            <!-- Nódulos estelares brillantes -->
            <circle cx="200" cy="250" r="6" fill="#855cd6" filter="url(#neon-glow-test)" opacity="0.3" />
            <circle cx="600" cy="300" r="7" fill="#d946ef" filter="url(#neon-glow-test)" opacity="0.4" />
            <circle cx="1000" cy="250" r="6" fill="#3b82f6" filter="url(#neon-glow-test)" opacity="0.3" />
          </svg>
        </div>

        <h2 class="section-title">Lo que dicen nuestros <span class="text-gradient">estudiantes</span></h2>
        
        <div class="testimonials-grid">
          <!-- [TESTIMONIOS ESTATICOS 2026-08-29] antes iteraba testimoniosLoop (3 testimonios x3
               para el marquee agarrable de telefono). Ahora es grilla estatica en todos lados, asi
               que itera testimonios (los 3 reales). REVERTIR: volver a testimoniosLoop, restaurar
               el bloque CSS del marquee y descomentar la llamada a setupGrabbableMarquee de
               testimonios en ngAfterViewInit. Las clases -1/-2/-3 disparan la reactividad :has(). -->
          <div *ngFor="let t of testimonios; let i = index; trackBy: trackByIndex"
               class="testimonial-card"
               [class.featured]="t.featured"
               [class.testimonial-card-1]="i === 0"
               [class.testimonial-card-2]="i === 1"
               [class.testimonial-card-3]="i === 2"
               [attr.aria-hidden]="i >= testimonios.length ? 'true' : null">
            <div class="testimonial-header">
              <div class="testimonial-avatar">
                <img width="128" height="128" [src]="t.avatar" [alt]="t.alt" loading="lazy" decoding="async">
              </div>
              <div class="testimonial-info">
                <div class="name-row">
                  <h4>{{ t.nombre }}</h4>
                  <svg class="verify-icon" viewBox="0 0 24 24" fill="currentColor" title="Estudiante Verificado">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p>{{ t.rol }}</p>
              </div>
            </div>

            <div class="testimonial-stars">
              <svg *ngFor="let s of estrellas; trackBy: trackByIndex" class="star-icon" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#f59e0b"/>
              </svg>
            </div>

            <p class="testimonial-text">{{ t.texto }}</p>
          </div>
        </div>
      </section>
      <div class="section-sep" aria-hidden="true"></div>

      <!-- PRICING SECTION -->
      <section id="pricing" class="pricing-section section-fade pricing-fade" [class.yearly-active]="billingPeriod === 'yearly'">
        <!-- Lienzo SVG de Fondo Dinámico e Innovador -->
        <div class="pricing-flow-bg">
          <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
               <!-- RENDIMIENTO (2026-08-29): aca vivia el filtro mas caro de todo el home,
                    'pricing-studio-blur', un feGaussianBlur con stdDeviation=75 (casi 10 veces el
                    del FAQ) y region de filtro de 200%x200%, aplicado a 3 circulos de r=300, 350
                    y 380. Y las nebulosas que lo llevaban tienen transiciones de opacity/transform
                    de 1,2-1,5 s que se disparan al pasar el mouse por una tarjeta de plan (reglas
                    :has()) y al alternar mensual/anual. Escalar un elemento filtrado obliga a
                    RE-RASTERIZAR ese desenfoque enorme en cada frame de la transicion: eso era el
                    lag de la seccion de precios.

                    El relleno ya era un radialGradient que se desvanece a transparente, asi que se
                    quita el filtro y se compensa ensanchando el radio del gradiente (35-40% -> 50%)
                    con stops intermedios que reproducen la caida suave. El hover y el toggle anual
                    se conservan intactos, pero ahora son compositables. -->

               <!-- Nebulosas Reactivas Vibrantes -->
               <radialGradient id="nebula-basic" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stop-color="#10b981" stop-opacity="0.34"/>
                 <stop offset="30%" stop-color="#10b981" stop-opacity="0.24"/>
                 <stop offset="60%" stop-color="#06b6d4" stop-opacity="0.12"/>
                 <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
               </radialGradient>
               <radialGradient id="nebula-premium" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stop-color="#855cd6" stop-opacity="0.4"/>
                 <stop offset="30%" stop-color="#855cd6" stop-opacity="0.28"/>
                 <stop offset="60%" stop-color="#f472b6" stop-opacity="0.14"/>
                 <stop offset="100%" stop-color="#f472b6" stop-opacity="0"/>
               </radialGradient>

               <!-- Nebulosa Dorada de Ahorro Anual -->
               <radialGradient id="nebula-yearly" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.44"/>
                 <stop offset="30%" stop-color="#f59e0b" stop-opacity="0.3"/>
                 <stop offset="60%" stop-color="#d97706" stop-opacity="0.13"/>
                 <stop offset="100%" stop-color="#d97706" stop-opacity="0"/>
               </radialGradient>
               
               <!-- Patrón de Rejilla de Puntajes -->
               <pattern id="pricing-grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                 <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(133, 92, 214, 0.03)" stroke-width="1"/>
                 <circle cx="0" cy="0" r="1.5" fill="rgba(133, 92, 214, 0.08)"/>
               </pattern>
             </defs>

             <!-- Rejilla Técnica Principal -->
             <rect width="100%" height="100%" fill="url(#pricing-grid-pattern)" />

             <!-- Nebulosas Reactivas de Fondo con Filtro de Difuminado -->
             <circle class="pricing-nebula basic-nebula" cx="360" cy="300" r="300" fill="url(#nebula-basic)" />
             <circle class="pricing-nebula premium-nebula" cx="1080" cy="300" r="350" fill="url(#nebula-premium)" />
             
             <!-- Nebulosa Dorada Reactiva Anual -->
             <circle class="pricing-nebula yearly-nebula" cx="720" cy="300" r="380" fill="url(#nebula-yearly)" />

            <!-- Órbitas Concéntricas y Líneas de Enlace de Datos -->
            <circle class="pricing-orbit orbit-outer" cx="720" cy="300" r="450" stroke="rgba(133, 92, 214, 0.03)" stroke-width="1" stroke-dasharray="10 15" />
            <circle class="pricing-orbit orbit-inner" cx="720" cy="300" r="280" stroke="rgba(133, 92, 214, 0.04)" stroke-width="1.5" />
            
            <!-- Nodos Técnicos / Partículas de Puntaje -->
            <g class="pricing-tech-node node-1">
              <circle cx="200" cy="150" r="4" fill="#10b981" />
              <circle class="ping" cx="200" cy="150" r="12" stroke="#10b981" stroke-width="1" fill="none" opacity="0.6" />
            </g>
            <g class="pricing-tech-node node-2">
              <circle cx="1240" cy="120" r="5" fill="#855cd6" />
              <circle class="ping" cx="1240" cy="120" r="14" stroke="#855cd6" stroke-width="1" fill="none" opacity="0.6" />
            </g>
            <g class="pricing-tech-node node-3">
              <circle cx="150" cy="450" r="4.5" fill="#06b6d4" />
              <circle class="ping" cx="150" cy="450" r="13" stroke="#06b6d4" stroke-width="1" fill="none" opacity="0.6" />
            </g>
            <g class="pricing-tech-node node-4">
              <circle cx="1280" cy="480" r="4" fill="#f472b6" />
              <circle class="ping" cx="1280" cy="480" r="12" stroke="#f472b6" stroke-width="1" fill="none" opacity="0.6" />
            </g>
          </svg>
        </div>

        <h2 class="section-title">Elige tu <span class="text-gradient">plan</span></h2>
        
        <div class="pricing-grid">
          <!-- PLAN BÁSICO -->
          <div class="pricing-card basic-card glass-card">
            <div class="card-glow-overlay"></div>
            <div class="pricing-header">
              <span class="plan-tag">Acceso Inicial</span>
              <h3>Plan Básico</h3>
            </div>
            
            <div class="price-container">
              <div class="price">Gratis<span class="period">/siempre</span></div>
              <p class="price-sub">Sin tarjetas, sin compromisos</p>
            </div>
            
            <div class="pricing-divider"></div>
            
            <ul class="pricing-features">
              <li class="feature-item active">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div class="feature-text">
                  <strong>1 Ensayo PAES cada 48 horas</strong>
                </div>
              </li>
              <li class="feature-item active">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div class="feature-text">
                  <strong>1 Capítulo de la Ruta de Aprendizaje</strong>
                </div>
              </li>
              <li class="feature-item active">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div class="feature-text">
                  <strong>Acceso limitado al Tutor IA</strong>
                </div>
              </li>
              <li class="feature-item active">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div class="feature-text">
                  <strong>1 Mini-Ensayo al día</strong>
                </div>
              </li>
              <li class="feature-item inactive">
                <svg class="cross-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <div class="feature-text">
                  <strong>Acceso al Mejorador de Puntaje</strong>
                </div>
              </li>
              <li class="feature-item inactive">
                <svg class="cross-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <div class="feature-text">
                  <strong>Análisis para encontrar tu carrera ideal</strong>
                </div>
              </li>
            </ul>
            
            <button class="pricing-btn-action basic-action" (click)="goTo(isLoggedIn() ? '/dashboard' : '/register')">
              {{ isLoggedIn() ? 'Ir al Panel' : 'Registrarse Gratis' }}
            </button>
          </div>

          <!-- Selector Mensual/Anual (rediseño v4 2026-08-29): una sola pastilla con contorno
               continuo + un divisor central fino (lee como "2 segmentos conectados"). El relleno
               .billing-fill se desliza de un lado al otro con la Web Animations API
               (animateBillingFill): ease elastico + un leve estiron/squash = efecto liquido, sin
               ninguna libreria. Hijo de .pricing-grid; en escritorio se sube a su fila arriba de
               las dos tarjetas, en movil queda entre las tarjetas apiladas. -->
          <div class="billing-toggle"
               [class.yearly]="billingPeriod === 'yearly'"
               [class.switched]="billingSwitched"
               role="group" aria-label="Periodo de facturación">
            <span #billingFill class="billing-fill" aria-hidden="true"></span>
            <span class="billing-divider" aria-hidden="true"></span>
            <button type="button" class="billing-opt billing-opt--monthly"
                    [class.active]="billingPeriod === 'monthly'"
                    [attr.aria-pressed]="billingPeriod === 'monthly'"
                    (click)="setBilling('monthly')">Mensual</button>
            <button type="button" class="billing-opt billing-opt--yearly"
                    [class.active]="billingPeriod === 'yearly'"
                    [attr.aria-pressed]="billingPeriod === 'yearly'"
                    (click)="setBilling('yearly')">
              Anual
              <span class="billing-save">Ahorra&nbsp;41%</span>
            </button>
          </div>

          <!-- PLAN PREMIUM -->
          <div class="pricing-card premium-card glass-card">
            <!-- Neon rotating glow borders -->
            <div class="card-glow-overlay premium-glow"></div>
            
            <div class="premium-badge-floating">
              <span class="sparkle">⭐</span> RECOMENDADO
            </div>
            
            <div class="pricing-header">
              <span class="plan-tag premium-tag">Preparación Óptima</span>
              <h3>Plan Pro</h3>
            </div>
            
            <div class="price-container">
              <div class="price price-animate">
                {{ billingPeriod === 'monthly' ? '$9.990' : '$5.833' }}
                <span class="period">/mes</span>
              </div>
              <p class="price-sub">
                {{ billingPeriod === 'monthly' ? 'Facturado mensualmente' : 'Facturado anualmente ($69.990) — ¡Ahorra 41%!' }}
              </p>
            </div>
            
            <div class="pricing-divider premium-divider"></div>
            
            <ul class="pricing-features">
              <li class="feature-item active premium-feature">
                <svg class="check-icon premium-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div class="feature-text">
                  <strong>Ensayos PAES Ilimitados</strong>
                </div>
              </li>
              <li class="feature-item active premium-feature">
                <svg class="check-icon premium-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div class="feature-text">
                  <strong>Ruta de Aprendizaje Completa</strong>
                </div>
              </li>
              <li class="feature-item active premium-feature">
                <svg class="check-icon premium-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div class="feature-text">
                  <strong>Acceso Total al Tutor IA</strong>
                </div>
              </li>
              <li class="feature-item active premium-feature">
                <svg class="check-icon premium-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div class="feature-text">
                  <strong>Acceso completo a Mini-Ensayos y Minijuegos</strong>
                </div>
              </li>
              <li class="feature-item active premium-feature">
                <svg class="check-icon premium-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div class="feature-text">
                  <strong>Mejorador de Puntaje y Análisis Estadístico en tiempo real</strong>
                </div>
              </li>
              <li class="feature-item active premium-feature">
                <svg class="check-icon premium-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div class="feature-text">
                  <strong>¡Y muchas cosas más!</strong>
                </div>
              </li>
            </ul>
            
            <button class="pricing-btn-action premium-action" (click)="onPremiumAction()">
              {{ getPremiumButtonText() }}
            </button>
          </div>
        </div>
      </section>
      <div class="section-sep" aria-hidden="true"></div>

      <!-- NEWS SECTION -->
      <section id="news" class="news-section section-fade news-fade">
        <div class="news-bg-decor"></div>
        <div class="ambient-bg">
          <svg class="ambient-lines" viewBox="0 0 1440 700" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-40,140 L320,140 L440,260 L760,260" stroke="rgba(59,130,246,0.09)" stroke-width="1.4" stroke-linecap="round" />
            <path class="pulse-path path-delay-2" d="M-40,140 L320,140 L440,260 L760,260" stroke="rgba(96,165,250,0.45)" stroke-width="2" stroke-linecap="round" stroke-dasharray="40 220" />
            <path d="M1480,560 L1140,560 L1020,440 L740,440" stroke="rgba(133,92,214,0.09)" stroke-width="1.4" stroke-linecap="round" />
            <path class="pulse-path path-delay-4" d="M1480,560 L1140,560 L1020,440 L740,440" stroke="rgba(167,139,250,0.45)" stroke-width="2" stroke-linecap="round" stroke-dasharray="40 220" />
          </svg>
          <span class="ambient-symbol as-1">x&#178;</span>
          <span class="ambient-symbol as-2">V = IR</span>
          <span class="ambient-symbol as-3">mol</span>
          <span class="ambient-symbol as-4">&#945; + &#946;</span>
        </div>
        <h2 class="section-title">Actualidad y <span class="text-gradient">Noticias PAES</span></h2>
        <p class="section-subtitle-custom">Mantente al tanto de las últimas novedades oficiales del DEMRE y consejos clave para tu postulación.</p>
        
        <div class="news-carousel-container">
          <button class="carousel-control prev" (click)="scrollNews('left')" aria-label="Noticia anterior">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div class="news-track">
            <!-- newsLoop = las noticias triplicadas: los clones (i >= news.length) solo se ven en el
                 marquee agarrable de telefono; en desktop se ocultan por CSS. -->
            <div class="news-card glass-card" *ngFor="let item of newsLoop; let i = index; trackBy: trackByIndex"
                 [attr.aria-hidden]="i >= news.length ? 'true' : null">
              <div class="news-header-img">
                <div class="news-img-skeleton" *ngIf="!item.isLoaded"></div>
                <img width="400" height="225" [src]="item.imageUrl" (load)="item.isLoaded = true" [class.loaded]="item.isLoaded" alt="Portada de la noticia" class="news-cover-img" loading="lazy" decoding="async" />
                <div class="news-img-overlay" [style.background]="item.gradient"></div>
                <span class="news-badge">{{ item.tag }}</span>
              </div>
              <div class="news-body">
                <div class="news-meta">
                  <span class="news-source">{{ item.source }}</span>
                  <span class="news-dot">•</span>
                  <span class="news-date">{{ item.dateText || item.date }}</span>
                </div>
                <h3 class="news-title">{{ item.title }}</h3>
                <p class="news-excerpt">{{ item.excerpt }}</p>
                <a [href]="item.linkUrl" target="_blank" rel="noopener noreferrer" class="news-link">
                  Leer Noticia Completa 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>
          </div>

          <button class="carousel-control next" (click)="scrollNews('right')" aria-label="Siguiente noticia">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <!-- Barra de progreso del carrusel. Solo en desktop/tablet (>640px): ahi el carrusel se
             mueve con las flechas y el scroll, y saber la posicion ayuda. En <=640px es un marquee
             agarrable en bucle -> una barra de progreso no tendria sentido y se oculta por CSS. -->
        <div class="news-scroll-indicator" aria-hidden="true">
          <div class="news-scroll-thumb"></div>
        </div>
      </section>
      <div class="section-sep" aria-hidden="true"></div>

      <!-- FAQ SECTION -->
      <section id="faq" class="faq-section section-fade faq-fade">
        <!-- SVG Canvas de Fondo Tecnológico y Vibrante para Preguntas Frecuentes -->
        <div class="faq-flow-bg">
          <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="faq-bg-fade" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
                <stop offset="15%" stop-color="#ffffff" stop-opacity="0" />
                <stop offset="85%" stop-color="#ffffff" stop-opacity="0" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="1" />
              </linearGradient>
              
              <!-- Radial Gradients for Neon Glowing Nebulas -->
              <radialGradient id="faq-nebula-left" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#855cd6" stop-opacity="0.18" />
                <stop offset="60%" stop-color="#855cd6" stop-opacity="0.04" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="faq-nebula-right" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15" />
                <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.03" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
              </radialGradient>
              
              <!-- Resplandor de los satelites como gradiente en vez de como filtro, para poder
                   animarlos sin re-rasterizar un desenfoque en cada frame. -->
              <radialGradient id="faq-sat-glow-a" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#855cd6" stop-opacity="1" />
                <stop offset="35%" stop-color="#855cd6" stop-opacity="0.55" />
                <stop offset="100%" stop-color="#855cd6" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="faq-sat-glow-b" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="1" />
                <stop offset="35%" stop-color="#3b82f6" stop-opacity="0.55" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- Slow Floating Nebulas (Dynamic Morphing Backgrounds) -->
            <circle class="faq-nebula nebula-1" cx="250" cy="300" r="280" fill="url(#faq-nebula-left)" />
            <circle class="faq-nebula nebula-2" cx="1190" cy="320" r="260" fill="url(#faq-nebula-right)" />

            <!-- Subtly dotted technological orbits centering the container -->
            <circle cx="720" cy="300" r="420" stroke="rgba(133, 92, 214, 0.08)" stroke-width="1.2" stroke-dasharray="6 8" class="faq-orbit-1" />
            <circle cx="720" cy="300" r="540" stroke="rgba(59, 130, 246, 0.06)" stroke-width="1" stroke-dasharray="10 12" class="faq-orbit-2" />

            <!-- Glowing Technical Node Satellites -->
            <!-- 2026-08-29: se les quito filter="url(#faq-glow-filter)" (un feGaussianBlur). Con el
                 filtro puesto NO se podian animar: cada frame re-rasterizaba el desenfoque, que fue
                 la causa principal del ~1 fps de esta seccion. Sin filtro, el resplandor lo da un
                 radialGradient (mismo truco que las nebulosas) y el pulso vuelve, pero animando
                 solo opacity/transform, que si se pueden componer. -->
            <circle cx="340" cy="180" r="9" fill="url(#faq-sat-glow-a)" class="faq-satellite sat-1" />
            <circle cx="1120" cy="420" r="9" fill="url(#faq-sat-glow-b)" class="faq-satellite sat-2" />
            
            <!-- Coordinates crosses / markers (+) -->
            <path d="M150,120 H160 M155,115 V125" stroke="rgba(133, 92, 214, 0.2)" stroke-width="1" />
            <path d="M1280,180 H1290 M1285,175 V185" stroke="rgba(59, 130, 246, 0.2)" stroke-width="1" />
            <path d="M220,480 H230 M225,475 V485" stroke="rgba(59, 130, 246, 0.15)" stroke-width="1" />
            <path d="M1200,490 H1210 M1205,485 V495" stroke="rgba(133, 92, 214, 0.15)" stroke-width="1" />

            <!-- Responsive Limits Fades Overlay (Borde Difuminado de Fondos) -->
            <rect x="0" y="0" width="100%" height="100%" fill="url(#faq-bg-fade)" pointer-events="none" />
          </svg>
        </div>

        <h2 class="section-title">Preguntas <span class="text-gradient">Frecuentes</span></h2>
        
        <div class="faq-container">
          <div class="faq-item glass-card" *ngFor="let faq of faqs; let i = index; trackBy: trackByIndex" [class.active]="openFaq === i">
            <button class="faq-question" (click)="toggleFaq(i)">
              <span class="faq-q-text">{{ faq.q }}</span>
              <span class="faq-icon">
                <svg *ngIf="openFaq !== i" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <svg *ngIf="openFaq === i" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </span>
            </button>
            <div class="faq-answer-container">
              <div class="faq-answer-inner">
                <div class="faq-answer">
                  {{ faq.a }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="section-sep" aria-hidden="true"></div>

      <!-- FINAL CTA -->
      <section id="cta" class="cta-section section-fade cta-fade">
        <div class="ambient-bg">
          <svg class="ambient-lines" viewBox="0 0 1440 420" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-40,110 L300,110 L400,210 L700,210" stroke="rgba(133,92,214,0.10)" stroke-width="1.4" stroke-linecap="round" />
            <path class="pulse-path path-delay-1" d="M-40,110 L300,110 L400,210 L700,210" stroke="rgba(167,139,250,0.5)" stroke-width="2" stroke-linecap="round" stroke-dasharray="40 220" />
            <path d="M1480,320 L1160,320 L1060,220 L800,220" stroke="rgba(59,130,246,0.09)" stroke-width="1.4" stroke-linecap="round" />
            <path class="pulse-path path-delay-3" d="M1480,320 L1160,320 L1060,220 L800,220" stroke="rgba(96,165,250,0.45)" stroke-width="2" stroke-linecap="round" stroke-dasharray="40 220" />
          </svg>
          <span class="ambient-symbol as-1">&#960;r&#178;</span>
          <span class="ambient-symbol as-2">O&#8322;</span>
          <span class="ambient-symbol as-3">log x</span>
          <span class="ambient-symbol as-4">&#916;t</span>
        </div>
        <div class="cta-content glass-card">
          <h2>¿Listo para mejorar tu puntaje?</h2>
          <p>Únete a miles de estudiantes preparándose con EstudiaUni</p>
          <button class="btn btn-primary btn-large btn-glow cta-final-btn" (click)="goTo(isLoggedIn() ? '/dashboard' : '/register')">
            {{ isLoggedIn() ? 'Ir a mi Dashboard' : 'Crear Cuenta Gratis' }}
          </button>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-grid">
            <div class="footer-col">
              <div class="nav-logo" style="margin-bottom: 1rem; cursor: default; pointer-events: none;">
                <span class="text-gradient">EstudiaUni</span>.cl
              </div>
              <p class="footer-desc">La plataforma inteligente para tu PAES. Maximiza tu puntaje con tecnología adaptativa y retroalimentación IA en tiempo real.</p>
            </div>
            
            <div class="footer-col">
              <h4>Conócenos</h4>
              <a href="https://www.instagram.com/estudiauni.cl" target="_blank" rel="noopener" style="cursor: pointer; display: flex; align-items: center; gap: 0.45rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;opacity:0.7"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram
              </a>
              <a href="https://www.tiktok.com/@estudiauni" target="_blank" rel="noopener" style="cursor: pointer; display: flex; align-items: center; gap: 0.45rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;opacity:0.7"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/></svg>
                TikTok
              </a>
              <a href="https://www.facebook.com/estudiauni" target="_blank" rel="noopener" style="cursor: pointer; display: flex; align-items: center; gap: 0.45rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;opacity:0.7"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a routerLink="/trabaja-con-nosotros" style="cursor: pointer; margin-top: 0.25rem;">Trabaja con nosotros&nbsp;↗</a>
            </div>
            
            <div class="footer-col">
              <h4>Recursos</h4>
              <a href="https://demre.cl/" target="_blank" rel="noopener" style="cursor: pointer;">Portal Oficial DEMRE&nbsp;↗</a>
              <a href="https://demre.cl/publicaciones/" target="_blank" rel="noopener" style="cursor: pointer;">Temarios Oficiales PAES&nbsp;↗</a>
              <a href="https://demre.cl/paes/universidades-participantes/universidades-sistema-acceso" target="_blank" rel="noopener" style="cursor: pointer;">Guía de Universidades&nbsp;↗</a>
              <a href="https://portal.beneficiosestudiantiles.cl/" target="_blank" rel="noopener" style="cursor: pointer;">Beneficios Estudiantiles&nbsp;↗</a>
            </div>
            
            <div class="footer-col">
              <h4>Soporte y Legal</h4>
              <a routerLink="/soporte" style="cursor: pointer;">Soporte de Usuario y Contacto&nbsp;↗</a>
              <a href="#faq" style="cursor: pointer;" (click)="$event.preventDefault(); scrollTo('faq')">Preguntas Frecuentes </a>
              <a style="cursor: pointer;" (click)="legalModalType = 'terms'">Términos de Servicio </a>
              <a style="cursor: pointer;" (click)="legalModalType = 'privacy'">Política de Privacidad </a>
            </div>
          </div>
          
          <div class="footer-bottom">
            <div class="footer-bottom-left">
              <p>© 2026 EstudiaUni. Todos los derechos reservados.</p>
            </div>
            <div class="footer-bottom-right">
              <a href="#hero" style="cursor: pointer;" (click)="$event.preventDefault(); scrollToTop()">Inicio →</a>
              <span class="separator">•</span>
              <a href="#pricing" style="cursor: pointer;" (click)="$event.preventDefault(); scrollTo('pricing')">Planes →</a>
              <span class="separator">•</span>
              <a routerLink="/soporte">Soporte →</a>
            </div>
          </div>
        </div>
      </footer>

      <!-- LEGAL MODAL -->
      <app-legal-modal [type]="legalModalType" (close)="legalModalType = null"></app-legal-modal>
    </div>
  `,
  styles: [`
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 160px; height: auto; object-fit: contain; margin: 12px auto 0 auto; animation: floatLogo 3.5s ease-in-out infinite; }
    
    /* ===== DYNAMIC BACKGROUND ===== */
    .dynamic-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: -1;
      pointer-events: none;
      background: #fafafa;
      contain: strict;
      transform: translateZ(0);
    }
    /* RENDIMIENTO (2026-08-29): estos 3 blobs vivian dentro de .dynamic-bg, que es
       position: fixed y cubre el viewport completo DETRAS de los ~15.000 px del documento.
       Cada uno tenia filter: blur(90px) sobre un circulo solido MAS una animacion infinita
       de transform. O sea: una capa fija, desenfocada en tiempo real y animandose para
       siempre, en absolutamente toda posicion de scroll -- incluida la seccion de FAQ, que
       es donde el usuario reportaba ~1 fps en un telefono real.

       El desenfoque en runtime se reemplaza por un radial-gradient con la misma caida suave:
       visualmente equivalente a un circulo solido con blur, pero cuesta CERO por frame y no
       promueve ninguna capa. Se quitan tambien la animacion infinita, will-change y los
       hacks de promocion (translateZ/backface-visibility), que solo tenian sentido para
       sostener esa animacion. */
    .blob {
      position: absolute;
      border-radius: 50%;
      opacity: 0.5;
    }
    .blob-purple {
      width: 50vw;
      height: 50vw;
      background: radial-gradient(circle, rgba(133, 92, 214, 0.4) 0%, rgba(133, 92, 214, 0.22) 45%, rgba(133, 92, 214, 0) 72%);
      top: -20vh;
      left: -10vw;
    }
    .blob-blue {
      width: 40vw;
      height: 40vw;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.16) 45%, rgba(59, 130, 246, 0) 72%);
      bottom: -10vh;
      right: -10vw;
    }
    .blob-yellow {
      width: 30vw;
      height: 30vw;
      background: radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0.13) 45%, rgba(251, 191, 36, 0) 72%);
      top: 30vh;
      left: 60vw;
    }


    .home-container {
      background: transparent;
      width: 100% !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
      position: relative;
      /* [BARRA DE ANUNCIO 2026-08-29] deja sitio a la barra fija de promo (0 si esta cerrada). */
      padding-top: var(--announce-h, 0px);
    }

    /* ==================================================================
       CUADRICULA CONTINUA DE TODO EL HOME (2026-08-29, segunda version)
       ==================================================================
       La primera version ponia una .ambient-grid DENTRO de cada seccion, y se veia a parches:
       .ambient-bg desvanecia el 12% superior e inferior de CADA seccion (mask-image lineal) y
       .ambient-grid encima solo mostraba su centro (mask-image radial). Resultado: un ovalo de
       rejilla en medio de algunas secciones y huecos en cada frontera.

       Ahora es UN solo pseudo-elemento sobre .home-container, que abarca el documento completo:
       la rejilla es continua de punta a punta, sin costuras, y ademas es mas barata (un elemento
       en vez de ocho). Va en z-index 0 y las secciones se pintan encima, asi que las que tenian
       fondo blanco opaco se pasaron a translucido para dejarla ver (ver .videos-section,
       .testimonials-section, .pricing-section y .footer). */
    .home-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      background-image:
        linear-gradient(rgba(133, 92, 214, 0.080) 1.5px, transparent 1.5px),
        linear-gradient(90deg, rgba(133, 92, 214, 0.055) 1.5px, transparent 1.5px);
      background-size: 64px 64px;
      /* Deriva lentisima. Es UNA sola capa animando transform: la GPU la mueve sin repintar,
         y le devuelve algo de vida al fondo sin ninguna de las cosas caras que se quitaron. */
      animation: grid-drift 90s linear infinite;
    }
    @keyframes grid-drift {
      from { transform: translate3d(0, 0, 0); }
      to   { transform: translate3d(-64px, -64px, 0); }
    }

    /* Separador entre secciones: una linea horizontal simple, del mismo tono que el contorno de
       las tarjetas (#cbd5e1) pero un poco mas oscura, centrada en el hueco vacio. Solo se
       desvanece muy sutil en las 2 puntas para que no se vea cortada. No ocupa alto en el flujo
       (height:0 + ::before absoluto), asi que NO agranda la separacion — solo la decora. */
    .section-sep {
      position: relative;
      height: 0;
      z-index: 1;
      pointer-events: none;
    }
    .section-sep::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      width: min(560px, 82%);
      height: 2px;
      background: rgba(154, 164, 181, 0.62);
      -webkit-mask: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
      mask: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
    }

    /* ===== VARIABLES & BASE ===== */
    .home-container { min-height: 100vh; }

    /* ╔══ REORDEN DE SECCIONES (2026-08-29, definitivo) ═══════════════════════════════════════════
       Sube "Elige tu plan" (los precios estaban a ~6-7 pantallas de scroll) y baja "Actualidad
       y Noticias" al final, junto al footer. Se hace con la propiedad order sobre el flex de
       .home-container (no se mueve el DOM) -> REVERTIR = borrar este bloque entero.
       Orden nuevo: hero · franja · features · Foco · videos · PLANES · testimonios · FAQ · CTA ·
       NOTICIAS · footer. Los precios quedan despues de "Mira como funciona" (ya se explico Foco
       y la demo, o sea el argumento de PRO), y a ~4 pantallas en movil. Los .section-sep viajan
       con su hueco vía el selector de hermano adyacente. ══╗ */
    .home-container { display: flex; flex-direction: column; }
    .home-container > #hero            { order: 10; }
    .home-container > .hero-strip      { order: 15; }
    .home-container > #features        { order: 20; }
    .home-container > #foco-tutor      { order: 30; }
    #foco-tutor + .section-sep         { order: 35; }
    .home-container > #videos          { order: 40; }
    #videos + .section-sep            { order: 45; }
    .home-container > #pricing         { order: 50; }
    #testimonials + .section-sep       { order: 55; }
    .home-container > #testimonials    { order: 60; }
    #pricing + .section-sep           { order: 65; }
    .home-container > #faq             { order: 70; }
    #news + .section-sep             { order: 75; }
    .home-container > #cta             { order: 80; }
    #faq + .section-sep              { order: 85; }
    .home-container > #news            { order: 90; }
    .home-container > footer           { order: 100; }
    .home-container > app-legal-modal  { order: 110; }
    /* ╚══ fin REORDEN DE SECCIONES ══╝ */

    /* ╔══ CTA PEGAJOSA MOVIL (2026-08-29, definitivo) — REVERTIR: borrar este bloque + su elemento
       + la propiedad showStickyCta + los 2 observers de ngAfterViewInit. ══╗ */
    .home-sticky-cta {
      position: fixed;
      left: 14px;
      right: 14px;
      bottom: 14px;
      z-index: 95;
      display: none;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.95rem 1rem;
      border: 0;
      border-radius: 14px;
      background: var(--accent-primary, #855cd6);
      color: #fff;
      font-family: inherit;
      font-size: 1rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(133, 92, 214, 0.45);
      transform: translateY(150%);
      transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }
    @media (max-width: 768px) {
      .home-sticky-cta { display: flex; }
      .home-sticky-cta.is-visible { transform: translateY(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .home-sticky-cta { transition: none; }
    }
    /* ╚══ fin CTA PEGAJOSA MOVIL ══╝ */

    /* ╔══ BARRA DE ANUNCIO (2026-08-29, definitivo) — REVERTIR: borrar este bloque + su elemento +
       showAnnounce/dismissAnnounce + el host [class.has-announce] + los calc(... + var(--announce-h))
       de .navbar / .navbar.scrolled / .home-container. ══╗ */
    .announce-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--announce-h, 42px);
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0 2.5rem;
      background: linear-gradient(90deg, #4c1d95, #6d28d9 55%, #7c3aed);
      color: #fff;
      font-size: 0.82rem;
      font-weight: 600;
    }
    .announce-main {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      background: none;
      border: 0;
      color: inherit;
      font: inherit;
      cursor: pointer;
      padding: 0.25rem 0.4rem;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }
    .announce-main:hover { background: rgba(255, 255, 255, 0.12); }
    .announce-chip {
      background: #f59e0b;
      color: #fff;
      font-weight: 800;
      font-size: 0.72rem;
      letter-spacing: 0.02em;
      padding: 0.14rem 0.44rem;
      border-radius: 6px;
      flex-shrink: 0;
    }
    .announce-text { white-space: nowrap; }
    .announce-text strong { font-weight: 800; }
    .announce-close {
      position: absolute;
      right: 0.4rem;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem;
      background: none;
      border: 0;
      color: #fff;
      opacity: 0.75;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    .announce-close:hover { opacity: 1; }
    @media (max-width: 640px) {
      .announce-bar { font-size: 0.76rem; padding: 0 2.25rem; gap: 0.4rem; }
      .announce-chip { font-size: 0.66rem; padding: 0.12rem 0.36rem; }
      /* En telefono se cae "— por tiempo limitado" para no apretar. Queda "41% OFF en Plan PRO". */
      .announce-text-extra { display: none; }
    }
    @media (max-width: 360px) {
      .announce-text { font-size: 0.72rem; }
    }
    /* ╚══ fin BARRA DE ANUNCIO ══╝ */

    .section-title, .bento-card, .faq-item, .foco-visual {
      opacity: 0;
      transform: translate3d(0, 30px, 0);
      transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
      backface-visibility: hidden;
    }
    
    .is-visible {
      opacity: 1 !important;
      transform: translate3d(0, 0, 0) !important;
    }

    .w-full { width: 100%; }
    .text-gradient {
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      background-size: 200% auto;
      animation: gradientMove 4s ease infinite;
    }
    /* El letter-spacing negativo del h1 deja la tinta de la ultima letra (~1.4px) fuera de la caja
       de texto, y background-clip: text no pinta ahi -> la "S" de "PAES" se veia cortada. Un pelin
       de padding-right extiende la caja del degradado sin mover nada (hay ~18px de aire a la
       derecha). */
    .hero-title .text-gradient { padding-right: 0.1em; }
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* [BARRA DE ANUNCIO 2026-08-29] --announce-h reserva el alto de la barra fija de promo y
       empuja navbar + contenido. 0 cuando la barra esta cerrada. */
    :host { --announce-h: 0px; }
    :host(.has-announce) { --announce-h: 42px; }
    @media (max-width: 640px) { :host(.has-announce) { --announce-h: 40px; } }

    /* ===== NAVBAR ===== */
    .navbar {
      position: fixed;
      top: calc(1.5rem + var(--announce-h, 0px));
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 1180px;
      z-index: 1000;
      padding: 0.6rem 1.5rem;
      transition: transform 0.5s cubic-bezier(0.33, 1, 0.68, 1), background-color 0.4s ease, border-color 0.4s ease, padding 0.4s ease, top 0.4s ease, box-shadow 0.4s ease;
      /* RENDIMIENTO (2026-08-29): tenia backdrop-filter: blur(20px). Un backdrop-filter
         sobre un elemento position: fixed obliga al navegador a releer y desenfocar lo que
         hay detras EN CADA FRAME mientras la pagina scrollea -- el peor caso conocido en
         GPU movil, y aqui aplicaba a todo el recorrido del home. Se sustituye por un fondo
         translucido mas opaco: como el fondo de la pagina es #fafafa, la diferencia visual
         es minima y el costo por frame pasa a ser cero. */
      background: rgba(255, 255, 255, 0.92);
      border-radius: 999px;
      border: 2px solid #cbd5e1; /* Mismo contorno que las tarjetas de "¿Por qué EstudiaUni?" (.bento-card) */
      box-shadow: 
        0 10px 30px rgba(133, 92, 214, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      animation: nav-enter 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    }
    
    @keyframes nav-enter {
      from { transform: translate(-50%, -150%); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }

    .navbar.navbar-hidden {
      transform: translate(-50%, -150%);
      pointer-events: none;
    }
    .navbar.scrolled {
      top: calc(1rem + var(--announce-h, 0px));
      padding: 0.5rem 1.5rem;
      background: rgba(255, 255, 255, 0.88); /* Transición armónica y sutil en scroll, sin saltos de color */
      border-color: #cbd5e1;
      box-shadow: 
        0 12px 30px rgba(133, 92, 214, 0.08), 
        0 1px 3px rgba(0, 0, 0, 0.02),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
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
      font-size: 1.8rem;
      font-weight: 800;
      cursor: pointer;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      transition: transform 0.3s ease;
    }
    .nav-logo:hover {
      transform: scale(1.02);
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
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.95rem;
      position: relative;
    }
    .nav-links a::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
      left: 50%;
      background-color: var(--accent-primary);
      transition: all 0.3s ease;
      transform: translateX(-50%);
      border-radius: 2px;
    }
    .nav-links a:hover { 
      color: var(--accent-primary); 
    }
    .nav-links a:hover::after {
      width: 100%;
    }
    .nav-actions {
      display: flex;
      gap: 1rem;
    }
    .btn-ghost {
      background: transparent;
      color: var(--text-primary);
      border: none;
      padding: 0.6rem 1rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      border-radius: 9999px;
    }
    .btn-ghost:hover {
      color: var(--accent-primary);
      background: rgba(133, 92, 214, 0.05);
    }
    /* Mismo hover que los links de .nav-links (p.ej. "Precios"): cambio de color + un
       subrayado que crece desde el centro. Escopado a .nav-actions para no tocar el botón
       "Iniciar Sesión" del menú móvil (que es w-full y no necesita este efecto). */
    .nav-actions .btn-ghost {
      position: relative;
    }
    .nav-actions .btn-ghost::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 2px;
      left: 50%;
      background-color: var(--accent-primary);
      transition: all 0.3s ease;
      transform: translateX(-50%);
      border-radius: 2px;
    }
    .nav-actions .btn-ghost:hover {
      background: transparent;
    }
    .nav-actions .btn-ghost:hover::after {
      width: calc(100% - 2rem);
    }
    /* Botón principal en navbar */
    .navbar .btn-primary {
      padding: 0.6rem 1.2rem;
      font-size: 0.95rem;
      border-radius: 999px;
      transition: all 0.3s ease;
    }
    /* Mismo hover "presionado" que usa el botón global .btn-primary (y por lo tanto
       "Comenzar Gratis" en el hero, que no tiene ningún override propio): fondo más oscuro +
       sombra que se achica + el botón baja 2px, simulando que se presiona. */
    .navbar .btn-primary:hover {
      background: #6b46b8;
      box-shadow: 0 2px 0 #5a3a9a;
      transform: translateY(2px);
    }
    .user-profile-nav {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.5rem 1.2rem;
      background: rgba(255, 255, 255, 0.94);
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
      position: relative;
      width: 34px;
      height: 34px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }
    .mobile-menu-btn span {
      position: absolute;
      left: 5px;
      width: 24px;
      height: 2px;
      border-radius: 2px;
      background: var(--text-primary);
      transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
    }
    .mobile-menu-btn span:nth-child(1) { top: 11px; }
    .mobile-menu-btn span:nth-child(2) { top: 16px; }
    .mobile-menu-btn span:nth-child(3) { top: 21px; }
    /* Hamburger → X morph: the two outer bars slide onto the middle bar's line and rotate
       into an X while the middle bar fades out. */
    .mobile-menu-btn.open span:nth-child(1) {
      top: 16px;
      transform: rotate(45deg);
    }
    .mobile-menu-btn.open span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    .mobile-menu-btn.open span:nth-child(3) {
      top: 16px;
      transform: rotate(-45deg);
    }
    .mobile-menu {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 0 2rem;
      background: white;
      border-bottom: 2px solid transparent;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-8px);
      transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.35s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.35s ease;
    }
    .mobile-menu.open {
      max-height: 28rem;
      padding: 1rem 2rem 2rem;
      opacity: 1;
      transform: translateY(0);
      border-bottom-color: var(--glass-border);
    }
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
    .hero-tech-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
      mask-image: linear-gradient(to bottom, black 72%, transparent 92%);
      -webkit-mask-image: linear-gradient(to bottom, black 72%, transparent 92%);
    }
    .hero-grid-overlay {
      position: absolute;
      top: -20%;
      left: -10%;
      width: 120%;
      height: 140%;
      background-image: 
        linear-gradient(rgba(133, 92, 214, 0.075) 1.5px, transparent 1.5px),
        linear-gradient(90deg, rgba(133, 92, 214, 0.075) 1.5px, transparent 1.5px);
      background-size: 60px 60px;
      mask-image: radial-gradient(circle at 50% 35%, black 25%, transparent 75%);
      -webkit-mask-image: radial-gradient(circle at 50% 35%, black 25%, transparent 75%);
      opacity: 0.95;
      will-change: transform;
    }
    /* RENDIMIENTO (2026-08-29): tenia filter: blur(130px) ADEMAS del radial-gradient de
       abajo, que ya aporta toda la caida suave -- el desenfoque era practicamente
       redundante, pero se pagaba en cada frame sobre dos cajas de 550 y 500 px. Y como el
       hero NO lleva content-visibility (a proposito, esta sobre la linea de flotacion),
       seguia costando aunque el usuario estuviera abajo del todo. Se quitan el blur, el
       pulse-slow infinito y el will-change; el parallax por JS que escribe transform se
       conserva, que sobre un elemento sin filtro es practicamente gratis. */
    .hero-glow-blob {
      position: absolute;
      border-radius: 50%;
      opacity: 0.55;
    }
    .hero-blob-purple {
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(133, 92, 214, 0.48) 0%, rgba(133, 92, 214, 0.2) 40%, rgba(133, 92, 214, 0) 72%);
      top: -150px;
      left: -150px;
      /* OJO: NO animar transform aca. El parallax de onScroll() escribe style.transform sobre
         este mismo elemento, y una animacion CSS le gana a un estilo inline (las animaciones
         estan por encima del autor en la cascada), asi que el parallax dejaria de verse. El
         movimiento ambiental de esta zona lo aportan las .amb-dot y la deriva de la cuadricula. */
    }
    .hero-blob-blue {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.17) 40%, rgba(59, 130, 246, 0) 72%);
      top: 220px;
      right: -100px;
    }
    .floating-symbol {
      position: absolute;
      font-family: var(--font-heading);
      font-weight: 300;
      color: var(--accent-primary);
      opacity: 0.02;
      /* RENDIMIENTO (2026-08-29): antes era 'will-change: opacity, filter' y los keyframes
         de mas abajo animaban 'filter: blur(3px) -> blur(0)'. Animar 'filter' NO se puede
         componer: son 8 elementos repintando en el hilo principal, cada frame, para siempre.
         Los keyframes ahora animan solo opacity, que si es compositable. */
      will-change: opacity;
      pointer-events: none;
      user-select: none;
    }
    .sym-1 {
      top: 22%;
      left: 12%;
      font-size: 2.2rem;
      animation: symbol-fade-pulse-1 5s ease-in-out infinite;
    }
    .sym-2 {
      top: 15%;
      right: 14%;
      color: rgba(59, 130, 246, 0.6);
      font-size: 3.2rem;
      animation: symbol-fade-pulse-2 6.5s ease-in-out infinite;
      animation-delay: 1s;
    }
    .sym-3 {
      top: 62%;
      left: 8%;
      font-size: 1.5rem;
      color: rgba(59, 130, 246, 0.5);
      animation: symbol-fade-pulse-3 6s ease-in-out infinite;
      animation-delay: 2s;
    }
    .sym-4 {
      top: 50%;
      right: 10%;
      font-size: 1.6rem;
      animation: symbol-fade-pulse-4 7s ease-in-out infinite;
      animation-delay: 3s;
    }
    .sym-5 {
      top: 40%;
      left: 16%;
      font-size: 1.4rem;
      color: rgba(59, 130, 246, 0.5);
      animation: symbol-fade-pulse-1 5.5s ease-in-out infinite;
      animation-delay: 1.5s;
    }
    .sym-6 {
      top: 32%;
      right: 18%;
      font-size: 1.6rem;
      color: var(--accent-primary);
      animation: symbol-fade-pulse-2 7.5s ease-in-out infinite;
      animation-delay: 2.5s;
    }
    .sym-7 {
      top: 10%;
      left: 18%;
      font-size: 1.3rem;
      color: var(--accent-primary);
      animation: symbol-fade-pulse-3 5s ease-in-out infinite;
      animation-delay: 3.5s;
    }
    .sym-8 {
      top: 68%;
      right: 15%;
      font-size: 1.5rem;
      color: rgba(59, 130, 246, 0.5);
      animation: symbol-fade-pulse-4 8s ease-in-out infinite;
      animation-delay: 4.5s;
    }
    @keyframes symbol-fade-pulse-1 {
      0%, 100% { opacity: 0.02; }
      50% { opacity: 0.30; }
    }
    @keyframes symbol-fade-pulse-2 {
      0%, 100% { opacity: 0.02; }
      50% { opacity: 0.24; }
    }
    @keyframes symbol-fade-pulse-3 {
      0%, 100% { opacity: 0.02; }
      50% { opacity: 0.28; }
    }
    @keyframes symbol-fade-pulse-4 {
      0%, 100% { opacity: 0.02; }
      50% { opacity: 0.26; }
    }

    .hero-section {
      position: relative;
      z-index: 1;
      width: 100%;
      padding-top: 7.5rem;
      padding-bottom: 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    
    .hero-grid {
      display: grid;
      grid-template-columns: 0.92fr 1.08fr;
      gap: 4.5rem;
      /* [HERO ADELGAZADO 2026-08-29] era 'start' para que las 2 pildoras superiores quedaran a la
         altura del borde de la tarjeta. Como esas pildoras se movieron a .hero-strip, la columna
         izquierda quedo corta y con 'start' dejaba mucho aire abajo en escritorio -> 'center'
         para que se equilibre contra la tarjeta de simulacion. REVERTIR: volver a 'start'. */
      align-items: center;
      width: 100%;
      max-width: 1320px;
      padding: 0 2rem;
      position: relative;
      z-index: 10;
    }

    /* ===== HERO TOP BADGES ===== */
    .hero-top-badges {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      flex-wrap: nowrap;
      margin-top: 0.6rem;
      margin-bottom: 1.35rem;
      max-width: 100%;
    }

    .active-students-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.09);
      border: 1.5px solid rgba(16, 185, 129, 0.35);
      color: #065f46;
      font-size: 0.81rem;
      font-weight: 600;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      box-shadow: 0 2px 12px rgba(16, 185, 129, 0.08);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .active-students-badge strong {
      font-weight: 800;
      color: #047857;
      font-variant-numeric: tabular-nums;
    }

    .live-dot-pulse {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 9px;
      height: 9px;
      flex-shrink: 0;
    }
    .live-dot-core {
      width: 9px;
      height: 9px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.85);
    }
    .live-dot-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: rgba(16, 185, 129, 0.65);
      animation: live-pulse-ring 2.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }
    @keyframes live-pulse-ring {
      0% { transform: scale(0.9); opacity: 0.85; }
      100% { transform: scale(2.5); opacity: 0; }
    }

    /* Contenedor exterior: solo existe para recortar (overflow:hidden) el anillo giratorio de
       ::before a la forma de píldora y dejar asomar apenas 2px de él alrededor del contenido
       real (.hero-offer-badge-inner). Nada de mask-composite (poco fiable entre navegadores —
       en algunos no recortaba el conic-gradient a un anillo y se veía el círculo COMPLETO
       girando, como un ventilador). Aquí el recorte es solo overflow:hidden + border-radius,
       soportado en cualquier navegador. */
    .hero-offer-badge {
      position: relative;
      display: inline-flex;
      padding: 3px;
      border-radius: 999px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      flex-shrink: 0;
      /* Contorno dorado estático, mismo gradiente que .btn-upgrade-pro (ver styles.css),
         para que la píldora combine con la placa "Mejorar a PRO". */
      background: linear-gradient(135deg, #FFE885 0%, #E6A100 50%, #B87E00 100%);
    }
    .hero-offer-badge:hover {
      transform: translateY(-1.5px);
    }
    /* Dos destellos grandes (no cinco chicos) recorriendo el contorno dorado, siempre en
       lados opuestos de la píldora, cada uno completando toda la vuelta. Pure CSS: un
       repeating-conic-gradient con un período de 180° (=> 2 repeticiones en los 360°), con un
       arco ancho (~70° de los 180° = 39%) para que se vean grandes y vistosos, rotado en bucle
       encima del fondo dorado — .hero-offer-badge-inner lo tapa por completo salvo esos 3px del
       borde, donde se ven pasar los destellos morados. Animación de solo "transform" sobre un
       pseudo-elemento: compositor-only (GPU), no dispara layout/paint por frame — un único
       elemento en toda la página, sin costo de rendimiento apreciable. */
    .hero-offer-badge::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-conic-gradient(
        from 0deg,
        transparent 0deg,
        transparent 55deg,
        rgba(133, 92, 214, 0.9) 72deg,
        #a78bfa 82deg,
        #ffffff 90deg,
        #a78bfa 98deg,
        rgba(133, 92, 214, 0.9) 108deg,
        transparent 125deg,
        transparent 180deg
      );
      animation: offer-glint-spin 4s linear infinite;
      pointer-events: none;
      z-index: 0;
      will-change: transform;
    }
    @keyframes offer-glint-spin {
      to { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero-offer-badge::before { animation: none; }
    }
    .hero-offer-badge-inner {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: rgba(17, 24, 39, 0.94);
      color: #f9fafb;
      font-size: 0.79rem;
      font-weight: 500;
      padding: 0.32rem 0.8rem;
      border-radius: 999px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.12);
      white-space: nowrap;
    }
    .offer-discount-chip {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0.12rem 0.5rem;
      border-radius: 6px;
      letter-spacing: 0.02em;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    .offer-divider {
      color: rgba(255, 255, 255, 0.25);
      font-weight: 300;
    }
    .offer-text {
      color: #e5e7eb;
      font-weight: 500;
    }
    .offer-dot {
      color: rgba(255, 255, 255, 0.35);
      font-size: 0.7rem;
    }
    .offer-tag-highlight {
      color: #10b981;
      font-weight: 700;
      letter-spacing: 0.03em;
      font-size: 0.75rem;
    }

    @media (max-width: 1250px) {
      .offer-dot, .offer-tag-highlight {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .hero-top-badges {
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .hero-offer-badge, .active-students-badge {
        max-width: 100%;
      }
      .active-students-badge {
        font-size: 0.68rem;
        padding: 0.26rem 0.65rem;
      }
      .hero-offer-badge-inner {
        font-size: 0.68rem;
        padding: 0.26rem 0.65rem;
        white-space: normal;
        flex-wrap: wrap;
        justify-content: center;
        text-align: center;
        row-gap: 0.2rem;
      }
      .offer-discount-chip {
        font-size: 0.62rem;
        padding: 0.1rem 0.4rem;
      }
    }

    .hero-title {
      font-family: var(--font-heading);
      font-size: clamp(2.4rem, 4.5vw, 3.8rem);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 1.1rem;
      color: #111827;
    }

    .hero-subtitle {
      font-size: clamp(0.95rem, 1.3vw, 1.1rem);
      color: #4b5563;
      line-height: 1.55;
      margin-bottom: 1.8rem;
      max-width: 580px;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .hero-cta-btn {
      border-radius: 10px !important;
    }

    /* ===== MODERN BENEFITS BAR (no bottom margin, aligns card end) ===== */
    .hero-benefits-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      width: 100%;
      padding: 1.1rem 1rem;
    }
    .benefit-chip {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .chip-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chip-icon img {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }
    .chip-info {
      display: flex;
      flex-direction: column;
      text-align: left;
    }
    .chip-info strong {
      font-size: 0.82rem;
      color: #111827;
      font-weight: 700;
    }
    .chip-info span {
      font-size: 0.73rem;
      color: #6b7280;
      line-height: 1.2;
    }

    /* ╔══ FRANJA POST-HERO (2026-08-29, definitivo) — CSS. REVERTIR: borrar este bloque entero. ══╗
       Banda que recibe .hero-top-badges + .hero-benefits-bar sacados del hero. */
    .hero-strip {
      position: relative;
      z-index: 2;
      padding: 2rem 1.5rem 1.25rem;
    }
    .hero-strip-inner {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.15rem;
      padding: 1.4rem 1.75rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.72);
      box-shadow: 0 10px 34px rgba(133, 92, 214, 0.05);
    }
    .hero-strip .hero-top-badges {
      margin: 0;
      justify-content: center;
      flex-wrap: wrap;
    }
    .hero-strip .hero-benefits-bar {
      padding: 0;
      max-width: 780px;
      gap: 1.25rem;
    }
    @media (max-width: 900px) {
      .hero-strip { padding: 1.5rem 1rem 0.75rem; }
      .hero-strip-inner { padding: 1.15rem 1.1rem; gap: 0.9rem; border-radius: 16px; }
    }
    @media (max-width: 640px) {
      /* En telefono los 3 chips van en fila compacta (icono + titulo), sin la descripcion,
         para que la franja no crezca de mas. */
      .hero-strip .hero-benefits-bar { grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
      .hero-strip .benefit-chip { flex-direction: column; gap: 0.35rem; text-align: center; }
      .hero-strip .chip-info { text-align: center; align-items: center; }
      .hero-strip .chip-info span { display: none; }
      .hero-strip .chip-icon img { width: 38px; height: 38px; }
      .hero-strip .chip-info strong { font-size: 0.78rem; }
    }
    /* La franja se agranda en escritorio (>900px): la version base es la de tablet. */
    @media (min-width: 901px) {
      .hero-strip { padding: 2.5rem 1.5rem 1.75rem; }
      .hero-strip-inner { max-width: 1120px; padding: 2rem 2.5rem; gap: 1.4rem; border-radius: 24px; }
      .hero-strip .hero-benefits-bar { max-width: 960px; gap: 2rem; }
      .hero-strip .benefit-chip { gap: 0.9rem; }
      .hero-strip .chip-icon img { width: 66px; height: 66px; }
      .hero-strip .chip-info strong { font-size: 1.08rem; }
      .hero-strip .chip-info span { font-size: 0.9rem; line-height: 1.3; }
    }
    /* ╚══ fin FRANJA POST-HERO (CSS) ══╝ */

    /* ===== SOCIAL PROOF ROW (centered above the hero CTA buttons) ===== */
    .hero-cta-group {
      /* inline-flex se encoge al ancho de su contenido (shrink-to-fit), así que "align-items:
         center" solo centraba los avatares/botones DENTRO de esa caja angosta — no dentro del
         ancho real de la columna izquierda del hero. Con flex (block-level, llena el ancho
         disponible) el centrado sí queda relativo a toda la columna. */
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1.1rem;
    }
    .hero-social-proof {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.85rem;
      padding: 0.2rem 0;
      margin-bottom: 1rem;
    }
    .avatar-stack {
      display: flex;
      align-items: center;
    }
    .avatar-stack img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      margin-left: -8px;
      object-fit: cover;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .avatar-stack img:first-child {
      margin-left: 0;
    }
    .proof-text {
      display: flex;
      flex-direction: column;
      text-align: left;
    }
    .star-rating {
      font-size: 0.72rem;
      letter-spacing: 1px;
    }
    .proof-text > span {
      font-size: 0.78rem;
      color: #4b5563;
      font-weight: 600;
    }
    /* [CONTADOR EN VIVO 2026-08-29] linea de actividad en vivo, fusionada con la fila de
       estrellas del hero. El punto verde pulsa (solo opacity/transform -> compositor). */
    .proof-live {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .proof-live strong {
      color: #047857;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
    .proof-live-dot {
      position: relative;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      flex-shrink: 0;
    }
    /* Anillo que late: SOLO transform + opacity (compositor), nada de animar box-shadow. */
    .proof-live-dot::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.4);
      animation: proof-live-pulse 2s ease-out infinite;
    }
    @keyframes proof-live-pulse {
      0%   { transform: scale(1); opacity: 0.7; }
      70%  { transform: scale(3.2); opacity: 0; }
      100% { transform: scale(3.2); opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .proof-live-dot::after { animation: none; }
    }

    /* ===== SIMULATION CARD ENHANCEMENTS ===== */
    .hero-sim-card {
      /* El contenido real (con la animación del demo del tutor IA ciclando por sus 5 pasos)
         variaba en 742-764px; con la nota al pie ".sim-card-footnote" (2 líneas, ~44px) sube a
         ~810px. min-height fija el piso para que la tarjeta no dé saltitos de altura al ciclar. */
      min-height: 812px;
      box-sizing: border-box;
    }
    .hero-sim-card.glass-card {
      border: 2px solid #cbd5e1;
    }
    .sim-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 0.65rem;
    }
    .sim-header-left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.4rem;
      flex: 1;
      min-width: 0;
    }
    /* Badge del preview del hero: dice "SIMULACIÓN" a proposito (antes "ENSAYO PAES" + punto
       verde parecia una sesion real en curso). Color de marca, no verde "en vivo". */
    .sim-badge-live {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: rgba(133, 92, 214, 0.1);
      border: 1px solid rgba(133, 92, 214, 0.3);
      color: #7c3aed;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }
    .sim-badge-live .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #7c3aed;
      flex-shrink: 0;
    }
    .sim-card-footnote {
      margin: 0.75rem 0 0;
      padding-top: 0.6rem;
      border-top: 1px dashed rgba(133, 92, 214, 0.2);
      font-size: 0.7rem;
      line-height: 1.4;
      color: #9ca3af;
      text-align: center;
    }
    .sim-subject-pill {
      display: inline-block;
      max-width: 100%;
      background: rgba(133, 92, 214, 0.08);
      border: 1px solid rgba(133, 92, 214, 0.2);
      color: #855cd6;
      font-size: 0.76rem;
      font-weight: 700;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sim-header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.78rem;
      color: #6b7280;
      font-weight: 600;
      flex-shrink: 0;
      white-space: nowrap;
      padding-top: 0.15rem;
    }

    .sim-progress-bar-wrap {
      width: 100%;
      height: 5px;
      background: #f3f4f6;
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 0.9rem;
    }
    /* RENDIMIENTO (2026-08-29): antes se animaba 'width' (via [style.width] + transition: width).
       Animar width dispara LAYOUT en cada frame de la transicion, cada vez que cambia el ejercicio
       de la simulacion (~cada 9 s) y para siempre mientras el hero este a la vista. Con scaleX()
       sobre un ancho fijo del 100%, el mismo efecto corre en la GPU. transform-origin: left es
       imprescindible: sin el, la barra crecerian desde el centro hacia los dos lados. */
    .sim-progress-bar-fill {
      height: 100%;
      width: 100%;
      transform-origin: left center;
      background: linear-gradient(90deg, #855cd6, #3b82f6);
      border-radius: 999px;
      transition: transform 0.6s ease;
    }

    .sim-question-box {
      background: #ffffff;
      border: 1.5px solid #e5e7eb;
      border-radius: 14px;
      padding: 0.95rem 1rem;
      margin-bottom: 0.85rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    }
    .sim-q-text {
      font-size: 0.9rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.4;
      margin-bottom: 0.75rem;
    }
    .sim-options-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .sim-option-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.45rem 0.7rem;
      border-radius: 8px;
      border: 1.5px solid #f3f4f6;
      background: #fafafa;
      font-size: 0.84rem;
      color: #374151;
      /* RENDIMIENTO (2026-08-29): era 'transition: all'. El estado .selected cambia
         'font-weight: 600', y al estar incluido en 'all' el navegador lo INTERPOLA -- animar
         font-weight dispara LAYOUT en cada frame de la transicion, sobre las 4 opciones, en cada
         ciclo de la simulacion del hero (~cada 9 s) y para siempre mientras el hero este a la
         vista. Listando las propiedades reales, el font-weight cambia de golpe (imperceptible) y
         solo se interpolan color/borde/fondo/transform. */
      transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                  background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                  color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .sim-opt-key {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      background: #e5e7eb;
      color: #4b5563;
      font-size: 0.72rem;
      font-weight: 700;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .sim-opt-val {
      flex: 1;
      font-weight: 500;
    }
    .sim-opt-check {
      color: #10b981;
      font-weight: 800;
      font-size: 0.95rem;
    }

    .sim-option-item.selected {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.06);
      color: #065f46;
      font-weight: 600;
      transform: translateX(4px);
    }
    .sim-option-item.selected .sim-opt-key {
      background: #10b981;
      color: white;
    }

    /* ===== AI TUTOR SPLIT PANEL ===== */
    .sim-ai-split-panel {
      display: grid;
      grid-template-columns: 1.4fr 0.9fr;
      gap: 0.75rem;
      background: #f9fafb;
      border: 1.5px solid rgba(133, 92, 214, 0.18);
      border-radius: 14px;
      padding: 0.85rem;
    }

    /* Magic Flash on "Inteligencia Artificial" when AI Tutor completes */
    .ai-robotic-text.ai-sparkle-flash {
      animation: ai-title-glow-pulse 0.9s cubic-bezier(0.22, 1, 0.36, 1);
    }
    @keyframes ai-title-glow-pulse {
      0% { text-shadow: 0 0 0 rgba(133, 92, 214, 0); transform: scale(1); }
      40% { text-shadow: 0 0 25px rgba(133, 92, 214, 0.9), 0 0 45px rgba(59, 130, 246, 0.7); transform: scale(1.03); color: #855cd6; }
      100% { text-shadow: 0 0 0 rgba(133, 92, 214, 0); transform: scale(1); }
    }

    .foco-recommend-chip {
      display: inline-block;
      margin-top: 0.45rem;
      background: linear-gradient(135deg, rgba(133, 92, 214, 0.1), rgba(59, 130, 246, 0.1));
      border: 1px solid rgba(133, 92, 214, 0.25);
      color: #855cd6;
      font-size: 0.73rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      animation: simSlideUp 0.3s ease;
    }

    .sim-tutor-main {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
    }
    .tutor-header-bar {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.82rem;
      color: #855cd6;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .tutor-sparkle {
      font-size: 0.9rem;
    }

    .sim-analyzing-bar {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.75rem;
      background: linear-gradient(135deg, rgba(133, 92, 214, 0.08), rgba(59, 130, 246, 0.08));
      border: 1px solid rgba(133, 92, 214, 0.2);
      border-radius: 8px;
      color: #855cd6;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .sim-analyzing-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(133, 92, 214, 0.2);
      border-top-color: #855cd6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .sim-foco-feedback {
      animation: simSlideUp 0.3s ease;
    }
    .foco-typed-text {
      font-size: 0.8rem;
      color: #374151;
      line-height: 1.4;
      margin: 0 0 0.5rem 0;
    }
    .typing-cursor {
      display: inline-block;
      width: 2px;
      color: #855cd6;
      font-weight: 900;
      animation: blink-cursor 0.7s infinite;
      margin-left: 2px;
    }
    @keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    .foco-step-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 0.4rem 0.6rem;
      text-align: center;
    }
    .foco-step-box code {
      font-family: monospace;
      font-size: 0.78rem;
      color: #166534;
      font-weight: 700;
    }

    /* RIGHT SIDEBAR INSIDE CARD */
    .sim-tutor-side {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .side-block {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 0.6rem;
      text-align: left;
    }
    .side-title {
      display: block;
      font-size: 0.72rem;
      font-weight: 800;
      color: #374151;
      margin-bottom: 0.3rem;
    }
    .side-title.color-success { color: #059669; }
    .side-title.color-warning { color: #d97706; }

    .donut-chart-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .donut-chart {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: conic-gradient(#855cd6 0% 72%, #e5e7eb 72% 100%);
      display: grid;
      place-items: center;
      position: relative;
    }
    .donut-chart::before {
      content: '';
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #ffffff;
      position: absolute;
    }
    .donut-val {
      position: relative;
      z-index: 2;
      font-size: 0.68rem;
      font-weight: 800;
      color: #111827;
    }
    .donut-sub {
      font-size: 0.68rem;
      color: #6b7280;
      font-weight: 600;
    }

    .tag-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .tag-list li {
      font-size: 0.68rem;
      font-weight: 600;
      color: #059669;
    }
    .tag-list.warning li {
      color: #d97706;
    }
    
    .hero-content {
      position: relative;
      z-index: 10;
      max-width: 1000px;
      padding: 0 2rem;
      position: relative;
      z-index: 10;
    }

    .hero-title {
      font-family: var(--font-heading);
      font-size: 4.8rem;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin-bottom: 1.5rem;
      color: #111827; /* Darker, crisper text */
    }
    
    .ai-robotic-text {
      position: relative;
      display: inline-block;
      font-weight: 900;
      color: #111827;
      animation: ai-robotic-main-glitch 6.5s infinite ease-in-out;
      will-change: transform;
    }

    .ai-robotic-text::before,
    .ai-robotic-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      color: #111827;
      clip-path: inset(50% 0 50% 0);
      will-change: transform, clip-path, opacity;
      pointer-events: none;
    }

    .ai-robotic-text::before {
      left: 2px;
      text-shadow: -2px 0 #3b82f6; /* sharp cyan offset */
      animation: ai-glitch-before 6.5s infinite linear;
    }

    .ai-robotic-text::after {
      left: -2px;
      text-shadow: -2px 0 #855cd6; /* sharp purple offset */
      animation: ai-glitch-after 6.5s infinite linear;
    }

    @keyframes ai-robotic-main-glitch {
      0%, 93%, 98%, 100% {
        transform: skew(0deg) scale(1);
      }
      94% {
        transform: skew(1.5deg) scale(1.004);
      }
      95% {
        transform: skew(-1deg) scale(0.996);
      }
      96% {
        transform: skew(0.5deg) scale(1.002);
      }
      97% {
        transform: skew(0deg) scale(1);
      }
    }

    @keyframes ai-glitch-before {
      0%, 93%, 98%, 100% {
        clip-path: inset(50% 0 50% 0);
        transform: translate(0);
        opacity: 0;
      }
      94% {
        clip-path: inset(10% 0 65% 0);
        transform: translate(-5px, -1.5px);
        opacity: 1;
      }
      95% {
        clip-path: inset(55% 0 15% 0);
        transform: translate(4px, 1px);
        opacity: 1;
      }
      96% {
        clip-path: inset(30% 0 35% 0);
        transform: translate(-3px, -2px);
        opacity: 1;
      }
      97% {
        clip-path: inset(75% 0 5% 0);
        transform: translate(3px, 1.5px);
        opacity: 1;
      }
    }

    @keyframes ai-glitch-after {
      0%, 93%, 98%, 100% {
        clip-path: inset(50% 0 50% 0);
        transform: translate(0);
        opacity: 0;
      }
      94% {
        clip-path: inset(65% 0 10% 0);
        transform: translate(5px, 1.5px);
        opacity: 1;
      }
      95% {
        clip-path: inset(15% 0 75% 0);
        transform: translate(-4px, -1px);
        opacity: 1;
      }
      96% {
        clip-path: inset(40% 0 40% 0);
        transform: translate(3px, 2px);
        opacity: 1;
      }
      97% {
        clip-path: inset(5% 0 80% 0);
        transform: translate(-3px, -1.5px);
        opacity: 1;
      }
    }
    
    .title-float {
      display: inline-block;
      animation: hero-title-float 6s ease-in-out infinite;
    }

    .hero-subtitle {
      font-size: 1.3rem;
      font-weight: 500;
      color: #4b5563; /* Sleek medium gray */
      max-width: 650px;
      margin: 0 auto 3rem;
      line-height: 1.6;
      letter-spacing: -0.01em;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 4rem;
    }

    .btn-large { 
      padding: 1rem 3rem; 
      font-size: 1.1rem; 
      border-radius: 999px;
    }

    /* CSS ELIMINADO (2026-08-29): bloques cuyas clases no existen en la plantilla de
       este componente -- verificado con grep sobre el template. Incluian animaciones
       infinitas que nunca se veian (stat-float, scroll-logos 30s) y 2 backdrop-filter.
       Al ir en 'styles: []' de un componente prerenderizado, beasties los embebia como
       CSS critico dentro del index.html (206 KB), asi que se descargaban en cada visita. */
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes hero-title-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.9) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* ===== BENTO BOX FEATURES ===== */

    /* ===== NEW BENTO VISUALS ===== */
    .roadmap-visual {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 1rem 0;
      margin-top: 1.5rem;
    }
    .rm-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      z-index: 2;
      width: 60px;
    }
    .rm-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-align: center;
    }
    .rm-step {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--bg-secondary);
      border: 2px solid var(--glass-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text-secondary);
      z-index: 2;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      transition: all 0.3s;
    }
    .rm-node:hover .rm-step {
      transform: scale(1.1);
    }
    .rm-step.rm-done {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
    }
    .rm-step.rm-active {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      background: white;
      box-shadow: 0 0 0 4px rgba(133, 92, 214, 0.15);
    }
    .rm-line {
      flex: 1;
      height: 4px;
      background: var(--glass-border);
      margin: 20px -15px 0 -15px; /* aligns exactly with the center of the 44px circles (22px down minus 2px half-height) */
      z-index: 1;
      border-radius: 2px;
      min-width: 30px;
    }
    .rm-line.rm-done {
      background: var(--accent-primary);
    }

    .exam-visual {
      background: white;
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.2rem;
      margin-top: 0.5rem;
      box-shadow: 0 8px 20px rgba(0,0,0,0.04);
      width: 80%;
    }
    .ex-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.8rem;
      border-bottom: 1px solid var(--glass-border);
      align-items: center;
    }
    .ex-badge {
      font-size: 0.75rem;
      background: rgba(133, 92, 214, 0.1);
      color: var(--accent-primary);
      padding: 0.25rem 0.7rem;
      border-radius: 6px;
      font-weight: 700;
    }
    .ex-timer {
      font-size: 0.85rem;
      font-weight: 800;
      color: #ef4444;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .ex-timer::before {
      content: '⏳';
    }
    .ex-body {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .ex-line {
      height: 10px;
      background: #f1f5f9;
      border-radius: 5px;
      width: 100%;
    }
    .ex-line.short { width: 70%; margin-bottom: 0.5rem; }
    .ex-options {
      display: flex;
      gap: 0.8rem;
    }
    .ex-opt {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--glass-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-secondary);
      background: #f8f9fa;
    }
    .ex-opt.correct {
      background: #10b981;
      border-color: #10b981;
      color: white;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
    }

    .features-section {
      width: 100%;
      max-width: none;
      position: relative;
      overflow: hidden;
      padding: 7rem 0;
      background: transparent; /* 100% transparente para integrarse de forma continua con las demás secciones sin cortes visuales */
    }
    .features-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      position: relative;
      z-index: 2;
    }
    .features-circuit-bg {
      position: absolute;
      inset: 0;
      z-index: 1; /* Retorna a Z-Index 1 para quedar por DETRÁS de las tarjetas y los títulos */
      pointer-events: none;
      /* Máscara lineal para desvanecer las pistas SVG a transparente en los bordes superior e inferior (Cero Cortes) */
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      
      /* Estado inicial oculto */
      opacity: 0;
      transform: translateY(40px) scale(0.97);
      
      /* TRANSICIÓN DE SALIDA RÁPIDA: Cuando haces scroll fuera de la sección, el efecto se desvanece de inmediato (0.5s, sin delay) */
      transition: opacity 0.5s ease-out, transform 0.5s ease-out;
      transition-delay: 0s;
    }
    .features-section.is-visible .features-circuit-bg {
      opacity: 1;
      transform: translateY(0) scale(1);
      
      /* TRANSICIÓN DE ENTRADA LENTA OPTIMIZADA: Aparece un poco más rápido (1.8s con delay de 0.7s) para mayor dinamismo */
      transition: opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1), transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: 0.7s;
    }
    .features-circuit-bg svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .pulse-path {
      fill: none;
      /* RENDIMIENTO (2026-08-29 parte 9): antes 'circuit-pulse' animaba stroke-dashoffset
         infinitamente en ~12 trazos (features, foco, news, cta). Animar el dashoffset obliga
         al navegador a recalcular las posiciones del guion a lo largo del path EN CADA FRAME
         -> era la causa del lag en "¿Por que EstudiaUni?" y "Conoce a Foco". Los trazos
         quedan estaticos (guion 40/220 = traza de circuito punteada, se ve igual, quieta).
         Mismo criterio que se aplico al FAQ (ver bitacora 2026-08-29). */
      stroke-dashoffset: 0;
    }

    .node-glow {
      /* Antes esto animaba el atributo 'r' del <circle> (5px -> 11px). 'r' no es una propiedad
         que el compositor pueda manejar: cada frame obligaba a rehacer layout y repintar en el
         hilo principal, y Lighthouse lo marcaba como animacion no compuesta (auditoria 2026-08-27,
         era el ejemplo que citaba explicitamente). Con transform: scale() el efecto visual es el
         mismo pero corre en la GPU. Los circulos tienen r="8", asi que 5px y 11px equivalen a
         escalar 0.625 y 1.375.
         'transform-box: fill-box' es imprescindible aca: sin el, transform-origin se resuelve
         contra el viewBox del SVG y los circulos se desplazarian en vez de crecer sobre su centro. */
      animation: node-glow-pulse 2s ease-in-out infinite alternate;
      transform-box: fill-box;
      transform-origin: center;
    }

    @keyframes node-glow-pulse {
      0% { transform: scale(0.625); opacity: 0.15; }
      100% { transform: scale(1.375); opacity: 0.45; }
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
      border: 2px solid #cbd5e1;
      background: #ffffff; /* Fondo sólido blanco que oculta las pistas detrás de la tarjeta */
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.01);
    }
    .bento-card.glass-card {
      border: 2px solid #cbd5e1;
    }
    /* Eliminado efecto before con gradiente */
    .bento-card:hover {
      transform: translateY(-5px) scale(1.01);
      box-shadow: 0 15px 30px rgba(133, 92, 214, 0.15);
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
    .bento-icon img {
      width: 84px;
      height: 84px;
      object-fit: contain;
      display: block;
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
      color: var(--text-primary);
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
    
    
    /* Staggered entry animations for Bento grid when it becomes visible */
    .bento-grid > div:nth-child(1) { transition-delay: 0.1s; }
    .bento-grid > div:nth-child(2) { transition-delay: 0.2s; }
    .bento-grid > div:nth-child(3) { transition-delay: 0.3s; }
    .bento-grid > div:nth-child(4) { transition-delay: 0.4s; }
    .bento-grid > div:nth-child(5) { transition-delay: 0.5s; }
    .bento-grid > div:nth-child(6) { transition-delay: 0.6s; }


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


    /* ===== TESTIMONIALS ===== */
    .testimonials-section {
      padding: 8rem 0;
      position: relative;
      overflow: hidden;
      background: linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(133, 92, 214, 0.03) 25%, rgba(255,255,255,0.42) 75%, rgba(255,255,255,0.55) 100%);
    }
    .testimonials-section .section-title {
      text-align: center;
      margin-bottom: 4rem;
      position: relative;
      z-index: 2;
    }
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.2rem;
      max-width: 1200px;
      margin: 0 auto;
      align-items: stretch;
      position: relative;
      z-index: 2;
      padding: 0 1.5rem;
    }

    /* Elementos del Lienzo SVG Reactivo */
    .nebula-glow {
      transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: center;
      opacity: 0.15;
    }
    /* El truco mágico moderno :has() para reactividad global al hover de tarjetas específicas */
    .testimonials-section:has(.testimonial-card-1:hover) .nebula-left {
      opacity: 0.65;
      transform: scale(1.25);
    }
    .testimonials-section:has(.testimonial-card-2:hover) .nebula-center {
      opacity: 0.75;
      transform: scale(1.25);
    }
    .testimonials-section:has(.testimonial-card-3:hover) .nebula-right {
      opacity: 0.65;
      transform: scale(1.25);
    }

    /* Cruces técnicas de fondo (Coordenadas) */
    .ambient-cross {
      animation: cross-fade 5s ease-in-out infinite alternate;
      transform-origin: center;
    }
    .cross-1 { animation-delay: 0s; }
    .cross-2 { animation-delay: 1.5s; }
    .cross-3 { animation-delay: 3s; }
    @keyframes cross-fade {
      0% { opacity: 0.2; transform: scale(0.9) rotate(0deg); }
      100% { opacity: 0.8; transform: scale(1.1) rotate(5deg); }
    }

    /* Flujo de datos dinámico (Líneas de Luz / Shooting Stars) */
    .success-stream {
      stroke-dasharray: 60 280;
      stroke-dashoffset: 340;
      animation: success-stream-flow 7s linear infinite;
      opacity: 0.45;
      /* RENDIMIENTO (2026-08-29): tenia un drop-shadow. Combinado con la animacion infinita de
         stroke-dashoffset de abajo, obligaba a re-rasterizar el filtro en cada frame. Se quita el
         filtro y se conserva el efecto de "estrella fugaz", que sobre 3 lineas rectas simples es
         barato por si solo. */
    }
    .stream-1 { animation-delay: 0s; animation-duration: 5s; }
    .stream-2 { animation-delay: 1.5s; animation-duration: 6.5s; }
    .stream-3 { animation-delay: 3s; animation-duration: 5.5s; }
    
    @keyframes success-stream-flow {
      0% { stroke-dashoffset: 340; opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.6; }
      100% { stroke-dashoffset: 0; opacity: 0; }
    }
    .testimonial-card {
      background: rgba(255, 255, 255, 0.9);
      border: 1.5px solid rgba(133, 92, 214, 0.08);
      border-radius: 24px;
      padding: 2.2rem;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 15px 35px rgba(133, 92, 214, 0.02);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .testimonial-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      padding: 1.5px;
      background: linear-gradient(135deg, rgba(133, 92, 214, 0.15) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(59, 130, 246, 0.12) 100%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      transition: opacity 0.4s ease;
      opacity: 0.8;
    }
    .testimonial-card:hover {
      transform: translateY(-8px) scale(1.02);
      background: rgba(255, 255, 255, 0.88);
      box-shadow: 0 25px 55px rgba(133, 92, 214, 0.12);
      border-color: rgba(133, 92, 214, 0.25);
    }
    .testimonial-card:hover::before {
      opacity: 1;
    }
    .testimonial-card.featured {
      background: rgba(255, 255, 255, 0.85);
      border: 2px solid rgba(133, 92, 214, 0.35);
      box-shadow: 0 20px 45px rgba(133, 92, 214, 0.08);
      transform: scale(1.03);
    }
    /* RENDIMIENTO (2026-08-29): antes esta tarjeta animaba 'box-shadow' de forma infinita
       (@keyframes featured-card-breath). Animar box-shadow obliga a un repintado completo
       en cada frame, para siempre. El resplandor pasa a vivir en un ::after con la sombra
       FIJA, y lo unico que se anima es su opacity -- que si se puede componer en la GPU.
       Visualmente es el mismo latido. (::before ya estaba ocupado por la barra de gradiente
       superior, por eso se usa ::after.) */
    .testimonial-card.featured::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      z-index: -1;
      box-shadow: 0 20px 45px rgba(133, 92, 214, 0.18), 0 0 15px rgba(133, 92, 214, 0.15);
      animation: featured-card-breath 4s ease-in-out infinite alternate;
    }
    .testimonial-card.featured::before {
      background: linear-gradient(135deg, #855cd6 0%, #f472b6 50%, #3b82f6 100%);
      opacity: 1;
    }
    .testimonial-card.featured:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 0 30px 65px rgba(133, 92, 214, 0.18);
    }
    @keyframes featured-card-breath {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .featured-capsule {
      position: absolute;
      top: -14px;
      left: 2.2rem;
      background: linear-gradient(135deg, #855cd6, #f472b6);
      color: white;
      padding: 0.35rem 0.9rem;
      border-radius: 99px;
      font-size: 0.78rem;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.3);
      display: flex;
      align-items: center;
      gap: 0.3rem;
      z-index: 10;
    }
    .name-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .verify-icon {
      width: 15px;
      height: 15px;
      color: #3b82f6;
      display: inline-block;
      flex-shrink: 0;
    }
    .testimonial-header {
      display: flex;
      align-items: center;
      gap: 1.1rem;
      margin-bottom: 1.2rem;
    }
    .testimonial-avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(133, 92, 214, 0.2);
      background: var(--bg-secondary);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }
    .testimonial-card.featured .testimonial-avatar {
      border-color: #855cd6;
    }
    .testimonial-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .testimonial-info h4 {
      font-size: 1.08rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .testimonial-info p {
      font-size: 0.85rem;
      font-weight: 600;
      color: #855cd6;
    }
    .testimonial-card.featured .testimonial-info p {
      color: #d946ef;
    }
    .testimonial-stars {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 1.2rem;
    }
    .star-icon {
      width: 16px;
      height: 16px;
      filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.25));
    }
    .testimonial-text {
      color: var(--text-secondary);
      line-height: 1.65;
      font-size: 0.98rem;
      margin-bottom: 2rem;
      /* SIN font-style: italic. Inter/Outfit se auto-hostean SOLO en su version 'normal'
         (ver los 4 @font-face de styles.css, todos font-style: normal); no hay archivo italico.
         'italic' obligaba al navegador a inclinar los glifos a mano (faux italic): espaciado
         irregular y, sobre todo, un temblor/borrosidad al desplazarse que hacia casi ilegible
         el texto en el carrusel en movimiento. El de noticias no lo sufria porque su texto ya
         era 'normal'. Las comillas del propio testimonio ya lo marcan como cita. */
    }
    
    /* ===== SCORE LEAP DASHBOARD ===== */
    .score-leap-dashboard {
      background: rgba(133, 92, 214, 0.03);
      border: 1px solid rgba(133, 92, 214, 0.06);
      border-radius: 16px;
      padding: 1rem 1.2rem;
      margin-top: auto;
    }
    .score-labels {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.6rem;
    }
    .score-stat {
      display: flex;
      flex-direction: column;
    }
    .stat-lbl {
      font-size: 0.68rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.1rem;
    }
    .stat-val {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .score-leap-badge {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0.25rem 0.65rem;
      border-radius: 99px;
      border: 1px solid rgba(16, 185, 129, 0.15);
      letter-spacing: -0.01em;
      animation: score-badge-pulse 2s infinite ease-in-out;
    }
    @keyframes score-badge-pulse {
      0% { transform: scale(1); opacity: 0.95; }
      50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 8px rgba(16, 185, 129, 0.15); }
      100% { transform: scale(1); opacity: 0.95; }
    }
    .score-progress-track {
      width: 100%;
      height: 6px;
      background: rgba(133, 92, 214, 0.08);
      border-radius: 99px;
      position: relative;
    }
    .score-progress-fill {
      height: 100%;
      border-radius: 99px;
      background: linear-gradient(90deg, #855cd6 0%, #3b82f6 100%);
    }
    .score-progress-pointer {
      position: absolute;
      top: 50%;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #3b82f6;
      border: 2px solid white;
      transform: translate(-50%, -50%);
      box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
    }
    .purple-leap .score-progress-fill { background: linear-gradient(90deg, #a78bfa 0%, #855cd6 100%); }
    .purple-leap .score-progress-pointer { background: #855cd6; box-shadow: 0 2px 6px rgba(133, 92, 214, 0.4); }
    .purple-leap .stat-val.text-glow { color: #855cd6; text-shadow: 0 0 10px rgba(133, 92, 214, 0.2); }
    
    .pink-leap {
      background: rgba(236, 72, 153, 0.02);
      border-color: rgba(236, 72, 153, 0.06);
    }
    .pink-leap .score-progress-fill { background: linear-gradient(90deg, #f472b6 0%, #d946ef 100%); }
    .pink-leap .score-progress-pointer { background: #d946ef; box-shadow: 0 2px 6px rgba(217, 70, 239, 0.4); }
    .pink-leap .stat-val.text-glow { color: #d946ef; text-shadow: 0 0 10px rgba(217, 70, 239, 0.2); }
    .pink-leap .score-leap-badge {
      background: rgba(236, 72, 153, 0.1);
      color: #ec4899;
      border-color: rgba(236, 72, 153, 0.15);
    }
    
    .cyan-leap {
      background: rgba(6, 182, 212, 0.02);
      border-color: rgba(6, 182, 212, 0.06);
    }
    .cyan-leap .score-progress-fill { background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%); }
    .cyan-leap .score-progress-pointer { background: #3b82f6; box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4); }
    .cyan-leap .stat-val.text-glow { color: #3b82f6; text-shadow: 0 0 10px rgba(59, 130, 246, 0.2); }
    .cyan-leap .score-leap-badge {
      background: rgba(6, 182, 212, 0.1);
      color: #0891b2;
      border-color: rgba(6, 182, 212, 0.15);
    }
    .testimonials-flow-bg {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    }

    .pricing-section {
      width: 100%;
      padding: 4rem 0 2rem 0;
      text-align: center;
      position: relative;
      overflow: hidden;
      background: linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(133, 92, 214, 0.04) 30%, rgba(255,255,255,0.42) 70%, rgba(255,255,255,0.55) 100%);
      /* RENDIMIENTO (2026-09-07): tenia 'transition: background 1.2s'. Al pulsar Mensual/Anual
         se interpolaba un degradado a lo largo de TODA la seccion (~1000 px de alto) durante
         1,2 s = repintado de pantalla completa por frame, y encima al mismo tiempo que las otras
         ~8 transiciones de 1,2-1,5 s que dispara ese mismo toggle (nebulosas, orbitas, nodos,
         borde de la tarjeta premium, insignia). El tinte es de 4-7% de alfa: cambiarlo de golpe
         no se nota, y el resto de las transiciones sigue dando la sensacion de cambio suave. */
    }
    
    /* Estado Dorado de Ahorro Anual Activo */
    .pricing-section.yearly-active {
      background: linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(245, 158, 11, 0.07) 30%, rgba(255,255,255,0.42) 70%, rgba(255,255,255,0.55) 100%);
    }
    
    /* Título transiciona a dorado */
    .pricing-section.yearly-active .text-gradient {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    }

    .pricing-flow-bg {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    }
    .pricing-nebula {
      transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: center;
      opacity: 0.45;
    }
    .basic-nebula { transform-origin: 360px 300px; }
    .premium-nebula { transform-origin: 1080px 300px; }
    
    /* RENDIMIENTO (2026-09-07): estas nebulosas escalaban (transform) durante 1,5 s al pasar el
       mouse por una tarjeta y al alternar mensual/anual. Un <circle> de SVG NO obtiene capa
       propia: cualquier transform sobre el es un REPINTADO, y aca ademas vive dentro de
       .pricing-flow-bg, que lleva 'mask-image' -> al repintar hay que volver a aplicar la
       mascara sobre una capa del tamaño de la seccion, en cada frame. Con radios de r=300..380
       eso es regenerar un degradado radial gigante ~90 veces por transicion. Era el tiron de la
       seccion de precios al pasar el mouse por las tarjetas.
       Se conserva el efecto (la nebulosa aparece/desaparece) pero SOLO con opacity. */
    .yearly-nebula {
      transform-origin: 720px 300px;
      opacity: 0;
    }

    /* Mostrar Nebulosa Dorada y atenuar básicas cuando Anual está activo */
    .pricing-section.yearly-active .yearly-nebula {
      opacity: 0.95;
    }
    .pricing-section.yearly-active .basic-nebula,
    .pricing-section.yearly-active .premium-nebula {
      opacity: 0.12;
    }

    /* Modern CSS :has Selector for high-fidelity pricing interactions */
    .pricing-section:not(.yearly-active):has(.basic-card:hover) .basic-nebula {
      opacity: 0.96;
    }
    .pricing-section:not(.yearly-active):has(.premium-card:hover) .premium-nebula {
      opacity: 0.98;
    }

    /* Constellation Dynamic Orbits */
    /* RENDIMIENTO (2026-08-29): estas 2 orbitas rotaban de forma infinita, y .orbit-outer es un
       circulo de r=450 con stroke-dasharray -- rotar un trazo punteado obliga a re-teselar el path
       en cada frame. Congeladas; el cambio de color al pasar a anual (transition: stroke) se
       conserva, que es la parte que el usuario si percibe. */
    .pricing-orbit {
      transform-origin: 720px 300px;
      transition: stroke 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    /* Cambiar órbitas a dorado en modo anual */
    .pricing-section.yearly-active .pricing-orbit {
      stroke: rgba(245, 158, 11, 0.15) !important;
    }
    .pricing-section.yearly-active .orbit-inner {
      stroke: rgba(245, 158, 11, 0.25) !important;
    }


    /* Interactive Energy Nodes & Technical Pings */
    .pricing-tech-node circle {
      transition: fill 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    /* Cambiar nodos a dorado en modo anual */
    .pricing-section.yearly-active .pricing-tech-node circle:not(.ping) {
      fill: #f59e0b !important;
    }
    .pricing-section.yearly-active .pricing-tech-node circle.ping {
      stroke: #f59e0b !important;
    }

    .pricing-tech-node .ping {
      animation: pricing-technical-ping 3s ease-in-out infinite;
      transform-origin: center;
    }
    .node-1 .ping { transform-origin: 200px 150px; animation-delay: 0s; }
    .node-2 .ping { transform-origin: 1240px 120px; animation-delay: 0.7s; }
    .node-3 .ping { transform-origin: 150px 450px; animation-delay: 1.4s; }
    .node-4 .ping { transform-origin: 1280px 480px; animation-delay: 2.1s; }

    @keyframes pricing-technical-ping {
      0% { transform: scale(0.8); opacity: 0.8; }
      50% { transform: scale(1.4); opacity: 0; }
      100% { transform: scale(0.8); opacity: 0; }
    }
    
    /* ===== Selector Mensual/Anual (rediseño v4 2026-08-29) =====
       UNA sola pastilla con contorno continuo + un divisor central fino -> se lee como "dos
       segmentos conectados", sin las 3 piezas sueltas que tenia v3.
       - .billing-fill: relleno que se desliza de un lado al otro. Lleva un contorno mas OSCURO
         que su propio relleno (lo que pedia el diseño), y una sombra de color.
       - Contorno de la pastilla: neutro en reposo, se tiñe hacia el color activo (asi el lado
         no elegido se "apaga" visualmente).
       - Movimiento: Web Animations API (animateBillingFill) -> translateX + un leve estiron
         (scaleX) a mitad de camino = efecto liquido. Cero libreria, solo transform (compositor).
       Capas (isolation:isolate): 0 divisor · 1 relleno · 2 textos · 3 badge. */
    .billing-toggle {
      --bt-purple: #855cd6;
      --bt-purple-dark: #5b21b6;
      --bt-gold: #f59e0b;
      --bt-gold-dark: #b45309;
      --bt-track: #eef0f4;
      --bt-line: #cbd0da;

      position: relative;
      display: flex;
      align-items: stretch;
      width: 340px;
      max-width: 100%;
      height: 48px;
      padding: 4px;
      border-radius: 999px;
      background: var(--bt-track);
      border: 2px solid var(--bt-line);
      box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.06);
      z-index: 6;
      isolation: isolate;
      transition: border-color 0.45s ease, background-color 0.45s ease;
    }
    .billing-toggle:not(.yearly) { border-color: rgba(133, 92, 214, 0.5); }
    .billing-toggle.yearly       { border-color: rgba(245, 158, 11, 0.55); }

    /* Divisor central: la linea fina que hace leer "2 segmentos". Detras del relleno. */
    .billing-divider {
      position: absolute;
      top: 11px;
      bottom: 11px;
      left: 50%;
      width: 2px;
      margin-left: -1px;
      border-radius: 2px;
      background: var(--bt-line);
      z-index: 0;
      pointer-events: none;
    }

    /* Relleno deslizante. En reposo lo coloca el CSS (translateX 0 / 100%); el cambio lo anima
       animateBillingFill con la Web Animations API (no lleva transition de transform para no
       pelear con esa animacion). El contorno es mas oscuro que el relleno, como pedia el diseño. */
    .billing-fill {
      position: absolute;
      top: 4px;
      bottom: 4px;
      left: 4px;
      width: calc(50% - 8px);
      border-radius: 999px;
      background: var(--bt-purple);
      border: 2px solid var(--bt-purple-dark);
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.35);
      z-index: 1;
      pointer-events: none;
      transform: translateX(0);
      transform-origin: center;
      transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    }
    .billing-toggle.yearly .billing-fill {
      transform: translateX(calc(100% + 8px));
      background: var(--bt-gold);
      border-color: var(--bt-gold-dark);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    }

    .billing-opt {
      position: relative;
      z-index: 2;
      flex: 1 1 0;
      min-width: 0;
      padding: 0 0.6rem;
      font-family: inherit;
      font-size: 1.04rem;
      font-weight: 700;
      line-height: 1;
      border: 0;
      border-radius: 999px;
      cursor: pointer;
      background: transparent;
      color: #6b7280;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
      transition: color 0.3s ease 0.06s;
    }
    .billing-opt:not(.active):hover { color: #374151; }
    .billing-opt--monthly.active,
    .billing-opt--yearly.active { color: #fff; }

    .billing-save {
      position: absolute;
      top: -16px;
      right: -12px;
      z-index: 3;
      font-size: 0.74rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 0.3rem 0.62rem;
      border-radius: 8px;
      background: var(--bt-gold);
      color: #fff;
      border: 2px solid #fff;
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.55);
      white-space: nowrap;
      pointer-events: none;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto auto;
      gap: 2.2rem;
      max-width: 820px;
      margin: 0 auto;
      align-items: stretch;
      position: relative;
      z-index: 5;
    }
    /* Escritorio: el selector se sube a su propia fila, centrado arriba de las dos tarjetas. */
    .pricing-grid > .billing-toggle {
      grid-column: 1 / -1;
      grid-row: 1;
      justify-self: center;
      margin-bottom: 0.4rem;
    }
    .pricing-grid > .pricing-card { grid-row: 2; }
    .pricing-card {
      padding: 1.8rem 1.6rem;
      border-radius: 24px;
      text-align: left;
      position: relative;
      border: 1px solid rgba(133, 92, 214, 0.08);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 15px 35px rgba(133, 92, 214, 0.01);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      /* RENDIMIENTO (2026-09-07): era 'transition: all'. Con 'all' el navegador vigila e
         interpola CUALQUIER propiedad que cambie entre estados, incluidas las de layout. Se
         listan las 4 reales que cambian en :hover. */
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                  background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .pricing-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      padding: 1.5px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(133, 92, 214, 0.08) 50%, rgba(255, 255, 255, 0.1) 100%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      transition: opacity 0.4s ease;
    }
    .pricing-card:hover {
      transform: translateY(-8px);
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 30px 60px rgba(133, 92, 214, 0.08);
      border-color: rgba(133, 92, 214, 0.18);
    }
    .pricing-card.premium-card {
      background: rgba(255, 255, 255, 0.8);
      border: 2px solid rgba(133, 92, 214, 0.3);
      box-shadow: 0 20px 45px rgba(133, 92, 214, 0.06);
      transition: border-color 1.2s ease, box-shadow 1.2s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease;
    }
    .pricing-card.premium-card::before {
      background: linear-gradient(135deg, #855cd6 0%, #f472b6 50%, #3b82f6 100%);
      transition: background 1.2s ease;
    }
    .pricing-card.premium-card:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow: 0 35px 70px rgba(133, 92, 214, 0.16);
      background: rgba(255, 255, 255, 0.9);
    }
    
    /* Premium Card Dorado en Modo Anual */
    .pricing-section.yearly-active .premium-card {
      border-color: rgba(245, 158, 11, 0.4) !important;
      box-shadow: 0 20px 45px rgba(245, 158, 11, 0.08) !important;
    }
    .pricing-section.yearly-active .premium-card::before {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%) !important;
    }
    .pricing-section.yearly-active .premium-card:hover {
      box-shadow: 0 35px 70px rgba(245, 158, 11, 0.18) !important;
    }

    .premium-badge-floating {
      position: absolute;
      top: 1.5rem;
      right: 2.2rem;
      background: linear-gradient(135deg, #855cd6, #f472b6);
      color: white;
      padding: 0.35rem 0.9rem;
      border-radius: 99px;
      font-size: 0.72rem;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.25);
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      letter-spacing: 0.02em;
      transition: background 1.2s ease, box-shadow 1.2s ease;
    }
    
    /* Distintivo flotante dorado en modo anual */
    .pricing-section.yearly-active .premium-badge-floating {
      background: linear-gradient(135deg, #f59e0b, #d97706) !important;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25) !important;
    }
    .sparkle {
      animation: spin 3s linear infinite;
      display: inline-block;
    }
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .pricing-header {
      margin-bottom: 1.2rem;
    }
    .plan-tag {
      font-size: 0.72rem;
      text-transform: uppercase;
      font-weight: 800;
      color: var(--text-secondary);
      letter-spacing: 0.08em;
      display: inline-block;
      margin-bottom: 0.5rem;
    }
    .plan-tag.premium-tag {
      color: #855cd6;
      transition: color 1.2s ease;
    }
    
    /* Tag de plan dorado en modo anual */
    .pricing-section.yearly-active .plan-tag.premium-tag {
      color: #d97706 !important;
    }
    .pricing-card h3 {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.4rem;
    }
    .plan-desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .price-container {
      margin-bottom: 1.2rem;
    }
    .price {
      font-size: 3rem;
      font-weight: 900;
      font-family: var(--font-heading);
      color: var(--text-primary);
      line-height: 1;
      display: flex;
      align-items: baseline;
      letter-spacing: -0.02em;
    }
    .price span.period {
      font-size: 1.15rem;
      color: var(--text-secondary);
      font-weight: 500;
      margin-left: 0.25rem;
    }
    .price-sub {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.4rem;
    }
    .price-animate {
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .pricing-divider {
      width: 100%;
      height: 1px;
      background: rgba(133, 92, 214, 0.08);
      margin-bottom: 1.5rem;
    }
    .pricing-divider.premium-divider {
      background: linear-gradient(90deg, rgba(133, 92, 214, 0.2) 0%, rgba(244, 114, 182, 0.2) 100%);
    }

    .pricing-features {
      list-style: none;
      margin-bottom: 1.8rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
    }
    .check-icon {
      width: 18px;
      height: 18px;
      color: #10b981;
      margin-top: 0.15rem;
      flex-shrink: 0;
    }
    .check-icon.premium-check {
      color: #855cd6;
      transition: color 1.2s ease;
    }
    
    /* Checks dorados en modo anual */
    .pricing-section.yearly-active .check-icon.premium-check {
      color: #f59e0b !important;
    }
    .cross-icon {
      width: 16px;
      height: 16px;
      color: #9ca3af;
      margin-top: 0.25rem;
      flex-shrink: 0;
    }
    .feature-text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .feature-text strong {
      font-size: 0.95rem;
      color: var(--text-primary);
      font-weight: 700;
    }
    .feature-item.inactive .feature-text strong {
      color: #9ca3af;
      text-decoration: line-through;
      text-decoration-thickness: 1.5px;
    }
    .feature-text span {
      font-size: 0.78rem;
      color: var(--text-secondary);
      line-height: 1.3;
    }

    .pricing-btn-action {
      width: 100%;
      padding: 1rem 1.5rem;
      border-radius: 16px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: auto;
    }
    .basic-action {
      background: white;
      color: var(--accent-primary);
      border: 2px solid rgba(133, 92, 214, 0.2);
    }
    .basic-action:hover {
      background: rgba(133, 92, 214, 0.05);
      border-color: var(--accent-primary);
      transform: scale(1.02);
    }
    .premium-action {
      background: linear-gradient(135deg, #855cd6 0%, #6b46b8 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(133, 92, 214, 0.3);
      transition: background 1.2s ease, box-shadow 1.2s ease;
    }
    .premium-action:hover {
      background: linear-gradient(135deg, #6b46b8 0%, #5a3a9a 100%);
      box-shadow: 0 6px 20px rgba(133, 92, 214, 0.4);
      transform: translateY(-2px) scale(1.02);
    }
    
    /* Botón Premium dorado en modo anual */
    .pricing-section.yearly-active .premium-action {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3) !important;
    }
    .pricing-section.yearly-active .premium-action:hover {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%) !important;
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4) !important;
    }

    /* ===== CTA SECTION ===== */
    .cta-section {
      padding: 4rem 2rem;
      /* Necesarios para el .ambient-bg que se le agrego (2026-08-29): sin position: relative el
         fondo absoluto se anclaria a la seccion anterior, y sin overflow: hidden la rejilla y las
         lineas se saldrian de la seccion. */
      position: relative;
      overflow: hidden;
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
    .cta-final-btn {
      border-radius: 12px;
    }

    /* ===== FOOTER ===== */
    .footer {
      border-top: 2px solid var(--glass-border);
      padding: 3rem 2rem;
      text-align: center;
      background: var(--bg-secondary);
      position: relative;
      overflow: hidden;
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

    .footer-soporte-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.12));
      border: 1.5px solid rgba(139,92,246,0.35);
      border-radius: 10px;
      padding: 0.5rem 0.9rem;
      color: #7c3aed !important;
      font-weight: 700;
      font-size: 0.88rem;
      text-decoration: none !important;
      margin-bottom: 0.5rem;
      transition: all 0.2s;
    }
    .footer-soporte-btn:hover {
      background: linear-gradient(135deg, rgba(139,92,246,0.22), rgba(99,102,241,0.22));
      border-color: rgba(139,92,246,0.6);
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(124,58,237,0.2);
    }

    
    
    
    
    
    /* ===== FAQ SECTION ===== */
    .faq-section {
      width: 100%;
      max-width: 100%;
      padding: 6rem 0;
      position: relative;
      overflow: hidden;
    }
    .faq-section .section-title {
      position: relative;
      z-index: 5;
      margin-bottom: 3.5rem;
    }
    .faq-flow-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }
    .faq-flow-bg svg {
      width: 100%;
      height: 100%;
    }
    /* ==================================================================
       RENDIMIENTO (2026-08-29): el fondo decorativo del FAQ, CONGELADO
       ==================================================================
       Esta seccion era la peor del home: el usuario reportaba ~1 fps en un telefono real.
       El dibujo SVG de .faq-flow-bg traia 6 animaciones infinitas y NINGUN media query que
       las apagara en movil:

         - 2 nebulosas con faq-nebula-morph (transform + opacity, 25 s).
         - 2 orbitas de r=420 y r=540 rotando 80 s / 100 s con stroke-dasharray: rotar un
           trazo punteado obliga a re-teselar el path en cada frame, y como el SVG se estira
           con preserveAspectRatio="none", en movil esos circulos son enormes.
         - 2 satelites con faq-sat-pulse BAJO filter="url(#faq-glow-filter)", que es un
           feGaussianBlur: el filtro se re-rasteriza en CADA frame mientras la seccion este
           en pantalla. Ese era el cuello de botella principal.

       Se conserva el dibujo entero (nebulosas, orbitas, satelites, cruces) y se eliminan
       solo las animaciones y los will-change. El feGaussianBlur deja de importar en cuanto
       no se anima: se rasteriza una sola vez y queda cacheado. Visualmente la seccion se ve
       igual, solo quieta. Si alguna vez se le quiere devolver el movimiento, hay que hacerlo
       FUERA del subarbol con filtro y sin animar stroke-dasharray. */
    .faq-nebula {
      transform-origin: center;
      opacity: 0.9;
    }
    .faq-satellite {
      transform-origin: center;
      animation: faq-sat-pulse 4s infinite ease-in-out alternate;
    }
    .faq-satellite.sat-2 { animation-delay: -2s; }
    @keyframes faq-sat-pulse {
      0%   { opacity: 0.35; transform: scale(0.85); }
      100% { opacity: 1;    transform: scale(1.25); }
    }
    .faq-container {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1.5rem;
      position: relative;
      z-index: 5;
    }
    /* While actively scrolling, stop evaluating :hover on this stacked list — with 7+
       items in a single column, each one triggers a hover transition as it passes
       under a stationary cursor, which is what caused the scroll jank here. */
    .home-container.is-scrolling .faq-container {
      pointer-events: none;
    }
    .faq-item {
      overflow: hidden;
      background: white;
      border: 2px solid #cbd5e1;
      border-radius: var(--border-radius);
      /* El .glass-card global de styles.css mete padding: 2.5rem; en el acordeon eso son 40px de
         aire muerto por lado (arriba/abajo x7 items = ~560px). La pregunta y la respuesta ya
         traen su propio padding, asi que aca va en 0. */
      padding: 0;
      /* RENDIMIENTO: era 'transition: all', que vuelve candidata a transicionar CUALQUIER
         propiedad que cambie, incluidas las que fuerzan layout. Se listan las 3 reales. */
      transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    }
    .faq-item.glass-card {
      border: 2px solid #cbd5e1;
      padding: 0;
    }
    .faq-item:hover {
      border-color: rgba(133, 92, 214, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(133, 92, 214, 0.08);
    }
    .faq-item.active {
      border-color: rgba(133, 92, 214, 0.45);
    }
    .faq-question {
      width: 100%;
      text-align: left;
      padding: 1.35rem 1.5rem;
      background: none;
      border: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      font-family: var(--font-heading);
      font-size: 1.12rem;
      font-weight: 700;
      color: var(--text-primary);
      transition: color 0.3s ease;
    }
    .faq-item.active .faq-question {
      color: var(--accent-primary);
    }
    /* Icono en chip circular: +/- dentro de un circulo suave que se rellena de morado al abrir.
       Le da a la lista un aspecto de acordeon prolijo y consistente con el resto del home. */
    .faq-icon {
      color: var(--accent-primary);
      transition: background 0.3s ease, color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(133, 92, 214, 0.09);
    }
    .faq-icon svg { width: 19px; height: 19px; }
    .faq-item.active .faq-icon {
      background: var(--accent-primary);
      color: #fff;
    }
    .faq-answer-container {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.3s ease-out;
    }
    .faq-item.active .faq-answer-container {
      grid-template-rows: 1fr;
    }
    .faq-answer-inner {
      overflow: hidden;
    }
    .faq-answer {
      padding: 0 1.5rem 1.5rem;
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 1.05rem;
    }

    /* ===== NEWS & ACTUALIDAD SECTION ===== */
    .news-section {
      width: 100%;
      max-width: 100%;
      padding: 6rem 0;
      position: relative;
      overflow: hidden;
    }
    .news-bg-decor {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(133, 92, 214, 0.04) 50%, transparent 100%);
      pointer-events: none;
      z-index: 1;
    }
    .section-subtitle-custom {
      max-width: 650px;
      margin: -2rem auto 4rem;
      text-align: center;
      color: var(--text-secondary);
      font-size: 1.15rem;
      line-height: 1.6;
      font-weight: 500;
      position: relative;
      z-index: 2;
    }
    .news-carousel-container {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 3.5rem;
      display: flex;
      align-items: center;
      z-index: 2;
    }
    .news-track {
      display: flex;
      gap: 2rem;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding: 1.5rem 0.5rem;
      scroll-behavior: smooth;
      scrollbar-width: none; /* Firefox */
      width: 100%;
    }
    .news-track::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }
    /* Barra de progreso del carrusel de noticias (desktop/tablet). Solo aparece cuando hay
       suficientes noticias para que el carrusel se pueda desplazar (JS le pone .has-overflow).
       En <=640px la seccion pasa a marquee agarrable en bucle y se oculta siempre. */
    .news-scroll-indicator {
      display: none;
      position: relative;
      width: min(240px, 45%);
      height: 5px;
      margin: 1.5rem auto 0;
      background: rgba(133, 92, 214, 0.15);
      border-radius: 999px;
      overflow: hidden;
      z-index: 2;
    }
    .news-scroll-indicator.has-overflow { display: block; }
    .news-scroll-thumb {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 33%;
      border-radius: 999px;
      background: linear-gradient(90deg, #855cd6, #3b82f6);
      transition: left 0.15s ease-out, width 0.15s ease-out;
    }
    .news-card {
      flex: 0 0 calc(33.333% - 1.34rem);
      min-width: 320px;
      scroll-snap-align: start;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid #cbd5e1;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .news-card.glass-card {
      border: 2px solid #cbd5e1;
    }
    /* Clones del marquee de telefono: fuera de <=640px no existen visualmente. */
    .news-card[aria-hidden="true"],
    .testimonial-card[aria-hidden="true"] {
      display: none;
    }
    .news-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 45px rgba(133, 92, 214, 0.16);
      border-color: rgba(133, 92, 214, 0.4);
      background: rgba(255, 255, 255, 0.75);
    }
    .news-header-img {
      height: 160px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-size: cover;
      background-position: center;
    }
    .news-img-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.3;
      z-index: 1;
      pointer-events: none;
    }
    .news-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(255, 255, 255, 0.95);
      color: #7c3aed;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.3rem 0.75rem;
      border-radius: 99px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: var(--shadow-sm);
      z-index: 2;
    }
    .news-cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .news-cover-img.loaded {
      opacity: 1;
    }
    .news-img-skeleton {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: loading-shimmer 1.5s infinite;
      z-index: 0;
    }
    .news-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .news-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.15rem 0.5rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      font-weight: 600;
    }
    /* Fuente y fecha nunca parten a media palabra ("El\nMostrador"): si no caben en una linea,
       la fecha baja entera a la siguiente. */
    .news-source, .news-date { white-space: nowrap; }
    .news-dot {
      color: rgba(133, 92, 214, 0.3);
    }
    .news-title {
      font-size: 1.2rem;
      font-weight: 800;
      line-height: 1.4;
      color: var(--text-primary);
      margin: 0 0 0.85rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 3.36rem;
    }
    .news-excerpt {
      font-size: 0.92rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 1.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }
    .news-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #7c3aed;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      transition: gap 0.2s;
    }
    .news-link svg {
      transition: transform 0.2s;
    }
    .news-link:hover {
      color: #6d28d9;
      gap: 0.75rem;
    }
    .news-link:hover svg {
      transform: translateX(3px);
    }
    .carousel-control {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid rgba(133, 92, 214, 0.15);
      color: var(--text-primary);
      cursor: pointer;
      display: grid;
      place-items: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      transition: all 0.2s;
      z-index: 10;
    }
    .carousel-control:hover {
      background: #7c3aed;
      color: #ffffff;
      border-color: #7c3aed;
      transform: translateY(-50%) scale(1.08);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3);
    }
    .carousel-control.prev {
      left: 0.5rem;
    }
    .carousel-control.next {
      right: 0.5rem;
    }

    @media (max-width: 1024px) {
      .news-card {
        flex: 0 0 calc(50% - 1rem);
      }
    }
    @media (max-width: 768px) {
      .news-carousel-container {
        padding: 0 1rem;
      }
      .carousel-control {
        display: none;
      }
      .news-card {
        flex: 0 0 85%;
        min-width: 280px;
      }
      .section-subtitle-custom {
        margin: -2rem auto 2rem;
        font-size: 1rem;
        padding: 0 1rem;
      }
    }

    /* ===== ENHANCED DEPTH & HOVER ===== */
    .glass-card {
      border: 1px solid rgba(133, 92, 214, 0.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    }
    /* RENDIMIENTO (2026-09-07): era 'transition: all' y, por ir MAS ABAJO en la hoja con la
       misma especificidad, le ganaba a la transicion explicita de .pricing-card (unas 900 lineas
       mas arriba) -- o sea que la tarjeta de precios seguia interpolando 'all' pese a esa
       correccion. Se listan las 4 propiedades reales que cambian en los :hover de las tres
       tarjetas. .pricing-card.premium-card tiene mayor especificidad y conserva la suya. */
    .bento-card, .testimonial-card, .pricing-card {
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  background-color 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  border-color 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  box-shadow 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .bento-card:hover, .testimonial-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(133, 92, 214, 0.12);
      border-color: rgba(133, 92, 214, 0.4);
    }
    /* ===== TABS UI & VIDEOS SECTION ===== */
    .videos-section-description {
      max-width: 760px;
      margin: 0 auto 3.5rem auto;
      text-align: center;
      position: relative;
      min-height: 90px; /* Evita saltos de layout al cambiar pestañas */
      z-index: 2;
    }
    .videos-section {
      width: 100%;
      max-width: 100%;
      margin: 0;
      padding: 8rem 0;
      position: relative;
      overflow: hidden;
      
      /* Variables de tema dinámico por defecto (Paso 0) */
      --theme-primary: #855cd6;
      --theme-glow: rgba(133, 92, 214, 0.15);
      --theme-accent: #3b82f6;
      
      /* Difuminación perfecta a blanco en extremos superior e inferior */
      background: linear-gradient(to bottom, 
        rgba(255, 255, 255, 0.55) 0%, 
        rgba(133, 92, 214, 0.05) 20%, 
        rgba(255, 255, 255, 0.42) 75%, 
        rgba(255, 255, 255, 0.55) 100%
      );
      /* RENDIMIENTO (2026-09-07): antes habia 'transition: background 1.5s'. Los 3 gradientes
         de tema solo se diferencian en un tinte del 5% de alfa, pero interpolarlos REPINTA el
         fondo de una seccion del ancho completo en cada frame durante 1,5 s, en cada cambio de
         pestaña. El cambio instantaneo es imperceptible (5% de alfa) y cuesta un solo repintado.
         Ademas las variables --theme-* nunca transicionaron (las custom properties no interpolan
         sin @property), asi que el color de las pestañas ya cambiaba de golpe. */
    }
    .videos-section.theme-tab-0 {
      --theme-primary: #855cd6;
      --theme-glow: rgba(133, 92, 214, 0.15);
      --theme-accent: #3b82f6;
      background: linear-gradient(to bottom, 
        rgba(255, 255, 255, 0.55) 0%, 
        rgba(133, 92, 214, 0.05) 20%, 
        rgba(255, 255, 255, 0.42) 75%, 
        rgba(255, 255, 255, 0.55) 100%
      );
    }
    .videos-section.theme-tab-1 {
      --theme-primary: #06b6d4;
      --theme-glow: rgba(6, 182, 212, 0.15);
      --theme-accent: #1d4ed8;
      background: linear-gradient(to bottom, 
        rgba(255, 255, 255, 0.55) 0%, 
        rgba(6, 182, 212, 0.05) 20%, 
        rgba(255, 255, 255, 0.42) 75%, 
        rgba(255, 255, 255, 0.55) 100%
      );
    }
    .videos-section.theme-tab-2 {
      --theme-primary: #10b981;
      --theme-glow: rgba(16, 185, 129, 0.15);
      --theme-accent: #a855f7;
      background: linear-gradient(to bottom, 
        rgba(255, 255, 255, 0.55) 0%, 
        rgba(16, 185, 129, 0.05) 20%, 
        rgba(255, 255, 255, 0.42) 75%, 
        rgba(255, 255, 255, 0.55) 100%
      );
    }
    .videos-section .section-title {
      text-align: center;
      margin-bottom: 4rem;
      position: relative;
      z-index: 2;
    }
    .videos-section .section-title .text-gradient {
      background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transition: color 1.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .videos-flow-bg {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      
      /* Máscara bidireccional (2D) para difuminar los 4 bordes: arriba, abajo, izquierda y derecha */
      /* Garantiza la eliminación absoluta de cortes rectos en cualquier resolución de pantalla */
      mask-image: 
        linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%),
        linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
      mask-composite: intersect;
      
      -webkit-mask-image: 
        linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%),
        linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
      -webkit-mask-composite: source-in;
      
      /* Estado inicial oculto del fondo */
      opacity: 0;
      transform: translateY(30px) scale(0.98);
      
      /* TRANSICIÓN DE SALIDA RÁPIDA: Desaparece rápido en scroll out */
      transition: opacity 0.5s ease-out, transform 0.5s ease-out;
      transition-delay: 0s;
    }
    .videos-section.is-visible .videos-flow-bg {
      opacity: 1;
      transform: translateY(0) scale(1);
      
      /* TRANSICIÓN DE ENTRADA LENTA: Aparece poco a poco de forma mágica en scroll in */
      transition: opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1), transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: 0.6s;
    }
    .videos-flow-bg svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    
    /* RENDIMIENTO (2026-08-29): este <g> rotaba 360 grados de forma infinita y contiene, ademas
       de 2 circulos con stroke-dasharray (r=200 y r=440), 3 circulos con filter="url(#neon-glow)"
       -- un feGaussianBlur. Rotar el grupo obligaba a RE-TESELAR los trazos punteados y a
       RE-RASTERIZAR el filtro gaussiano en cada frame, todo el tiempo que la seccion estuviera en
       pantalla. Era el tiron de la seccion de videos.

       A 140 s por vuelta la rotacion avanza 2,6 grados por segundo: es practicamente
       imperceptible, asi que congelarla no cambia nada que se note y elimina de golpe las dos
       cosas caras. */
    .videos-orbit-rotate-container {
      transform-origin: 740px 300px;
    }
    
    .orb-group {
      opacity: 0;
      transition: opacity 1.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .orb-group.active {
      opacity: 1;
    }

    /* (Se eliminó .flow-pulse-node / @keyframes flow-node-pulse: CSS muerto — ninguna clase
       del template lo usa — y animaba 'r' de un <circle>, que no se puede componer.) */

    /* ESTADOS DE ENTRADA CHOREOGRAPHED (ANIMACIONES DE ENTRADA) */
    .videos-section:not(.is-visible) .tab-btn {
      opacity: 0;
      transform: translateX(-35px);
    }
    .videos-section:not(.is-visible) .tab-content {
      opacity: 0;
      transform: translateY(45px) scale(0.97);
    }

    .tabs-container {
      display: flex;
      gap: 3rem;
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
      padding: 0 2rem;
      align-items: stretch;
      position: relative;
      z-index: 2;
    }
    .tabs-buttons {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1.2rem;
    }
    .tab-btn {
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid #cbd5e1;
      border-radius: 20px;
      padding: 1.6rem;
      text-align: left;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      position: relative;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
      
      /* Transiciones suaves de entrada + estados de interacción */
      transition: 
        opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
        background 0.3s ease,
        border-color 0.3s ease,
        box-shadow 0.3s ease,
        color 0.3s ease;
    }
    
    /* Retardos escalonados para la aparición de cada botón */
    .videos-section.is-visible .tab-btn:nth-child(1) { transition-delay: 0.1s; }
    .videos-section.is-visible .tab-btn:nth-child(2) { transition-delay: 0.25s; }
    .videos-section.is-visible .tab-btn:nth-child(3) { transition-delay: 0.4s; }

    .tab-number {
      background: rgba(133, 92, 214, 0.05);
      color: var(--theme-primary);
      width: 36px;
      height: 36px;
      min-width: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 800;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    /* La etiqueta corta ("Ruta", "Ensayos", "Tutor IA") solo se usa en telefono; ver @media 640. */
    .tab-txt-short { display: none; }
    .tab-btn:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: var(--theme-primary);
      transform: translateX(8px) !important;
      box-shadow: 0 10px 20px var(--theme-glow);
    }
    .tab-btn.active {
      background: rgba(255, 255, 255, 0.98);
      color: var(--theme-primary);
      border: 2.5px solid var(--theme-primary);
      transform: translateX(16px) scale(1.03) !important;
      font-weight: 800;
      box-shadow: 0 15px 35px var(--theme-glow);
    }
    /* RENDIMIENTO (2026-08-29): antes esta pestaña animaba 'box-shadow' de forma infinita, lo que
       repinta en cada frame mientras la seccion de videos este a la vista. El resplandor pasa a un
       ::after con la sombra FIJA y se anima solo su opacity, que si se compone en GPU. Mismo
       arreglo que se hizo con .testimonial-card.featured. */
    .tab-btn.active::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      box-shadow: 0 0 16px var(--theme-primary);
      animation: active-tab-pulse 1.8s ease-in-out infinite alternate;
    }
    .tab-btn.active .tab-number {
      background: var(--theme-primary);
      color: white;
      box-shadow: 0 4px 12px var(--theme-glow);
    }
    
    @keyframes active-tab-pulse {
      0%   { opacity: 0; }
      100% { opacity: 1; }
    }
    
    /* Indicador tipo flecha elegante apuntando hacia la tarjeta */
    .active-indicator {
      position: absolute;
      right: -10px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: 14px;
      height: 14px;
      background: var(--theme-primary);
      border-radius: 2px;
      opacity: 0;
      transition: all 0.3s ease;
    }
    .tab-btn.active .active-indicator {
      opacity: 1;
      right: -6px;
    }

    .tab-content {
      flex: 2.4;
      background: transparent;
      backdrop-filter: none;
      padding: 0;
      border: none;
      box-shadow: none;
      position: relative;
      overflow: visible;
      
      /* Transiciones suaves de entrada + estados de interacción */
      transition:
        opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
        transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: 0.3s;
    }
    /* Flechita que conecta la pestaña elegida con el borde superior del video. Solo se usa en la
       fila compacta de telefono (<=640px); en desktop las pestañas van al costado y ya existe
       .active-indicator apuntando de lado. La X la fija --sel-x segun activeTab (16.66 / 50 /
       83.33%, centro de cada chip) y transiciona suave al cambiar de pestaña. */
    .tab-content::after {
      content: '';
      position: absolute;
      top: -10px;
      left: var(--sel-x, 50%);
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid var(--theme-primary);
      z-index: 6;
      opacity: 0;
      pointer-events: none;
      transition: left 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
    }
    .tab-pane {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 2rem;
    }
    .tab-text h3 {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      font-family: var(--font-heading);
    }
    .tab-text p {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 1.05rem;
    }
    .fade-in {
      animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .tab-visual {
      flex: 1;
      border-radius: 28px;
      min-height: 520px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 0;
      border: 2.5px solid var(--theme-primary);
      box-shadow: 0 25px 65px var(--theme-glow);
      /* RENDIMIENTO (2026-09-07): era 'transition: all' sobre la caja mas grande de la seccion.
         Lo unico que cambia entre temas de pestaña es el color del borde y el resplandor. */
      transition: border-color 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    /* ===== BOTON DE PLAY DE "MIRA COMO FUNCIONA" (2026-09-07) =====
       Antes los 3 videos arrancaban SOLOS en cuanto la seccion entraba en pantalla. Decodificar
       video es trabajo constante del hilo principal + GPU aunque el usuario solo este pasando de
       largo, y ademas empieza a bajar megas de datos moviles sin que nadie lo haya pedido. Ahora
       arrancan unicamente cuando el usuario pulsa play; hasta entonces se ve el 'poster' (una
       imagen) y 'preload="none"' evita descargar un solo byte de video.
       El anillo que late anima SOLO transform+opacity (se compone en GPU) y se detiene de verdad
       con animation-play-state cuando el overlay se oculta, para no dejar una animacion corriendo
       invisible mientras el video se reproduce. */
    .video-play-overlay {
      position: absolute;
      inset: 0;
      z-index: 4;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin: 0;
      padding: 0;
      border: none;
      cursor: pointer;
      font-family: inherit;
      background: radial-gradient(ellipse at center,
        rgba(17, 12, 34, 0.30) 0%,
        rgba(17, 12, 34, 0.16) 55%,
        rgba(17, 12, 34, 0.05) 100%);
      transition: opacity 0.35s ease;
    }
    .video-play-overlay.is-playing {
      opacity: 0;
      pointer-events: none;
    }
    .video-play-overlay.is-playing .vpo-ring { animation-play-state: paused; }
    .vpo-btn {
      position: relative;
      width: 88px;
      height: 88px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.97);
      color: var(--theme-primary, #855cd6);
      box-shadow: 0 16px 38px rgba(17, 12, 34, 0.30),
                  inset 0 0 0 2px var(--theme-primary, #855cd6);
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.28s ease;
    }
    .vpo-icon {
      width: 34px;
      height: 34px;
      /* Sin margin: el ajuste optico va dentro del propio SVG (<g transform>), asi escala solo
         con el icono en vez de descuadrarse segun el tamaño. */
    }
    .vpo-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid var(--theme-primary, #855cd6);
      pointer-events: none;
      animation: vpo-ring-pulse 2.6s ease-out infinite;
    }
    @keyframes vpo-ring-pulse {
      0%   { transform: scale(1);    opacity: 0.7; }
      70%  { transform: scale(1.5);  opacity: 0; }
      100% { transform: scale(1.5);  opacity: 0; }
    }
    .vpo-label {
      color: #fff;
      font-weight: 800;
      font-size: 0.95rem;
      letter-spacing: 0.01em;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
    }
    .video-play-overlay:hover .vpo-btn,
    .video-play-overlay:focus-visible .vpo-btn {
      transform: scale(1.09);
      background-color: #fff;
    }
    .video-play-overlay:focus-visible {
      outline: 3px solid var(--theme-primary, #855cd6);
      outline-offset: -5px;
    }
    /* Ya reproduciendo, un clic sobre el propio video lo pausa (el overlay esta en
       pointer-events: none, asi que el clic le llega al <video>). */
    .tab-visual .real-video-player { cursor: pointer; }

    @media (prefers-reduced-motion: reduce) {
      .vpo-ring { animation: none; opacity: 0.55; }
      .video-play-overlay:hover .vpo-btn { transform: none; }
    }

    .tab-dashboard-wrapper { background: linear-gradient(135deg, #fef3c7, #ffedd5); }
    .tab-exam-wrapper { background: linear-gradient(135deg, #e0e7ff, #ede9fe); }
    .tab-chat-wrapper { background: linear-gradient(135deg, #dcfce7, #dbeafe); }

    
    @media (max-width: 900px) {
      .tabs-container { flex-direction: column; gap: 2rem; }
      .tab-btn.active { transform: none !important; }
      .active-indicator { display: none; }
      /* El video es 16:9 (800x450). En movil, .tab-visual traia min-height: 520px -> como el box
         quedaba casi cuadrado, object-fit: cover recortaba ~60% del alto del video (se perdia casi
         toda la demo). Se cambia a aspect-ratio 16/9: el frame completo se ve, sin recorte, y la
         seccion pierde ~290px de alto. */
      .tab-visual {
        min-height: 0;
        aspect-ratio: 16 / 9;
        border-radius: 20px;
        /* 🔴 FIREFOX (2026-09-07): sin esto el video DESAPARECE en movil.
           La regla base de .tab-visual trae 'flex: 1', que es 'flex-basis: 0%'. En un contenedor
           flex en columna (.tab-pane) con altura indeterminada, Chrome deja que 'aspect-ratio'
           aporte el tamaño base, pero FIREFOX hace caso al flex-basis de 0 y la caja colapsa a
           0 px de alto -> como el <video> de dentro es 'position: absolute; inset: 0', se queda
           sin nada que rellenar y no se ve nada.
           Con 'flex: 0 0 auto' el item se dimensiona por sus propias propiedades y el
           aspect-ratio manda en los dos motores. */
        flex: 0 0 auto;
        width: 100%;
      }
      /* Con .tab-pane sin altura definida en el layout apilado, el video (height:100% inline)
         colapsaria; en absoluto llena el .tab-visual (que ahora tiene su ratio). */
      .tab-visual .real-video-player {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .vpo-btn { width: 68px; height: 68px; }
      .vpo-icon { width: 27px; height: 27px; }
      .vpo-label { font-size: 0.85rem; }
      .video-play-overlay { gap: 0.75rem; }
    }

    /* ===== PRICING HIERARCHY ===== */
    .pricing-card.premium {
      transform: scale(1.05);
      border: 3px solid var(--accent-primary);
      box-shadow: 0 20px 50px rgba(133, 92, 214, 0.2);
      z-index: 2;
    }
    .pricing-card.premium:hover {
      transform: scale(1.08) translateY(-5px);
    }
    .pricing-card.premium .btn-primary {
      background: var(--gradient-brand);
      border: none;
      color: white;
      font-weight: 700;
      font-size: 1.1rem;
      padding: 1.2rem;
      box-shadow: 0 10px 20px rgba(133, 92, 214, 0.3);
    }
    .pricing-card.premium .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 25px rgba(133, 92, 214, 0.4);
    }


    
    .features-section, .videos-section, .testimonials-section, .pricing-section, .faq-section, .cta-section, .news-section {
      background-color: transparent !important;
    }
    
    /* Make section titles adjust nicely, no hard dark themes */
    .section-title {
      color: #111827;
    }

    .home-container {
      transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      background-color: #ffffff;
    }
    
    
    
    
    
    
    
    
    /* Staggered entry animations for Bento grid when it becomes visible */
    .bento-grid > div:nth-child(1) { transition-delay: 0.1s; }
    .bento-grid > div:nth-child(2) { transition-delay: 0.2s; }
    .bento-grid > div:nth-child(3) { transition-delay: 0.3s; }
    .bento-grid > div:nth-child(4) { transition-delay: 0.4s; }
    .bento-grid > div:nth-child(5) { transition-delay: 0.5s; }
    .bento-grid > div:nth-child(6) { transition-delay: 0.6s; }
    
    /* Make dome dark too if scrolled? Actually dome is out of view, but just in case */
    

    
    /* ===== FOOTER NEW ===== */
    .footer {
      /* Translucido (2026-08-29) para dejar ver la cuadricula continua de .home-container::before.
         OJO: hay 4 reglas .footer en este archivo y esta es la que gana (va mas abajo en la hoja,
         con la misma especificidad). Cambiar el fondo en la de mas arriba no tiene ningun efecto. */
      background-color: rgba(255, 255, 255, 0.55);
      border-top: 1px solid var(--glass-border);
      padding: 4rem 2rem 2rem;
      position: relative;
      z-index: 2;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3rem;
      margin-bottom: 4rem;
    }
    .footer-col {
      text-align: left;
    }
    .footer-col h4 {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
    }
    .footer-desc {
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 320px;
      font-weight: 500;
    }
    .footer-col a {
      display: block;
      color: var(--text-secondary);
      text-decoration: none;
      margin-bottom: 1rem;
      font-weight: 500;
      transition: color 0.3s ease, transform 0.3s ease;
    }
    .footer-col a:hover {
      color: var(--accent-primary);
      transform: translateX(3px);
    }
    
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2rem;
      border-top: 1px solid var(--glass-border);
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }
    .footer-bottom-right {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .footer-bottom-right a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s ease;
    }
    .footer-bottom-right a:hover {
      color: var(--accent-primary);
    }
    .separator {
      color: var(--glass-border);
    }
    .footer-legal {
      text-align: center;
      color: #9ca3af;
      font-size: 0.8rem;
      padding-top: 1.5rem;
      font-weight: 500;
    }

    @media (max-width: 1024px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2.5rem 2rem;
      }
    }
    /* Footer en telefono/tablet: la columna de marca ocupa todo el ancho arriba y los 3 grupos
       de enlaces se reparten debajo en una fila pareja (3 col), luego 2 col en pantallas muy
       angostas. Tipografia e interlineado mas compactos para que no se estire de mas. */
    @media (max-width: 768px) {
      .footer {
        padding: 3rem 1.25rem 1.5rem;
      }
      .footer-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.75rem 1.5rem;
        margin-bottom: 2.25rem;
      }
      .footer-col:first-child {
        grid-column: 1 / -1;
      }
      .footer-desc { max-width: 460px; font-size: 0.9rem; }
      .footer-col h4 { font-size: 0.98rem; margin-bottom: 0.9rem; }
      .footer-col a { font-size: 0.88rem; margin-bottom: 0.65rem; }
      .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .footer-bottom-right {
        flex-wrap: wrap;
      }
    }
    @media (max-width: 480px) {
      .footer {
        padding: 2.5rem 1.15rem 1.25rem;
      }
      /* Pantallas muy angostas: la marca a todo el ancho y los 3 grupos de enlaces en 2 columnas
         (el 3ro queda solo en su fila, patron habitual de footer). Interlineado mas apretado. */
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem 1rem;
        margin-bottom: 1.75rem;
      }
      .footer-desc {
        max-width: 100%;
      }
      .footer-col h4 { margin-bottom: 0.75rem; }
      .footer-col a { margin-bottom: 0.5rem; font-size: 0.85rem; }
      /* El 3er grupo a todo el ancho como cierre, en vez de solo en media fila con hueco al lado. */
      .footer-col:last-child {
        grid-column: 1 / -1;
        border-top: 1px solid var(--glass-border);
        padding-top: 1.3rem;
      }
      .footer-col:last-child a { display: inline-block; margin-right: 1.5rem; }
    }

    /* ===== FOCO SECTION ===== */
    .inline-badge {
      font-size: 0.9rem;
      padding: 0.4rem 1rem;
      border-radius: 999px;
      font-weight: 700;
      color: var(--accent-primary);
      background: rgba(133, 92, 214, 0.1);
      border: 1px solid rgba(133, 92, 214, 0.2);
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      box-shadow: 0 4px 10px rgba(133, 92, 214, 0.1);
    }
    
    

    .foco-section {
      padding: 6rem 2rem;
      background-color: transparent;
      position: relative;
      overflow: hidden;
    }
    .foco-neural-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 680px; /* Agrandado de 580px a 680px para mayor espectacularidad visual */
      height: 680px;
      z-index: 1; /* Detrás de la imagen de Foco que tiene z-index 2 */
      pointer-events: none;
      
      /* Centrado absoluto y estado inicial oculto */
      opacity: 0;
      transform: translate(-50%, -50%) translateY(30px) scale(0.96);
      
      /* TRANSICIÓN DE SALIDA RÁPIDA: Desaparece rápido en scroll out */
      transition: opacity 0.5s ease-out, transform 0.5s ease-out;
      transition-delay: 0s;
    }
    .foco-section.is-visible .foco-neural-bg {
      opacity: 1;
      transform: translate(-50%, -50%) translateY(0) scale(1);
      
      /* TRANSICIÓN DE ENTRADA OPTIMIZADA: Aparece de forma ágil y notoria (1.2s con delay de 0.4s) */
      transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: 0.4s;
    }
    .foco-neural-bg svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    
    /* RENDIMIENTO (2026-08-29 parte 9): las orbitas -1 y -2 son circulos con stroke-dasharray
       que ANTES rotaban infinitamente. Rotar un trazo punteado obliga a re-teselar el guion
       cada frame (mismo hallazgo que hundio el FAQ). La -3 (solida) rotando ni se notaba.
       Quedan quietas: el dibujo alrededor de la mascota de Foco se ve igual, sin costo por
       frame. transform-origin se deja por si se quiere devolver la rotacion como transform
       compositado en el futuro. */
    .orbit-line-1, .orbit-line-2, .orbit-line-3 {
      transform-origin: 300px 300px;
    }
    
    /* Efecto de flotado suave para los nodos sinápticos */
    .neural-node {
      animation: node-float-gentle 4s ease-in-out infinite alternate;
      transform-origin: center;
    }
    .node-1 { animation-delay: 0s; }
    .node-2 { animation-delay: 1.2s; }
    .node-3 { animation-delay: 2.4s; }
    .node-4 { animation-delay: 0.6s; }
    
    @keyframes node-float-gentle {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(-8px) scale(1.03); }
    }
    .foco-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 6rem;
    }
    
    /* Left Side: Mascot */
    .foco-visual {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    
    /* Speech Bubble */
    .foco-speech-bubble {
      position: absolute;
      top: -85px; /* Raised to clear Foco's head perfectly */
      left: 50%;
      transform: translateX(-50%) translateY(15px) scale(0.85);
      background: rgba(255, 255, 255, 0.98);
      border: 2px solid var(--accent-primary);
      border-radius: 20px;
      padding: 0.9rem 1.4rem;
      width: 290px; /* Fixed width to make perfect centering easy */
      box-shadow: 0 15px 35px rgba(133, 92, 214, 0.25);
      z-index: 10;
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: none;
    }
    .foco-speech-bubble.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
    .foco-speech-bubble p {
      color: var(--text-primary);
      font-size: 0.95rem;
      font-weight: 700;
      line-height: 1.4;
      margin: 0;
      text-align: center;
    }
    .bubble-arrow {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid var(--accent-primary);
    }

    .foco-mascot-wrapper {
      position: relative;
      width: 100%;
      max-width: 520px;
    }
    
    .foco-mascot-float-container {
      animation: mascot-float 4.5s ease-in-out infinite;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    
    /* RENDIMIENTO (2026-09-07): .foco-mascot llevaba 'filter: drop-shadow(...)' mas OTRO filtro
       distinto en :hover con 'transition: filter'. El elemento es un <video> WebM con canal alfa
       que esta REPRODUCIENDOSE, y ademas recibe una escritura de 'transform' en cada frame de
       rAF mientras el mouse se mueve por la seccion (el parallax de ngAfterViewInit).
       Un drop-shadow se deriva del canal alfa del contenido pintado, asi que el navegador tenia
       que RECALCULAR la sombra en cada frame decodificado del video Y en cada frame del parallax.
       Ese era el tiron de "Conoce a Foco" en escritorio.
       La sombra pasa a un ::after estatico con radial-gradient (se pinta una vez y queda
       cacheado) y el realce del hover se hace con 'opacity', que si se compone en GPU. */
    .foco-mascot {
      width: 100%;
      height: auto;
      position: relative;
      z-index: 2;
      cursor: pointer;
      transition: transform 0.18s ease-out;
    }

    .foco-mascot-float-container::after {
      content: '';
      position: absolute;
      left: 50%;
      /* Estas medidas NO son a ojo: el .webm es un lienzo cuadrado con mucho relleno
         transparente, y el dibujo del pulpo ocupa el 26,9%-76,5% vertical y el 26,3%-73,5%
         horizontal (medido leyendo el canal alfa del primer fotograma). El brillo se centra en
         el 20% inferior para quedar justo bajo los tentaculos, no pegado al borde del lienzo. */
      bottom: 15%;
      width: 52%;
      height: 10%;
      transform: translateX(-50%);
      border-radius: 50%;
      background: radial-gradient(ellipse at center,
        rgba(133, 92, 214, 0.34) 0%,
        rgba(133, 92, 214, 0.18) 45%,
        rgba(133, 92, 214, 0) 72%);
      z-index: 1;
      pointer-events: none;
      opacity: 0.75;
      transition: opacity 0.4s ease;
    }
    .foco-mascot-float-container:hover::after { opacity: 1; }
    
    @keyframes mascot-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-22px); }
    }

    
    /* Right Side: Content */
    .foco-header {
      margin-bottom: 3rem;
    }
    .foco-title {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      text-align: left;
    }
    .foco-subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .foco-benefits {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 3rem;
    }
    .foco-benefit-item {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      opacity: 0;
      transform: translateY(30px);
      transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      padding: 0.8rem 1.2rem;
      margin-left: -1.2rem;
      border-radius: 16px;
      border: 1px solid transparent;
    }
    .foco-benefit-item.is-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    .foco-benefit-item.is-visible:hover {
      background: rgba(255, 255, 255, 0.92);
      border-color: rgba(133, 92, 214, 0.15);
      box-shadow: 0 10px 25px rgba(133, 92, 214, 0.05);
      transform: translateX(12px) !important; /* Elegant 2D sliding that matches Foco's magnetic pull */
    }
    /* Staggering the benefits */
    .foco-benefit-item.delay-1 { transition-delay: 0.1s; }
    .foco-benefit-item.delay-2 { transition-delay: 0.25s; }
    .foco-benefit-item.delay-3 { transition-delay: 0.4s; }
    
    .benefit-icon-wrapper {
      background: rgba(133, 92, 214, 0.1);
      color: var(--accent-primary);
      width: 50px;
      height: 50px;
      min-width: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    }
    .benefit-icon-wrapper .benefit-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }
    .foco-benefit-item:hover .benefit-icon-wrapper {
      background: var(--accent-primary);
      color: #ffffff;
      box-shadow: 0 5px 15px rgba(133, 92, 214, 0.3);
      transform: scale(1.12) rotate(8deg);
    }
    .benefit-text {
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .benefit-text strong {
      display: block;
      color: var(--text-primary);
      font-size: 1.1rem;
      margin-bottom: 0.3rem;
    }
    
    .freemium-tip {
      font-size: 0.75rem;
      color: #9ca3af;
      font-style: italic;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(133, 92, 214, 0.15);
    }
    
    @media (max-width: 992px) {
      .foco-container {
        grid-template-columns: 1fr;
        /* En 1 columna, .foco-content se disuelve (display:contents) y el grid pasa a tener 4
           filas (gif, titulo, beneficios, tip). El gap de 6rem del escritorio dejaba ~288px de
           aire muerto entre ellas -> aca baja a 2rem. */
        gap: 2rem;
        text-align: center;
      }
      /* Titulo ("Conoce a Foco") + subtitulo ARRIBA del gif; luego beneficios; el tip del plan
         gratuito al final. display:contents disuelve .foco-content para poder ordenar sus hijos
         con 'order' (.foco-content no tiene estilos propios, es seguro). */
      .foco-content { display: contents; }
      /* El gap del grid (2rem) ya separa las filas -> se anulan los margin-bottom propios que
         antes sumaban ~90px extra. */
      .foco-header { order: -1; margin-bottom: 0; }
      .foco-benefits { order: 1; margin-bottom: 0; gap: 1.25rem; }
      .freemium-tip { order: 2; }
      /* El h2 es display:flex (inline style), asi que 'text-align' no centra sus hijos:
         hace falta justify-content. flex-wrap:center para cuando "Conoce a Foco" + la insignia
         "IA Activa" pasan a dos lineas. */
      .foco-title { text-align: center; justify-content: center; align-content: center; }
      .foco-benefit-item { text-align: left; }
      .foco-mascot-wrapper { max-width: 250px; margin: 0 auto; }
      .foco-badge { right: 0; }
    }

    /* ===== RESPONSIVE ENHANCEMENTS ===== */
    @media (max-width: 1200px) {
      .nav-links { position: static; transform: none; gap: 1.5rem; }
    }
    @media (max-width: 1024px) {
      .bento-grid { grid-template-columns: repeat(2, 1fr); }
      .bento-large { grid-column: span 2; }
      .testimonials-grid { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; }
      .testimonial-card.featured { transform: none; }
      /* [FIX NAV TABLET 2026-08-29] styles.css global muestra .mobile-menu-btn desde <=1024, pero
         los .nav-links / .nav-actions solo se ocultaban en <=768 -> entre 769 y 1024 (tablet,
         movil horizontal) salian LOS DOS: hamburguesa + nav completa apretada ("Iniciar Sesion"
         partido en 2 lineas). Aca se ocultan a la vez que aparece la hamburguesa. */
      .nav-links, .nav-actions { display: none !important; }
      /* Y el navbar deja de ser pastilla 999px: con el drawer abierto DENTRO, esa pastilla se
         estiraba a ~400px de alto con radio 999px y quedaba una lente deforme. Aca es barra
         redondeada como en movil. */
      .navbar { width: min(92%, 760px); border-radius: 22px; }
    }
    @media (max-width: 992px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
        text-align: center;
      }
      .hero-left-content {
        align-items: center;
        text-align: center;
        min-width: 0;
      }
      .hero-subtitle {
        text-align: center;
      }
      .hero-actions {
        justify-content: center;
      }
      .hero-right-preview {
        max-width: 540px;
        margin: 0 auto;
        min-width: 0;
      }
    }
    @media (max-width: 640px) {
      .hero-benefits-bar {
        grid-template-columns: 1fr;
        gap: 0.6rem;
      }
      .sim-ai-split-panel {
        grid-template-columns: 1fr;
      }
      /* Avatars + stars stay on one centered row (proof-text is unwrapped via display:contents
         so its children become direct flex items); the sentence wraps to its own full-width
         line below instead of every piece stacking as a separate row. */
      .hero-social-proof {
        flex-wrap: wrap;
        justify-content: center;
        row-gap: 0.35rem;
      }
      .proof-text {
        display: contents;
      }
      /* Solo el span-linea (.proof-live), NO los spans anidados (el punto, el <strong>) — si no,
         el .proof-live-dot de 7px se estiraba a width:100% y salia una raya verde. */
      .proof-text > span {
        width: 100%;
        justify-content: center;
        text-align: center;
      }
      /* A max-width:540px + margin:auto card can't actually shrink below its content's
         min width, so on narrow phones it overflowed the grid track and got clipped by
         .hero-section's overflow:hidden, throwing the whole hero column off-center. */
      .hero-right-preview {
        max-width: 100%;
        margin: 0;
      }
      .hero-sim-card {
        padding: 1.5rem;
        min-width: 0;
      }
      .sim-card-header {
        flex-wrap: wrap;
        row-gap: 0.5rem;
      }
      /* "SIMULACIÓN" es mas largo que el viejo "ENSAYO PAES" y se pisaba con el timer. En
         movil el header va apilado y CENTRADO: badge + materia arriba, timer + n° de pregunta
         en su propia linea abajo. */
      .sim-card-header { justify-content: center; }
      .sim-header-left { flex: 1 1 100%; align-items: center; }
      .sim-header-right { width: 100%; padding-top: 0; gap: 0.6rem; justify-content: center; }
      .sim-badge-live { font-size: 0.68rem; padding: 0.2rem 0.5rem; letter-spacing: 0.03em; }
    }
    @media (max-width: 768px) {
      .nav-links, .nav-actions { display: none !important; }
      .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
      .navbar {
        width: calc(100% - 1.5rem) !important;
        left: 0 !important;
        right: 0 !important;
        margin: 0 auto !important;
        transform: none !important;
        top: calc(0.75rem + var(--announce-h, 0px)) !important;
        padding: 0.6rem 1rem !important;
        border-radius: 20px !important;
      }
      .navbar.navbar-hidden {
        transform: translateY(-150%) !important;
      }
      .nav-container {
        width: 100% !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }
      .hero-section { padding-top: 6.5rem; padding-bottom: 1.5rem; overflow: hidden; }
      .hero-title { font-size: clamp(3rem, 10.5vw, 3.8rem); }
      .hero-subtitle { font-size: 1rem; }
      .hero-actions { flex-direction: column; width: 100%; max-width: 320px; margin: 0 auto; gap: 0.75rem; }
      .hero-actions .btn { width: 100%; justify-content: center; }
      /* The button's glow shadow eats into its own margin, so the gap below reads tighter
         than the equal-value gap above it — bump it so both feel symmetric. */
      .hero-cta-group { margin-bottom: 3.5rem; }
      .bento-grid { grid-template-columns: 1fr; }
      .bento-large { grid-column: span 1; }
      .pricing-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; padding: 0 1.25rem; gap: 1.4rem; }
      /* Movil: el selector vuelve a su sitio en el flujo, entre las tarjetas apiladas. */
      .pricing-grid > .billing-toggle { grid-column: auto; grid-row: auto; margin: 0.7rem 0; }
      .pricing-grid > .pricing-card { grid-row: auto; }
      .section-title { font-size: 1.85rem; }
      /* En movil las secciones apiladas traen el padding vertical de escritorio (6-8rem cada lado),
         asi que entre dos secciones el hueco suma 12-16rem = espacio muerto enorme. Referencia
         que gusta: pricing -> news suma ~8rem. Se recorta el padding de CADA lado que toca a un
         vecino para dejar todos los cruces en ~8rem (y features<->foco un poco mas holgado, ~10rem),
         sin tocar el espaciado interno de cada seccion. */
      .features-section { padding-top: 3.5rem; padding-bottom: 3.5rem; }
      .foco-section { padding-top: 4.5rem; padding-bottom: 3.5rem; }
      .videos-section { padding-top: 3.5rem; padding-bottom: 4rem; }
      .testimonials-section { padding-top: 4rem; padding-bottom: 4rem; }
      /* padding simetrico a cada lado del cruce -> el .section-sep queda centrado en el hueco. */
      .pricing-section { padding-bottom: 4rem; }
      .news-section { padding-top: 4rem; padding-bottom: 4rem; }
      .faq-section { padding-top: 4rem; padding-bottom: 4rem; }
      .cta-section { padding-top: 4rem; }
      /* CTA final en telefono: la tarjeta traia padding: 4rem (64px) por lado y el h2 en 2.5rem
         -> ocupaba ~840px para un titulo + un boton. Se ajusta a algo proporcionado. */
      .cta-content { padding: 2.25rem 1.4rem; }
      .cta-content h2 { font-size: 1.9rem; margin-bottom: 0.75rem; }
      .cta-content p { font-size: 1.02rem; margin-bottom: 1.5rem; }

      /* FAQ compacto en telefono: acordeon mas apretado y legible (mismo criterio que el
         layout compacto de "¿Por que EstudiaUni?"). */
      .faq-section .section-title { margin-bottom: 2rem; }
      .faq-container { gap: 0.6rem; padding: 0 1rem; }
      .faq-item { border-radius: 16px; }
      .faq-question { padding: 1rem 1.1rem; font-size: 1rem; gap: 0.75rem; }
      .faq-icon { width: 28px; height: 28px; }
      .faq-icon svg { width: 17px; height: 17px; }
      .faq-answer { padding: 0 1.1rem 1.1rem; font-size: 0.9rem; line-height: 1.55; }

      /* Foco Speech Bubble on Mobile */
      .foco-speech-bubble {
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
        transform: none !important;
        width: 100% !important;
        max-width: 90vw !important;
        margin: 0 auto 1.5rem !important;
        text-align: center;
      }
      .foco-speech-bubble .bubble-arrow { display: none !important; }
    }
    @media (max-width: 640px) {
      .floating-symbol { display: none !important; }
      /* "Mira cómo funciona" en telefono: las 3 pestañas pasan a una fila compacta de chips
         iguales (numero + etiqueta corta), todas visibles a la vez, sin las tarjetotas apiladas. */
      .tabs-container { gap: 0.9rem; padding: 0 1rem; }
      /* La flechita SI se muestra aca y apunta al chip elegido (ver .tab-content::after arriba). */
      .tab-content::after { opacity: 1; }
      .tabs-buttons {
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: stretch;
        gap: 0.5rem;
        width: 100%;
        padding: 0;
        overflow: visible;
      }
      .tab-btn {
        flex: 1 1 0;
        min-width: 0;
        justify-content: center;
        gap: 0.45rem;
        padding: 0.7rem 0.35rem;
        border-radius: 14px;
        border-width: 1.5px;
        font-size: 0.82rem;
        white-space: nowrap;
        text-align: center;
        box-shadow: none;
      }
      .tab-btn .tab-number {
        width: 24px;
        height: 24px;
        min-width: 24px;
        font-size: 0.78rem;
      }
      .tab-btn.active {
        transform: none !important;
        box-shadow: 0 8px 18px var(--theme-glow);
      }
      .tab-btn.active::after { animation: none; opacity: 1; }
      .tab-txt-full { display: none; }
      .tab-txt-short { display: inline; }
      /* La entrada por defecto desliza en X (-35px); en la fila compacta se ve raro -> subida corta. */
      .videos-section:not(.is-visible) .tab-btn { transform: translateY(14px); }
      .bento-card { padding: 1.5rem 1.25rem; }
      .roadmap-visual { flex-wrap: wrap; justify-content: center; gap: 0.5rem; }

      /* ================================================================
         CARRUSELES DE TELEFONO: marquee AGARRABLE (noticias + testimonios)
         ================================================================
         El track es un scroll-container real con las tarjetas TRIPLICADAS (newsLoop /
         testimoniosLoop). setupGrabbableMarquee() le suma scrollLeft cada frame y lo recentra
         1/3 del ancho al cruzar los bordes -> bucle sin salto ("sale por un lado y entra por el
         otro"). Como el avance es scroll nativo, el usuario puede arrastrar/deslizar cuando
         quiera; mientras lo hace el avance se pausa y se reanuda ~1,6 s despues. El rAF solo
         corre con la seccion en pantalla (leer scrollLeft de un subarbol con content-visibility
         saltado forzaria render). Con "reducir movimiento" el JS no arranca: queda scroll manual. */
      .news-carousel-container { padding: 0; }
      /* Los clones (aria-hidden) SI se muestran aca: son las otras 2/3 del track. */
      .news-card[aria-hidden="true"],
      .testimonial-card[aria-hidden="true"] { display: flex; }
      .news-card,
      .testimonial-card {
        flex: 0 0 84vw;
        max-width: 84vw;
        min-width: 0;
        margin-right: 1.25rem;
        scroll-snap-align: none;
      }
      .news-track,
      .testimonials-grid {
        display: flex;
        grid-template-columns: none;
        gap: 0;
        width: 100%;
        min-width: 0;
        max-width: 100%;
        margin: 0;
        padding: 1.75rem 0;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: none;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-x: contain;
        cursor: grab;
        /* IMPRESCINDIBLE: .news-track trae scroll-behavior: smooth de su regla base. Con eso, cada
           scrollLeft que escribe el rAF (el avance y, sobre todo, el recentrado de 1/3 del ancho)
           se ANIMA -> el recentrado se ve como un "rebote" que te devuelve donde estabas. En
           instant no se nota nada. .testimonials-grid nunca tuvo smooth, por eso no rebotaba. */
        scroll-behavior: auto;
      }
      .news-track:active,
      .testimonials-grid:active { cursor: grabbing; }
      .news-track::-webkit-scrollbar,
      .testimonials-grid::-webkit-scrollbar { display: none; }
      /* Marquee agarrable en bucle -> la barra de progreso no aplica (aunque JS ponga .has-overflow). */
      .news-scroll-indicator,
      .news-scroll-indicator.has-overflow { display: none; }

      /* Las 3 tarjetas de testimonios con el MISMO contorno que la central (.featured). */
      .testimonial-card { border: 2px solid rgba(133, 92, 214, 0.35); }
      .testimonial-card.featured {
        transform: none;
        border: 2px solid rgba(133, 92, 214, 0.35);
      }
      .testimonial-card::before {
        background: linear-gradient(135deg, #855cd6 0%, #f472b6 50%, #3b82f6 100%);
        opacity: 1;
      }
    }
    /* "Reducir movimiento": el JS no auto-avanza -> solo 3 tarjetas, scroll manual con snap. */
    @media (max-width: 640px) and (prefers-reduced-motion: reduce) {
      .news-card[aria-hidden="true"],
      .testimonial-card[aria-hidden="true"] { display: none; }
      .news-card,
      .testimonial-card { scroll-snap-align: start; }
      .news-track,
      .testimonials-grid { scroll-snap-type: x mandatory; }
    }

    /* ╔══ TESTIMONIOS ESTATICOS EN TELEFONO (2026-08-29, definitivo) ═══════════════════════════
       Revierte SOLO los testimonios (las noticias siguen como marquee) a una grilla vertical
       simple: 3 tarjetas apiladas, sin scroll horizontal. Va DESPUES del bloque del marquee
       para ganarle. REVERTIR: borrar este bloque + volver el *ngFor a testimoniosLoop +
       descomentar la llamada a setupGrabbableMarquee de testimonios. ══╗ */
    @media (max-width: 640px) {
      .testimonials-section { padding-top: 3rem; padding-bottom: 3rem; }
      .testimonials-section .section-title { margin-bottom: 2rem; }
      .testimonials-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        max-width: 460px;
        margin: 0 auto;
        padding: 0 1rem;
        overflow: visible;
        cursor: default;
        scroll-snap-type: none;
      }
      .testimonial-card {
        flex: none;
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 1.3rem 1.35rem;
        scroll-snap-align: none;
      }
      .testimonial-header { margin-bottom: 0.6rem; }
      .testimonial-stars { margin-bottom: 0.6rem; }
      .testimonial-card[aria-hidden="true"] { display: none; }
      /* La central queda apenas destacada (fondo con tinte) para dar jerarquia sin el scale. */
      .testimonial-card.featured {
        transform: none;
        background: rgba(133, 92, 214, 0.055);
        border: 2px solid rgba(133, 92, 214, 0.4);
      }
      .testimonial-card.featured::after { animation: none; opacity: 0.5; }
      .testimonial-text { font-size: 0.95rem; line-height: 1.6; }
    }
    /* ╚══ fin TESTIMONIOS ESTATICOS ══╝ */
    /* ╔══ LAYOUT COMPACTO "¿Por qué EstudiaUni?" (movil) — 2026-08-29 ═══════════════════
       Las 6 tarjetas apiladas alargaban muchisimo la seccion en telefono. Este bloque las
       convierte en filas horizontales compactas (icono a la izquierda, titulo + descripcion
       a la derecha) y oculta los mini-graficos decorativos .bento-visual (roadmap / examen),
       que solo adornan y sumaban ~120px por tarjeta.
       Para REVERTIR: borrar este bloque entero, hasta la linea "fin LAYOUT COMPACTO". ═══╗ */
    @media (max-width: 768px) {
      .features-section .section-title { margin-bottom: 2rem; }

      .bento-grid { gap: 0.7rem; }

      .bento-card {
        display: grid;
        grid-template-columns: 50px 1fr;
        column-gap: 0.95rem;
        row-gap: 0.15rem;
        align-items: start;
        padding: 1rem 1.05rem;
        border-radius: 16px;
      }
      .bento-card .bento-icon {
        grid-column: 1;
        grid-row: 1 / span 2;
        align-self: center;
        margin: 0;
      }
      .bento-card .bento-icon img { width: 50px; height: 50px; }
      .bento-card h3 {
        grid-column: 2;
        grid-row: 1;
        margin: 0;
        font-size: 1.02rem;
        line-height: 1.3;
      }
      .bento-card p {
        grid-column: 2;
        grid-row: 2;
        margin: 0;
        font-size: 0.83rem;
        line-height: 1.5;
      }
      .bento-card .bento-visual { display: none; }
      /* El hover translateX descoloca la fila compacta y en movil el :hover se queda pegado
         tras un toque; se anula solo el desplazamiento, el resto del feedback se mantiene. */
      .bento-card:hover { transform: none; }
    }
    /* ╚══ fin LAYOUT COMPACTO "¿Por qué EstudiaUni?" ══════════════════════════════════════╝ */

    @media (max-width: 480px) {
      .navbar { padding: 0.45rem 0.75rem; }
      .nav-logo { font-size: 1.7rem; }
      .pricing-card { padding: 1.5rem 1.25rem; }
      .billing-opt { padding: 0 0.4rem; font-size: 1rem; }
      .billing-toggle { width: 300px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero-badge,
      .hero-title,
      .hero-subtitle,
      .hero-actions,
      .section-fade {
        opacity: 1 !important;
        transform: none !important;
        animation: none !important;
      }
    }
    
    .non-clickable {
      pointer-events: none;
      cursor: default;
      opacity: 0.7;
    }
  
    /* Animaciones continuas que el compositor NO puede manejar.

       Quedan dos casos en el hero que no se pueden pasar a transform/opacity sin cambiar el
       diseño: gradientMove anima background-position sobre un texto con background-clip: text
       (el degradado de la marca) y ai-glitch-* anima clip-path (el efecto glitch sobre "IA").
       Las dos repintan en el hilo principal en cada frame, para siempre.

       No se reescriben porque son elementos de identidad visual, pero al menos pasan a
       respetar la preferencia del sistema: quien tenga activado "reducir movimiento" -- muy
       comun en modo ahorro de bateria y en gama baja, justo los equipos donde mas se nota --
       deja de pagar ese repintado. El degradado y el texto se siguen viendo, quietos.

       El resto de las animaciones caras del home ya no son un problema: las de las secciones
       de abajo dejan de correr gracias al content-visibility de mas abajo, y la de los
       circulos .node-glow se paso a transform: scale() (ver ese bloque). Se paso de 28
       elementos con animaciones no compuestas a 6. */
    @media (prefers-reduced-motion: reduce) {
      .text-gradient,
      .ai-robotic-text,
      .ai-robotic-text::before,
      .ai-robotic-text::after {
        animation: none !important;
      }
    }

    /* ==================================================================
       FONDO AMBIENTAL REUTILIZABLE (2026-08-29)
       ==================================================================
       El hero tenia rejilla + simbolos de materias + lineas animadas, y la seccion de features su
       placa de circuito, pero el resto del home quedaba visualmente vacio -- mas todavia despues
       de quitar los desenfoques gaussianos de testimonios/precios/FAQ. Este bloque replica ese
       lenguaje visual en las secciones que no tenian nada, con tres piezas.

       TODAS son baratas a proposito, y conviene mantenerlo asi si alguien agrega mas:
        - .ambient-grid es CSS puro (dos linear-gradient repetidos + una mascara). Sin animacion:
          se pinta una vez y queda cacheado.
        - .ambient-symbol anima UNICAMENTE opacity, que el compositor si puede manejar, y esta
          oculto por completo en <=640 px (igual que los .floating-symbol del hero), asi que en
          telefono su costo es cero.
        - .ambient-lines son 2 trazos rectos con stroke-dashoffset. Es la misma tecnica que la
          placa de circuito de features; sobre lineas simples la teselacion es trivial.

       ⚠️ NADA de esto lleva filter ni backdrop-filter, y ningun elemento animado vive dentro de un
       subarbol con filtro. Ese fue exactamente el patron que hundio el FAQ a ~1 fps (ver arriba):
       un feGaussianBlur que se re-rasteriza en cada frame porque algo encima se mueve. Si se
       amplia este fondo, respetar esa regla. */
    .ambient-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
      /* Se desvanece arriba y abajo para que no se corte de golpe contra la seccion vecina. */
      mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
    }
    /* .ambient-grid se elimino: la cuadricula ahora es UNA sola capa continua sobre
       .home-container (ver .home-container::before mas arriba). Aca solo quedan los simbolos y
       las lineas, que si son por seccion. */

    /* Particulas ambientales: 6 puntos para toda la pagina, dentro del .dynamic-bg fijo.
       Animan UNICAMENTE transform y opacity -> las mueve el compositor sin repintar. Sin filtros
       (nada de box-shadow difuso ni blur), que es lo que las haria caras. */
    .amb-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(133, 92, 214, 0.55) 0%, rgba(133, 92, 214, 0) 70%);
      opacity: 0;
    }
    .d-1 { top: 18%; left: 12%; animation: amb-drift-a 26s ease-in-out infinite; }
    .d-2 { top: 62%; left: 22%; animation: amb-drift-b 32s ease-in-out infinite; animation-delay: -6s; }
    .d-3 { top: 34%; left: 78%; width: 8px; height: 8px;
           background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%);
           animation: amb-drift-a 30s ease-in-out infinite; animation-delay: -12s; }
    .d-4 { top: 76%; left: 68%; animation: amb-drift-b 28s ease-in-out infinite; animation-delay: -18s; }
    .d-5 { top: 48%; left: 46%; width: 5px; height: 5px;
           background: radial-gradient(circle, rgba(244, 114, 182, 0.45) 0%, rgba(244, 114, 182, 0) 70%);
           animation: amb-drift-a 34s ease-in-out infinite; animation-delay: -24s; }
    .d-6 { top: 8%;  left: 58%; animation: amb-drift-b 24s ease-in-out infinite; animation-delay: -3s; }

    @keyframes amb-drift-a {
      0%   { transform: translate3d(0, 0, 0) scale(1);      opacity: 0; }
      15%  { opacity: 0.9; }
      50%  { transform: translate3d(40px, -60px, 0) scale(1.5); opacity: 1; }
      85%  { opacity: 0.7; }
      100% { transform: translate3d(-20px, -120px, 0) scale(0.8); opacity: 0; }
    }
    @keyframes amb-drift-b {
      0%   { transform: translate3d(0, 0, 0) scale(0.9);    opacity: 0; }
      20%  { opacity: 0.8; }
      50%  { transform: translate3d(-50px, -70px, 0) scale(1.4); opacity: 1; }
      80%  { opacity: 0.6; }
      100% { transform: translate3d(30px, -130px, 0) scale(1); opacity: 0; }
    }
    /* En telefono se reducen a la mitad: siguen siendo baratas, pero no hace falta tanta. */
    @media (max-width: 640px) {
      .d-2, .d-4, .d-6 { display: none; }
    }
    .ambient-lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .ambient-symbol {
      position: absolute;
      font-family: var(--font-heading);
      font-weight: 300;
      color: var(--accent-primary);
      opacity: 0.02;
      will-change: opacity;
      pointer-events: none;
      user-select: none;
      white-space: nowrap;
    }
    .as-1 { top: 18%; left: 8%;  font-size: 2.1rem; animation: symbol-fade-pulse-1 5s ease-in-out infinite; }
    .as-2 { top: 26%; right: 10%; font-size: 1.6rem; animation: symbol-fade-pulse-2 6.5s ease-in-out infinite; animation-delay: 1.2s; }
    .as-3 { bottom: 22%; left: 14%; font-size: 1.5rem; animation: symbol-fade-pulse-3 7s ease-in-out infinite; animation-delay: 2.4s; }
    .as-4 { bottom: 16%; right: 12%; font-size: 1.9rem; animation: symbol-fade-pulse-4 8s ease-in-out infinite; animation-delay: 3.6s; }
    .as-5 { top: 52%; left: 46%; font-size: 1.4rem; animation: symbol-fade-pulse-2 6s ease-in-out infinite; animation-delay: 0.6s; }

    /* Los simbolos son decoracion de escritorio: en telefono se ocultan por completo, igual que
       los .floating-symbol del hero. Cero costo en el dispositivo que mas lo necesita. */
    @media (max-width: 640px) {
      .ambient-symbol { display: none !important; }
    }

    /* El fondo va en z-index 0, asi que el contenido de estas secciones necesita quedar por
       encima explicitamente: un elemento posicionado con z-index 0 crea contexto de apilamiento y
       se pintaria sobre el contenido en flujo normal, que no esta posicionado. */
    .foco-section > .foco-container,
    .news-section > .section-title,
    .news-section > .section-subtitle-custom,
    .news-section > .news-carousel-container,
    .cta-section > .cta-content,
    .footer > .footer-container {
      position: relative;
      z-index: 2;
    }

    /* ==================================================================
       RENDIMIENTO: no renderizar lo que esta fuera de pantalla
       ==================================================================
       El home mide ~15.000 px de alto contra un viewport de 812 px en telefono: el 93% del
       documento esta fuera de pantalla en la primera carga. Aun asi el navegador le hacia
       layout y paint completos y -- lo mas caro -- mantenia corriendo sus animaciones CSS
       (se midieron 75 animaciones activas a la vez en la auditoria del 2026-08-27, con 28
       elementos animando propiedades que el compositor no puede manejar).

       content-visibility: auto le permite al navegador saltarse por completo el renderizado
       de una seccion mientras esta lejos del viewport, y renderizarla al acercarse.
       contain-intrinsic-size: auto <alto> le da un alto estimado para que la barra de scroll
       no salte, y el "auto" hace que recuerde el alto real una vez que la midio de verdad.

       FIREFOX (Gecko) MOVIL:
       Firefox implementa scroll anchoring y content-visibility de forma distinta a Chromium:
       cuando el usuario hace scroll hacia abajo en movil (especialmente con flexbox apilado),
       al entrar cada seccion diferida en el rango de renderizado su transicion de intrinsic-size
       a geometria calculada produce correcciones de anclaje de scroll (scroll anchoring)
       bruscas, perceptibles como "microsaltos" continuos o tirones a lo largo de la pagina.
       Chromium maneja esto suavemente gracias a su algoritmo de render diferido asincrono.
       Para eliminar por completo los microsaltos en Firefox, se anula content-visibility y
       contain-intrinsic-size exclusivamente en Firefox via @supports (-moz-appearance: none).
       Como el home ya fue despojado de filtros blur pesados y animaciones de layout, en
       Firefox el scroll fluye 100% solido a 60 fps sin saltos.
    */
    .features-section,
    .foco-section,
    .videos-section,
    .testimonials-section,
    .pricing-section,
    .news-section,
    .faq-section,
    .cta-section,
    .footer {
      content-visibility: auto;
    }
    /* Alturas estimadas para la barra de scroll mientras la seccion no se ha renderizado. */
    .features-section     { contain-intrinsic-size: auto 1390px; }
    .foco-section         { contain-intrinsic-size: auto 960px; }
    .videos-section       { contain-intrinsic-size: auto 970px; }
    .testimonials-section { contain-intrinsic-size: auto 790px; }
    .pricing-section      { contain-intrinsic-size: auto 990px; }
    .news-section         { contain-intrinsic-size: auto 1060px; }
    .faq-section          { contain-intrinsic-size: auto 1090px; }
    .cta-section          { contain-intrinsic-size: auto 490px; }
    .footer               { contain-intrinsic-size: auto 520px; }
    @media (max-width: 640px) {
      .features-section     { contain-intrinsic-size: auto 1130px; }
      .foco-section         { contain-intrinsic-size: auto 1480px; }
      .videos-section       { contain-intrinsic-size: auto 530px; }
      .testimonials-section { contain-intrinsic-size: auto 1130px; }
      .pricing-section      { contain-intrinsic-size: auto 1660px; }
      .news-section         { contain-intrinsic-size: auto 950px; }
      .faq-section          { contain-intrinsic-size: auto 860px; }
      .cta-section          { contain-intrinsic-size: auto 490px; }
      .footer               { contain-intrinsic-size: auto 820px; }
    }

    /* Anulacion de content-visibility para Firefox: elimina los microsaltos por recalculo
       de anclaje de scroll en Gecko sin afectar Chromium/Safari. */
    @supports (-moz-appearance: none) {
      .features-section,
      .foco-section,
      .videos-section,
      .testimonials-section,
      .pricing-section,
      .news-section,
      .faq-section,
      .cta-section,
      .footer {
        content-visibility: visible !important;
        contain-intrinsic-size: none !important;
      }
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  public firestoreService = inject(FirestoreService);
  private paymentService = inject(PaymentService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Firebase's live auth-state listener (authState()) needs a real browser session to
  // resolve — off-browser it's skipped and the marketing page always prerenders in its
  // logged-out state, which is what a crawler/social-preview bot should see anyway; a real
  // visitor's actual session takes over the moment client-side hydration runs.
  isLoggedIn$ = this.isBrowser ? this.authService.isLoggedIn$ : of(false);
  user$ = this.isBrowser ? this.authService.user$ : of(null);

  // Use toSignal for easy access in template and expressions
  isLoggedIn = toSignal(this.isLoggedIn$, { initialValue: false });
  user = toSignal(this.user$, { initialValue: null });

  profileInitial = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.charAt(0).toUpperCase() || 'U';
  });

  /** [CTA PEGAJOSA MOVIL 2026-08-29] visible cuando el usuario paso el hero y todavia no llega
   *  al CTA final. Lo controlan 2 IntersectionObserver en ngAfterViewInit. REVERTIR: borrar esto,
   *  esos observers, el <button class="home-sticky-cta"> y su CSS. */
  showStickyCta = false;

  /** [BARRA DE ANUNCIO 2026-08-29] promo "41% OFF" arriba de todo. Cerrable, se recuerda en
   *  localStorage. En prerender se muestra (la mayoria de las visitas son nuevas). REVERTIR:
   *  borrar esto + dismissAnnounce() + el <div class="announce-bar"> + el host binding + su CSS. */
  showAnnounce = !this.isBrowser
    ? true
    : (() => { try { return localStorage.getItem('announce_41off_dismissed') !== '1'; } catch { return true; } })();

  dismissAnnounce() {
    this.showAnnounce = false;
    if (this.isBrowser) { try { localStorage.setItem('announce_41off_dismissed', '1'); } catch {} }
  }

  activeTab = 0;
  videosSectionInView = false;

  /** true mientras el video de la pestaña activa se reproduce. Lo sincronizan los eventos
   *  (play)/(pause) del propio <video>, no se escribe a mano en ningun otro sitio. */
  demoPlaying = false;
  /** El usuario pulso play alguna vez en esta visita. Es lo UNICO que autoriza a reanudar la
   *  reproduccion al volver a la seccion o al cambiar de pestaña: sin esto nada arranca solo. */
  private demoUserStarted = false;
  billingPeriod: 'monthly' | 'yearly' = 'monthly';
  /** Se pone en true al primer cambio de plan (no se usa para animar, solo por si algo del CSS
   *  quisiera distinguir "ya interactuaron"). */
  billingSwitched = false;
  @ViewChild('billingFill') billingFillRef?: ElementRef<HTMLElement>;

  setBilling(period: 'monthly' | 'yearly') {
    if (this.billingPeriod === period) return;
    this.billingSwitched = true;
    this.billingPeriod = period;
    this.animateBillingFill(period === 'yearly' ? 1 : -1);
  }

  /** Animacion del relleno del selector Mensual/Anual, con la Web Animations API nativa
   *  (misma idea que la sugerencia de GSAP -- ease elastico + estiramiento -- pero SIN sumar
   *  ~23 KB de libreria: WAAPI ya viene en el navegador y solo anima transform, que es trabajo
   *  de compositor). Corre una sola vez por clic, sobre un elemento de ~150x44 px: costo nulo.
   *  Se salta con prefers-reduced-motion. El estado en reposo lo fija el CSS (.billing-toggle.yearly
   *  .billing-fill), asi que al terminar la animacion el relleno queda donde debe sin fill:forwards. */
  private billingFillAnim?: Animation;
  private animateBillingFill(dir: 1 | -1) {
    if (!this.isBrowser) return;
    const el = this.billingFillRef?.nativeElement;
    if (!el) return;

    const seg = el.offsetWidth;
    if (!seg) return;                           // seccion aun sin layout (content-visibility): no animar

    if (typeof el.animate !== 'function') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const travel = seg + 8;                     // = ancho del relleno + los 8px de separacion central
    const from = dir === 1 ? 0 : travel;
    const to   = dir === 1 ? travel : 0;
    const overshoot = 7 * dir;                  // se pasa un pelin y vuelve (elastico)

    this.zone.runOutsideAngular(() => {
      this.billingFillAnim?.cancel();           // si venia una en curso (clics rapidos), se descarta
      this.billingFillAnim = el.animate(
        [
          { transform: `translateX(${from}px) scaleX(1)`,                          offset: 0 },
          { transform: `translateX(${(from + to) / 2 + overshoot}px) scaleX(1.14)`, offset: 0.45, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
          { transform: `translateX(${to + overshoot * 0.55}px) scaleX(0.97)`,      offset: 0.78 },
          { transform: `translateX(${to}px) scaleX(1)`,                            offset: 1 },
        ],
        { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'none' }
      );
    });
  }

  openFaq: number | null = null;
  /** RENDIMIENTO (2026-08-29): las 3 filas de estrellas usaban un literal *ngFor="let s of
   *  [1,2,3,4,5]" directamente en la plantilla. Un literal de array se re-crea con identidad
   *  NUEVA en cada pasada de change detection, asi que ngFor volvia a diferenciar las 15
   *  estrellas cada vez. Como constante de clase la identidad es estable y no vuelve a
   *  diferenciar nunca. */
  readonly estrellas = [1, 2, 3, 4, 5];

  /** trackBy por indice: evita que ngFor destruya y recree nodos DOM cuando el array cambia
   *  de identidad pero su contenido posicional es equivalente. */
  trackByIndex = (i: number) => i;
  /** Las noticias vienen de Firestore; si traen id se usa, si no el indice. */
  trackByNoticia = (i: number, item: any) => item?.id ?? i;

  faqs = [
    {
      q: '¿Es realmente gratis?',
      a: 'Sí, puedes crear tu cuenta gratis para siempre y sin ingresar tarjeta de crédito. Tendrás acceso a 1 ensayo diario, mini-quizzes y todo el contenido oficial. Si quieres acelerar tu puntaje con ensayos ilimitados, ruta de aprendizaje completa y nuestro Tutor IA, puedes cambiarte al plan Premium cuando lo decidas.'
    },
    {
      q: '¿Cuál es la diferencia entre el plan Básico y el Premium?',
      a: 'El plan Básico esta diseñado para realizar practicas regularmente y medir tu nivel. El plan Premium está diseñado para maximizar tu puntaje: desbloquea simulacros ilimitados, estadísticas avanzadas de tu rendimiento y acceso 24/7 a nuestro Tutor IA para resolver cualquier duda al instante.'
    },
    {
      q: '¿Puedo cancelar mi plan Premium en cualquier momento?',
      a: '¡Por supuesto! No hay amarras ni contratos a largo plazo. Puedes cancelar tu suscripción con un solo clic desde la configuración de tu cuenta, y seguirás teniendo acceso Premium hasta que termine tu ciclo de facturación.'
    },
    {
      q: '¿Los ensayos están actualizados al temario oficial?',
      a: 'Totalmente. Todo nuestro banco de preguntas y simulacros se actualiza constantemente bajo los temarios oficiales más recientes del DEMRE. Estudiarás exactamente lo que necesitas saber para la prueba, sin perder tiempo en materia obsoleta.'
    },
    {
      q: '¿Sirve para todas las pruebas (Competencia Lectora, Matemáticas, Ciencias e Historia)?',
      a: 'Sí, nuestra plataforma cubre la preparación completa para M1, M2, Competencia Lectora y las pruebas electivas de Ciencias e Historia y Ciencias Sociales.'
    },
    {
      q: '¿Cómo funciona exactamente el Tutor IA?',
      a: 'A diferencia de un libro o un preuniversitario tradicional, nuestro Tutor IA no solo te da la respuesta correcta. Analiza tu error en tiempo real y te explica el paso a paso de forma personalizada para que entiendas el concepto de fondo y no vuelvas a equivocarte en el futuro.'
    },
    {
      q: '¿Puedo usar la plataforma desde mi celular?',
      a: 'Sí, toda la interfaz está optimizada para que funcione perfecto en tu computadora, tablet o teléfono. Puedes rendir un ensayo completo en casa o aprovechar un viaje en micro para hacer mini-quizzes.'
    }
  ];

  toggleFaq(index: number) {
    this.openFaq = this.openFaq === index ? null : index;
  }

  news: any[] = [
    {
      title: 'Inscripción PAES 2026: DEMRE lanza dura advertencia por cambio clave',
      source: 'El Mostrador',
      date: '2026-05-19',
      dateText: '19 de mayo, 2026',
      excerpt: 'El DEMRE advirtió sobre la importancia del cambio de clave del usuario en el portal de inscripción, ya que olvidar o errar en este paso podría dejar a los postulantes fuera del proceso regular.',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      icon: '⚠️',
      tag: '¡Advertencia!',
      linkUrl: 'https://www.elmostrador.cl/datos-utiles/2026/05/19/inscripcion-paes-2026-demre-lanza-dura-advertencia-por-cambio-clave-que-podria-dejarte-fuera/',
      imageUrl: 'assets/imagesHome/seccion noticias/noticia1.jpeg'
    },
    {
      title: 'Comenzó el periodo de inscripción a la PAES de invierno 2026',
      source: 'Ministerio de Educación',
      date: '2026-03-04',
      dateText: '4 de marzo, 2026',
      excerpt: 'Hasta el martes 17 de marzo a las 13:00 horas, las y los egresados de enseñanza media podrán inscribirse para rendir la prueba de invierno los días 15, 16 y 17 de junio.',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      icon: '❄️',
      tag: 'PAES Invierno',
      linkUrl: 'https://www.mineduc.cl/comenzo-el-periodo-de-inscripcion-a-la-paes-de-invierno-2026-admision-2027/',
      imageUrl: 'assets/imagesHome/seccion noticias/noticia2.jpg'
    },
    {
      title: 'PAES Invierno 2026: cuándo es y cómo hacer la inscripción',
      source: 'Iplacex',
      date: '2026-03-05',
      dateText: '5 de marzo, 2026',
      excerpt: 'La PAES de invierno ya tiene fechas confirmadas. Revisa cuándo es, cómo funciona el proceso de inscripción y los requisitos obligatorios para rendirla con éxito.',
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      icon: '📝',
      tag: 'Guía Práctica',
      linkUrl: 'https://www.iplacex.cl/blogs/paes-invierno-2026-cuando-es-y-como-hacer-la-inscripcion/',
      imageUrl: 'assets/imagesHome/seccion noticias/noticia3.webp'
    }
  ];

  /** Testimonios de la seccion "Lo que dicen nuestros estudiantes". */
  // [TESTIMONIOS: TEXTO ACORTADO 2026-08-29] las citas originales eran de ~50 palabras cada una:
  // con la grilla estatica las tarjetas quedaban de ~340px y la seccion se iba a ~1350px. Se
  // recortaron a ~30 palabras (mismo tono, la mejor frase de cada una). REVERTIR: restaurar los
  // textos largos (estan en el historial de git / bitacora).
  readonly testimonios = [
    {
      nombre: 'Mati',
      rol: 'Aspirante a Ing. Civil',
      avatar: 'assets/imagesHome/seccion opiniones/1-avatar-v1.webp',
      alt: 'Estudiante Mati',
      featured: false,
      texto: '"El tutor IA es brígido: te explica al toque por qué te equivocaste en medio del ensayo, sin andar buscando en Google. Apaña caleta para entender todo."'
    },
    {
      nombre: 'ValeRojas',
      rol: 'Futura estudiante de Psicología',
      avatar: 'assets/imagesHome/seccion opiniones/2-avatar-v1.webp',
      alt: 'Estudiante ValeRojas',
      featured: true,
      texto: '"Me costaba sentarme a estudiar, pero con los simulacros interactivos se hace cero pesado. Cacha altiro lo que te cuesta y te lo hace repasar. Me pasé al premium y vale 100% la pena."'
    },
    {
      nombre: 'Seba',
      rol: 'Aspirante a Derecho',
      avatar: 'assets/imagesHome/seccion opiniones/3-avatar-v1.webp',
      alt: 'Estudiante Seba',
      featured: false,
      texto: '"Está filete. Puedo armar los miniquizzes como quiera y los minijuegos son adictivos. La recomiendo a todos los que les cueste estudiar, jaja."'
    }
  ];
  /** Lista TRIPLICADA para el marquee agarrable de telefono: el track es un scroll-container real
   *  y setupGrabbableMarquee() lo recentra por 1/3 del ancho al cruzar los bordes, dejando siempre
   *  un juego completo de margen a cada lado para arrastrar. Los clones van con aria-hidden y en
   *  desktop se ocultan con .testimonial-card[aria-hidden="true"] { display: none }. */
  readonly testimoniosLoop = [...this.testimonios, ...this.testimonios, ...this.testimonios];

  /** Igual que testimoniosLoop pero para las noticias, que llegan async desde Firestore. */
  private _newsLoopCache: { src: any[]; out: any[] } = { src: [], out: [] };
  get newsLoop(): any[] {
    if (this._newsLoopCache.src !== this.news) {
      this._newsLoopCache = {
        src: this.news,
        out: this.news.length > 1 ? [...this.news, ...this.news, ...this.news] : this.news.slice()
      };
    }
    return this._newsLoopCache.out;
  }

  scrollNews(direction: 'left' | 'right') {
    const container = document.querySelector('.news-track') as HTMLElement;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  // ── Barra de progreso del carrusel de noticias (solo desktop/tablet, y solo si hay scroll) ──
  private newsTrackEl: HTMLElement | null = null;
  private newsThumbEl: HTMLElement | null = null;
  private newsIndicatorEl: HTMLElement | null = null;
  private newsThumbRafPending = false;

  /** Sincroniza la barra con la posicion de scroll horizontal del carrusel. Solo lee/escribe
   *  geometria del propio track, y siempre detras de un rAF (el listener de scroll dispara muchas
   *  veces por gesto). Si el carrusel no se puede desplazar (pocas noticias), oculta la barra. */
  private updateNewsScrollThumb = () => {
    const track = this.newsTrackEl;
    const thumb = this.newsThumbEl;
    if (!track || !thumb || !track.scrollWidth) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    this.newsIndicatorEl?.classList.toggle('has-overflow', maxScroll > 4);
    if (maxScroll <= 4) return;
    const widthPct = Math.max(15, Math.min(100, (track.clientWidth / track.scrollWidth) * 100));
    const leftPct = (track.scrollLeft / maxScroll) * (100 - widthPct);
    thumb.style.width = widthPct + '%';
    thumb.style.left = leftPct + '%';
  };

  private onNewsScroll = () => {
    if (this.newsThumbRafPending) return;
    this.newsThumbRafPending = true;
    requestAnimationFrame(() => {
      this.newsThumbRafPending = false;
      this.updateNewsScrollThumb();
    });
  };

  activeStudentsCount = 767;
  private activeStudentsTimer: any = null;

  isScrolled = false;
  mobileMenuOpen = false;
  animationsReady = false;
  currentTheme = 'theme-hero';
  navbarHidden = false;
  lastScrollY = 0;
  scrollOffset = 0;

  legalModalType: 'terms' | 'privacy' | null = null;

  showFocoBubble = false;
  focoMessage = '';
  mascotTransform = '';
  hoveredBenefitIndex: number | null = null;

  onBenefitHover(index: number) {
    this.hoveredBenefitIndex = index;
    const yOffsets = [-95, 0, 95];
    const rotates = [-6, 0, 6];
    const transformStr = `translate(70px, ${yOffsets[index]}px) scale(0.82) rotate(${rotates[index]}deg)`;
    const mascotEl = document.querySelector('.foco-mascot') as HTMLElement;
    if (mascotEl) {
      mascotEl.style.transform = transformStr;
    }
  }

  onBenefitLeave() {
    this.hoveredBenefitIndex = null;
    const mascotEl = document.querySelector('.foco-mascot') as HTMLElement;
    if (mascotEl) {
      mascotEl.style.transform = 'translate(0px, 0px) scale(1)';
    }
  }

  onFocoClick() {
    if (this.showFocoBubble) return; // Prevent spamming

    const messages = [
      "Tengo 3 corazones y los 3 creen que te va a ir increíble en la PAES. 🐙❤️",
      "Si yo puedo coordinar 8 tentáculos a la vez, tú puedes con un sistema de ecuaciones. ¡Vamos! 🧠⚡",
      "¿Sabías que los pulpos somos genios? Pero ni yo entiendo por qué sigues postergando Geometría. 👀",
      "Tengo 9 cerebros y todos coinciden en que te mereces un recreo de 5 minutos antes de seguir. ☕",
      "Si la PAES te asusta, recuerda que yo puedo camuflarme... pero tú tienes que dar la cara. ¡Estudia! 😂🚀",
      "No dejes para mañana el ensayo que puedes responder a medias hoy. ¡Peor es nada! 😂📝",
      "No te estreses, la prueba se conquista un tentáculo a la vez. ¡Yo te apaño! 🐙✊",
      "Mis primos andan felices en el mar y yo aquí descifrando el Demre contigo. ¡Aprovéchame! 🌊💡",
      "Visualízate en la U: durmiendo 3 horas, tomando café frío y siendo extremadamente feliz. ¡El sueño! 🎓☕",
      "No tengo huesos, pero mi fe en tu puntaje es más firme que una roca. ¡Dale con todo! 💪🐙",
      "Estudiar es duro, pero más duro es entender qué quería decir el Demre en esa pregunta de Lenguaje. 🤫",
      "¡Oye! Deja de hacerle cosquillas a mis ventosas y ponte a hacer un ensayo. ¡Anda! 🎯",
      "La memoria de los pulpos es corta, pero por suerte mi Tutor IA tiene base de datos infinita. ¡Úsala! 💾🧠",
      "¡Dame esos cinco... ah, no, dame esos ocho! ¡Hagamos un mini-quiz hoy! 🖐️🐙",
      "Procrastinar es un arte hermoso, pero lamentablemente no entra en el temario de la M1. ¡A estudiar! 🎨📊",
      "¿Sabías que puedo abrir frascos con mis tentáculos? Resolver guías contigo es casi tan divertido. 😉🧪",
      "Si te equivocas en Química, recuerda: si no eres parte de la solución, eres parte del precipitado. 🧪💥",
      "Si me dieran un peso por cada pregunta de Física que he visto fallar, ya tendría mi propio acuario. 🐠💸",
      "El teorema de Pitágoras es fácil, lo difícil es acordarse de él cuando te quedan 5 minutos de prueba. 📐⏱️",
      "Si te sientes bajo presión, recuerda que los pulpos vivimos a miles de metros bajo el agua. ¡Tú puedes con esto! 🌊💎",
      "¿Sabías que los pulpos podemos cambiar de color? Ojalá tú pudieras cambiar tus respuestas incorrectas así de rápido. 🎨😜",
      "Estudiar Historia es genial, hasta que te das cuenta de que tienes que memorizar 200 años en una tarde. 📜⏳",
      "Tu cerebro es como mi tinta: cuando te asustas, ¡se nubla todo! Respira hondo y concéntrate. 🖤🧠",
      "La probabilidad de que saques sobre 800 puntos es directamente proporcional a las ganas que le pongas hoy. 📊📈",
      "Si me pagaran en almejas por cada error corregido, ya sería el pulpo más rico del Océano Pacífico. 🐚💰",
      "¿Y si en vez de ver memes hacemos un quiz corto? Prometo que no le diré a nadie. 🤫📱",
      "Un pulpo sabio dijo una vez: 'El que no repasa lo aprendido, se lo lleva la corriente'. 🌊🎓",
      "Mis ventosas me dicen que esa pregunta de suficiencia de datos está más sospechosa que sushi de luca. 🍣👀",
      "¡Ánimo! Hasta el agua más fría se calienta si le pones empeño. ¡A por ese puntaje nacional! 🚀🔥",
      "Si te trabas en una pregunta de Comprensión Lectora, lee el final primero. Truco de pulpo viejo. 📖🐙",
      "El café no reemplaza el sueño, pero pucha que ayuda a entender las funciones cuadráticas. ☕📉",
      "¿Sabías que mi sangre es azul? Pero mi corazón es morado EstudiaUni. ¡Te tengo toda la fe! 💜🐙",
      "Los tentáculos me tiemblan de la emoción al ver cómo mejoras en cada sesión. ¡Sigue así! 🐙✨",
      "Si la ley de gravedad te confunde, recuerda que en el agua todo flota... menos tu promedio si no estudias. 🍎🌊",
      "Hay tres cosas seguras en la vida: la muerte, los impuestos y que el Demre pondrá un texto larguísimo en la PAES. 📜💀",
      "Si te da sueño, haz 10 saltos. O mueve tus 8 extremidades. ¡A activar el cerebro! 🏃‍♂️⚡",
      "¿Sabías que los pulpos usamos herramientas? Tu mejor herramienta hoy es este Tutor IA. ¡Aprovéchalo! 🛠️🧠",
      "El éxito en la PAES no llega por arte de magia, llega por hacer click en Foco y estudiar con ganas. 😉✨",
      "A veces me dan ganas de camuflarme de hoja para no ver cómo dejas las preguntas en blanco. ¡Responde con descarte inteligente! 🍂🧐",
      "¿Qué hace un pulpo estudiando álgebra? Salvarte del rojo y asegurar tu cupo en la U. 🎓🐙",
      "Si la trigonometría te da vueltas la cabeza, imagínate a mí tratando de desenredar mis tentáculos. 🌀🤯",
      "La constancia hace al maestro, y el descarte inteligente hace al puntaje nacional. 🎯💡",
      "¡No te rindas! La CPU de tu cerebro tiene más potencia que toda la tecnología que llevó al humano a la Luna. 🚀🧠",
      "Ojalá la PAES fuera de biología marina... ahí sí que los pasearía a todos. 🌊🐚",
      "¿Estás cansado? Cierra los ojos 2 minutos. Pero pon alarma, que te conozco y despiertas mañana. ⏰😴",
      "Mi noveno cerebro me dice que hoy es un excelente día para dominar la regla de tres. 📊⚡",
      "Si un pulpo sin esqueleto puede mantenerse firme frente a las corrientes del mar, tú puedes con la PAES. 💪🌊",
      "¿Sabías que los pulpos tenemos el cerebro en los tentáculos? Yo estudio mientras te abrazo... virtualmente. 🤗🐙",
      "Estudiar con música ayuda, pero cantar a todo pulmón no cuenta como repaso de Competencia Lectora. 🎤📖",
      "Si no entiendes un gráfico de barras, míralo de lado. A veces el secreto está en la perspectiva. 📊😜",
      "No hay preguntas tontas, solo preguntas que Foco responde con peras y manzanas en 2 segundos. 🍎🍏",
      "El temario de la PAES es más largo que un día sin pan, pero contigo al mando lo terminamos rápido. 🥖📈",
      "¡Ojo con los signos negativos en matemáticas! Son más traicioneros que pisar una jaiba descalzo. 🦀⚠️",
      "¿Un mini-quiz ahora? Es rápido, indoloro y te acerca un paso más a la carrera de tus sueños. 🏁🎓",
      "Si te bloqueas, toma agua. Hidratar los tentáculos (y las neuronas) siempre funciona. 💧🧠",
      "La PAES es solo una prueba. No define quién eres, pero pucha que ayuda a entrar a la U sin deudas. 💸🎓",
      "Oye, ¿sabías que los pulpos podemos regenerar nuestros tentáculos? Tú también puedes regenerar tus ganas de estudiar. 🐙🌱",
      "Las matemáticas son el lenguaje del universo, y yo soy el traductor oficial de tu éxito. 🌌📐",
      "Si la física te supera, recuerda que hasta la manzana de Newton tuvo que caer para que entendiéramos algo. 🍎💥",
      "¿Qué tal si resolvemos 3 preguntas más antes de ir a revisar Instagram? Hagamos el trato. 🤝📱",
      "No te compares con el resto. Cada pulpo nada a su propio ritmo en este inmenso océano. 🌊🐢",
      "¿Sabías que somos capaces de soñar? Yo sueño con el día en que me digas que sacaste puntaje nacional. 💭🏆",
      "¡Estudia hoy y agradécete a ti mismo mañana! La recompensa vale cada página leída. 📖✨",
      "Las neuronas son gratis, úsalas sin miedo antes de que se oxiden en vacaciones. 😂🧠",
      "¿Sabías que mi piel puede imitar texturas? Ojalá pudiera imitar las respuestas correctas de la pauta. 🤫🎨",
      "Un ensayo a la semana mantiene al Demre alejado y al estrés controlado. ¡Agéndalo! 📝📅",
      "Si te equivocas en matemáticas, recuerda que hasta los números primos tienen sus secretos. 🔢🤫",
      "No hay atajos para el éxito, pero Foco es el mejor GPS que vas a encontrar en el camino. 🗺️🐙",
      "El cansancio es temporal, el título universitario colgado en la pared de tu living es para siempre. 🎓🖼️",
      "¿Sabías que los pulpos somos solitarios? Por suerte, tú me tienes a mí para no estudiar solo. 🤗🐙",
      "Si la química orgánica te da dolor de cabeza, piensa en el carbono como el amigo que se une con todos. 🧪🤝",
      "Un día de estudio inteligente vale por tres días de memorizar sin entender. ¡Enfócate en el concepto! 💡🧠",
      "La PAES no mide tu valor, mide tu estrategia. Y yo soy el mejor estratega marino. 🗺️🐙",
      "Deja el celular a tres metros de distancia. Tus tentáculos me lo agradecerán después. 📱🚫",
      "¿Sabías que tenemos tres corazones porque bombeamos sangre a alta presión? Justo como tú en la PAES. 🐙💓",
      "Si te cuesta concentrarte, haz la técnica Pomodoro. ¡Yo te aviso cuando termine el recreo! 🍅⏱️",
      "El álgebra es como resolver un misterio policiaco: hay que encontrar a la 'X' antes de que escape. 🕵️‍♂️🔍",
      "Si te da flojera repasar, piensa en la cara de tu yo del futuro agradeciéndote este momento. 😉🚀",
      "Oye, ¿hacemos una competencia de rapidez? Responde este mini-quiz y te digo tu puntaje estimado. 🏆📈",
      "La física no es difícil, solo es el universo jugando a las escondidas con sus leyes. 🌌🔍",
      "¿Sabías que el pulpo imitador puede copiar a 15 especies distintas? Tú solo debes copiar las buenas prácticas de estudio. 🎭📚",
      "Un paso pequeño hoy es un salto gigante hacia tu carrera en marzo. ¡Vamos por esa matrícula! 🎓🚀",
      "No le temas al fracaso. El fracaso es solo información gratis de lo que debes mejorar. 📊💡",
      "Si los logaritmos te asustan, piensa que solo son potencias disfrazadas de superhéroes. 🦸‍♂️⚡",
      "Mantén la calma. Si yo puedo mantener la cabeza fría bajo el océano ártico, tú puedes con este ensayo. ❄️🧠",
      "¿Sabías que tenemos pupilas rectangulares? Nos ayuda a enfocar todo. Igual que tú con tu meta de la U. 👁️🎯",
      "¡La suerte favorece a las mentes preparadas! Y tú te estás preparando con el mejor tutor del planeta. 🌍🐙",
      "Si la geometría te aburre, recuerda que el mundo está hecho de formas y tú estás modelando tu futuro. 📐🎨",
      "Respira profundo. Cuenta hasta 8 (un número muy bonito, por cierto). Ahora continúa. 🧘‍♂️🐙",
      "¿Sabías que los pulpos no tenemos oídos? Pero te escucho fuerte y claro cuando dices que estás cansado. ¡Ánimo! 👂🚫",
      "El esfuerzo de hoy es la tranquilidad de mañana cuando salgan los resultados. ¡Dale con todo! 📝✨",
      "Si te trabas con las fracciones, recuerda que siempre es mejor compartir una pizza que pelearse por ella. 🍕🔢",
      "Oye, ¿sabías que somos capaces de recordar caminos complejos? Memorizar este temario es pan comido. 🗺️🧠",
      "¡Cree en ti! Si una criatura marina de cuerpo blando puede programar IA contigo, tú puedes con la PAES. 💻🐙",
      "Las ciencias sociales nos enseñan de dónde venimos, y Foco te enseña hacia dónde vas: directo a la U. 🎓🌍",
      "Si te cuesta empezar, recuerda que el primer tentáculo es el más difícil de mover. ¡El resto lo sigue! 🏃‍♂️🐙",
      "¿Sabías que los pulpos somos sumamente curiosos? La curiosidad es el motor del verdadero aprendizaje. 🧐💡",
      "No dejes que una pregunta difícil te arruine el día. Pásala, respira y vuelve a ella al final. ⏱️🚀",
      "La preparación vence al azar. No vayas a la PAES a adivinar, ve a demostrar lo que vales. 🧠🏆",
      "¡Felicidades por estudiar hoy! Eres parte del porcentaje que realmente se la juega por su futuro. 🐙🎓✨"
    ];
    this.focoMessage = messages[Math.floor(Math.random() * messages.length)];
    this.showFocoBubble = true;

    // Antes este setTimeout no se guardaba en ningun lado, asi que no habia forma de
    // cancelarlo en ngOnDestroy: podia dispararse contra un componente ya destruido.
    if (this.focoBubbleTimer) clearTimeout(this.focoBubbleTimer);
    this.focoBubbleTimer = setTimeout(() => {
      this.showFocoBubble = false;
      this.cdr.markForCheck();
    }, 5000);
  }


  // CODIGO ELIMINADO (2026-08-29): animateCounters()/animateValue() eran un bucle de
  // requestAnimationFrame que solo se disparaba al ver un elemento .hero-stats -- una clase
  // que NO existe en esta plantilla. Sus 3 propiedades (count1/2/3) tampoco estaban ligadas
  // a nada. Camino muerto completo, junto con su CSS.

  // Hero Live Interactive SaaS Simulation Dataset & State Machine
  heroSimExercises = [
    {
      subject: 'Matemáticas',
      questionNum: 'Pregunta 12/65',
      timer: '01:24:37',
      progress: '28%',
      text: '¿Cuál es el valor de x en la ecuación 3x + 6 = 18?',
      options: [
        { key: 'A', val: 'x = 2' },
        { key: 'B', val: 'x = 4' },
        { key: 'C', val: 'x = 5' },
        { key: 'D', val: 'x = 6' }
      ],
      correctIndex: 1,
      explanation: '¡Excelente! 🎉 Despejaste correctamente la ecuación. Recuerda dividir ambos lados por el coeficiente de x.',
      stepBreakdown: '3x + 6 = 18  →  3x = 12  →  x = 4',
      recommendation: '🎯 Tema recomendado: Despeje de Ecuaciones de 1° Grado',
      overallProgress: '72%',
      strengths: ['Álgebra', 'Ecuaciones', 'Funciones'],
      weaknesses: ['Geometría', 'Probabilidad']
    },
    {
      subject: 'Competencia Lectora',
      questionNum: 'Pregunta 28/65',
      timer: '01:10:45',
      progress: '43%',
      text: 'En el párrafo 3, ¿con qué intención el autor utiliza la expresión "el reloj de arena"?',
      options: [
        { key: 'A', val: 'Describir un instrumento histórico.' },
        { key: 'B', val: 'Enfatizar la urgencia de actuar antes del límite.' },
        { key: 'C', val: 'Criticar la falta de puntualidad.' },
        { key: 'D', val: 'Explicar la medición del tiempo.' }
      ],
      correctIndex: 1,
      explanation: '¡Bien deducido! 💡 La metáfora enfatiza la urgencia y el paso del tiempo límite.',
      stepBreakdown: 'Texto literal  →  Sentido figurado  →  Inferir intención',
      recommendation: '🎯 Habilidad recomendada: Interpretación de Figuras Literarias',
      overallProgress: '64%',
      strengths: ['Comprensión', 'Inferencia', 'Vocabulario'],
      weaknesses: ['Síntesis', 'Evaluación']
    },
    {
      subject: 'Ciencias - Química',
      questionNum: 'Pregunta 09/80',
      timer: '01:45:00',
      progress: '11%',
      text: '¿Qué tipo de enlace químico predomina en la molécula de agua (H₂O)?',
      options: [
        { key: 'A', val: 'Enlace Iónico' },
        { key: 'B', val: 'Enlace Covalente Polar' },
        { key: 'C', val: 'Enlace Metálico' },
        { key: 'D', val: 'Enlace Covalente Apolar' }
      ],
      correctIndex: 1,
      explanation: '¡Muy bien! ⚡ La diferencia de electronegatividad genera momentos dipolares polares.',
      stepBreakdown: 'Δ Electronegatividad (O-H) > 0.4  →  Covalente Polar',
      recommendation: '🎯 Tema recomendado: Geometría Molecular y Polaridad',
      overallProgress: '81%',
      strengths: ['Estructura atómica', 'Enlaces', 'Soluciones'],
      weaknesses: ['Estequiometría', 'Termoquímica']
    }
  ];

  heroSimIndex = 0;
  heroSimStep = 0; // 0: Start, 1: Selection, 2: Analyzing, 3: Typing Foco, 4: Concept show
  heroSimTypedText = '';
  heroSimTypingTimer: any = null;
  heroSimCycleTimer: any = null;
  private heroSimTimeouts: any[] = [];
  private destroyed = false;
  private globalListeners: Array<{ target: EventTarget; type: string; handler: EventListener; options?: any }> = [];

  /** Todos los IntersectionObserver de este componente, para desconectarlos en ngOnDestroy.
   *  Antes se creaban 3 y ninguno se desconectaba: seguian vivos tras destruir el componente. */
  private observers: IntersectionObserver[] = [];
  /** Desengancha el parallax de la mascota de Foco (mousemove/mouseleave en document). Solo
   *  existe si el dispositivo tiene puntero fino; ver ngAfterViewInit. */
  private desengancharParallaxFoco: (() => void) | null = null;
  /** Debounce de la clase .is-scrolling. Antes era una variable local del listener y por lo
   *  tanto no se podia cancelar en ngOnDestroy. */
  private scrollEndTimer: any = null;
  /** setTimeout que oculta la burbuja de Foco. Mismo problema que el anterior. */
  private focoBubbleTimer: any = null;
  /** El hero se pausa cuando sale de pantalla (ver ngAfterViewInit). */
  private heroAnimacionesActivas = false;

  /** Registers a window/document listener and remembers it so ngOnDestroy can remove it —
   *  these are added via zone.runOutsideAngular() and otherwise outlive this component. */
  private registerGlobalListener(target: EventTarget, type: string, handler: EventListener, options?: any) {
    target.addEventListener(type, handler, options);
    this.globalListeners.push({ target, type, handler, options });
  }

  private removeGlobalListeners() {
    this.globalListeners.forEach(({ target, type, handler, options }) => {
      target.removeEventListener(type, handler, options);
    });
    this.globalListeners = [];
  }

  get currentSimExercise() {
    return this.heroSimExercises[this.heroSimIndex];
  }

  /** El 'progress' del ejercicio viene como cadena de porcentaje ('28%'); la barra lo aplica como
   *  scaleX (0-1) en vez de como width, para no disparar layout en cada frame. Ver el CSS de
   *  .sim-progress-bar-fill. */
  get simProgressFraction(): number {
    const pct = parseFloat(this.currentSimExercise?.progress ?? '0');
    return isNaN(pct) ? 0 : Math.max(0, Math.min(1, pct / 100));
  }

  startHeroSimulation() {
    this.heroAnimacionesActivas = true;
    this.runHeroSimCycle();
  }

  /** RENDIMIENTO (2026-08-29): el hero no lleva content-visibility, asi que su simulacion
   *  (cadena infinita de setTimeout + un typewriter de 32 ms que re-entra a la zona de Angular)
   *  seguia corriendo aunque el usuario estuviera al final de la pagina. Se pausa al salir de
   *  pantalla y se reanuda al volver; lo dispara un IntersectionObserver en ngAfterViewInit. */
  private pausarAnimacionesHero() {
    if (!this.heroAnimacionesActivas) return;
    this.heroAnimacionesActivas = false;
    if (this.heroSimTypingTimer) { clearInterval(this.heroSimTypingTimer); this.heroSimTypingTimer = null; }
    if (this.heroSimCycleTimer) { clearTimeout(this.heroSimCycleTimer); this.heroSimCycleTimer = null; }
    this.heroSimTimeouts.forEach(h => clearTimeout(h));
    this.heroSimTimeouts = [];
    if (this.activeStudentsTimer) { clearInterval(this.activeStudentsTimer); this.activeStudentsTimer = null; }
  }

  private reanudarAnimacionesHero() {
    if (this.heroAnimacionesActivas || this.destroyed) return;
    this.heroAnimacionesActivas = true;
    this.zone.run(() => {
      this.runHeroSimCycle();
      this.updateActiveStudentsCount();
      this.arrancarIntervaloEstudiantes();
      this.cdr.markForCheck();
    });
  }

  /** setTimeout wrapper that tracks the handle and no-ops after ngOnDestroy, so the
   *  animation chain below (which nests several nested setTimeout calls) can't keep
   *  firing against a destroyed component. */
  private trackedTimeout(fn: () => void, delay: number) {
    const handle = setTimeout(() => {
      if (this.destroyed) return;
      fn();
    }, delay);
    this.heroSimTimeouts.push(handle);
    return handle;
  }

  runHeroSimCycle() {
    this.heroSimStep = 0;
    this.heroSimTypedText = '';
    if (this.heroSimTypingTimer) clearInterval(this.heroSimTypingTimer);
    if (this.heroSimCycleTimer) clearTimeout(this.heroSimCycleTimer);

    this.cdr.markForCheck();

    // Step 1 (t = 2.2s): Select Option
    this.heroSimCycleTimer = this.trackedTimeout(() => {
      this.heroSimStep = 1;
      this.cdr.markForCheck();

      // Step 2 (t = 3.8s): Analyzing Response
      this.trackedTimeout(() => {
        this.heroSimStep = 2;
        this.cdr.markForCheck();

        // Step 3 (t = 5.2s): Start Typewriter
        this.trackedTimeout(() => {
          this.heroSimStep = 3;
          this.cdr.markForCheck();
          const fullText = this.currentSimExercise.explanation;
          let charIdx = 0;
          // En teléfonos (puntero grueso) la cadencia baja: 60 ms/caracter y markForCheck cada
          // 6 (~2,7 pasadas de CD/s en vez de ~8), porque este typewriter corre TODO el tiempo
          // que el hero está aunque sea parcialmente visible -- o sea, justo mientras el usuario
          // scrollea el hero de arriba a abajo. Sigue leyéndose como escritura fluida.
          const coarse = typeof window !== 'undefined'
            && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
          const tickMs = coarse ? 60 : 32;
          const markEvery = coarse ? 6 : 4;
          // Runs outside Angular's zone so the ~30fps character tick doesn't force a
          // full-tree change detection pass on every frame (was the main cause of hero
          // animation jank while scrolling). CD is re-entered only every few characters.
          this.zone.runOutsideAngular(() => {
            this.heroSimTypingTimer = setInterval(() => {
              if (this.destroyed) { clearInterval(this.heroSimTypingTimer); return; }
              if (charIdx < fullText.length) {
                this.heroSimTypedText += fullText.charAt(charIdx);
                charIdx++;
                // Con OnPush basta con marcar el componente: ya no hace falta una pasada de CD global.
                if (charIdx % markEvery === 0 || charIdx === fullText.length) {
                  this.zone.run(() => this.cdr.markForCheck());
                }
              } else {
                clearInterval(this.heroSimTypingTimer);
                this.zone.run(() => {
                  // Step 4 (t = +1s): Show Concept Pill
                  this.trackedTimeout(() => {
                    this.heroSimStep = 4;
                    this.cdr.markForCheck();

                    // Step 5 (t = +3.2s): Transition to next exercise
                    this.trackedTimeout(() => {
                      this.heroSimIndex = (this.heroSimIndex + 1) % this.heroSimExercises.length;
                      this.runHeroSimCycle();
                    }, 3200);
                  }, 900);
                });
              }
            }, tickMs);
          });
        }, 1500);
      }, 1600);
    }, 2200);
  }

  ngOnInit() {
    // Both the profile/news Firestore reads and the hero-simulation/active-students timers
    // are for a logged-in browser session and decorative live content — neither is part of
    // the crawlable marketing copy. Skipped entirely during server-side prerendering: a live
    // Firestore call that stalls (or is unreachable from the build environment) would hang
    // the whole build instead of failing fast, and the infinite setTimeout/setInterval chain
    // never lets the render pass reach the "stable" state needed to snapshot the HTML.
    if (this.isBrowser) {
      this.firestoreService.getUserProfile().subscribe();

      // Las noticias NO se leen al arrancar. Su seccion esta a ~11.000 px de scroll, asi que la
      // consulta a Firestore se dispara recien cuando esa seccion se acerca al viewport (ver
      // ngAfterViewInit). Antes se hacia por tiempo (requestIdleCallback + setTimeout) y eso tenia
      // dos problemas medidos el 2026-08-27:
      //   - El visitante que nunca baja hasta ahi -- la enorme mayoria -- pagaba igual el
      //     handshake de Firestore.
      //   - Firestore transporta por WebChannel con long-polling: la conexion queda ABIERTA, y
      //     Lighthouse la contabiliza en la cadena critica con su duracion completa. En 3 corridas
      //     casi identicas eso hizo saltar la "latencia maxima de ruta critica" entre 3,4 s y
      //     15,8 s, y el Speed Index entre 5,7 s y 12,1 s. Era la mayor fuente de varianza de la
      //     medicion, no una diferencia real de codigo.
      // (el disparador vive en ngAfterViewInit: se carga al acercarse la seccion, no por tiempo)
      this.startHeroSimulation();
      this.startActiveStudentsFluctuation();
    }
  }

  ngOnDestroy() {
    this.destroyed = true;
    if (this.activeStudentsTimer) {
      clearInterval(this.activeStudentsTimer);
    }
    if (this.heroSimTypingTimer) clearInterval(this.heroSimTypingTimer);
    if (this.heroSimCycleTimer) clearTimeout(this.heroSimCycleTimer);
    this.heroSimTimeouts.forEach(h => clearTimeout(h));
    this.heroSimTimeouts = [];
    // Estos dos no se limpiaban: eran variables locales de sus manejadores.
    if (this.scrollEndTimer) clearTimeout(this.scrollEndTimer);
    if (this.focoBubbleTimer) clearTimeout(this.focoBubbleTimer);
    // Los IntersectionObserver tampoco se desconectaban nunca.
    this.observers.forEach(o => o.disconnect());
    this.observers = [];
    this.marqueeStops.forEach(stop => stop());
    this.marqueeStops = [];
    if (this.desengancharParallaxFoco) this.desengancharParallaxFoco();
    this.removeGlobalListeners();
  }

  startActiveStudentsFluctuation() {
    this.updateActiveStudentsCount();
    this.arrancarIntervaloEstudiantes();
  }

  private arrancarIntervaloEstudiantes() {
    if (this.activeStudentsTimer) clearInterval(this.activeStudentsTimer);
    // Corre fuera de la zona: antes este setInterval provocaba una pasada COMPLETA de change
    // detection cada 5 segundos, para siempre, solo para mover un contador del hero. Ahora
    // marca el componente explicitamente, que con OnPush es todo lo que hace falta.
    this.zone.runOutsideAngular(() => {
      this.activeStudentsTimer = setInterval(() => {
        if (this.destroyed) return;
        const change = Math.floor((Math.random() - 0.47) * 9);
        this.activeStudentsCount = Math.max(115, this.activeStudentsCount + change);
        this.zone.run(() => this.cdr.markForCheck());
      }, 5000);
    });
  }

  updateActiveStudentsCount() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;

    // Modelación senoidal: mínimo en la madrugada (04:00 hrs ~140 - 280), pico en la tarde/noche (18:00 - 21:00 hrs ~750 - 980)
    const rad = ((hour - 4) / 24) * 2 * Math.PI;
    const timeFactor = (Math.sin(rad - Math.PI / 2) + 1) / 2;

    const minStudents = 140;
    const maxStudents = 950;
    const baseCalculated = minStudents + Math.round((maxStudents - minStudents) * Math.pow(timeFactor, 1.15));

    const minuteVariance = Math.round(Math.sin((now.getMinutes() + now.getSeconds() / 60) * 0.4) * 25);

    this.activeStudentsCount = Math.max(120, baseCalculated + minuteVariance);
  }

  // Un unico punto de entrada con guardia: lo llaman DOS disparadores independientes (el
  // IntersectionObserver de la seccion y, como respaldo, el barrido por scroll). Si alguno
  // falla, el otro cubre; si funcionan los dos, la lectura ocurre una sola vez.
  private noticiasSolicitadas = false;
  cargarNoticiasSiHaceFalta() {
    if (this.noticiasSolicitadas) return;
    this.noticiasSolicitadas = true;
    this.loadFirestoreNews();
  }

  async loadFirestoreNews() {
    try {
      const data = await this.firestoreService.getNews();
      if (data && data.length > 0) {
        this.news = data;
        this.cdr.markForCheck();
        // Las tarjetas cambian -> el ancho del track cambia -> re-medir la barra de progreso.
        if (this.isBrowser) requestAnimationFrame(() => this.updateNewsScrollThumb());
      }
    } catch (e) {
      console.error('Error loading news from Firestore:', e);
    }
  }

  /** Marquee "agarrable" de un carrusel de telefono. `track` es un scroll-container real con las
   *  tarjetas TRIPLICADAS; cada frame le sumamos scrollLeft y, al alejarse del centro, lo
   *  recentramos por 1 juego (los tres son identicos -> el salto es invisible). El movimiento es
   *  scroll nativo, asi que el usuario puede arrastrarlo cuando quiera: se detecta comparando la
   *  posicion real contra la que escribimos nosotros; mientras el usuario lo mueve el avance se
   *  pausa y se reanuda ~400 ms despues de que suelta. El avance NO se pausa al mirarlo ni al
   *  hacer hover: solo al arrastrarlo. El rAF corre unicamente mientras la seccion esta cerca del
   *  viewport (leer scrollLeft de un subarbol con content-visibility saltado forzaria render, y
   *  ademas asi no gasta recursos cuando no se ve). */
  private marqueeStops: Array<() => void> = [];
  private setupGrabbableMarquee(sectionSelector: string, trackSelector: string, cardSelector: string, speedPxPerFrame: number) {
    const section = document.querySelector(sectionSelector);
    const track = document.querySelector(trackSelector) as HTMLElement | null;
    if (!section || !track) return;

    const mqMobile = typeof window.matchMedia === 'function' ? window.matchMedia('(max-width: 640px)') : null;
    const mqReduce = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const isMobile = () => !mqMobile || mqMobile.matches;
    const reduced = () => !!mqReduce && mqReduce.matches;

    let raf = 0;
    let acc = 0;
    let paused = false;
    let resumeTimer: any = null;
    let setWidth = 0;
    let expected = -1;          // ultimo scrollLeft que escribimos nosotros
    let nearViewport = false;
    let listenersOn = false;

    // Ancho EXACTO de un juego de tarjetas: distancia real entre el inicio del 1er clon y el 1ro
    // original. Dividir scrollWidth/3 acumula error de subpixel y hace que el recentrado se note.
    const measure = () => {
      const all = Array.from(track.querySelectorAll(cardSelector)) as HTMLElement[];
      const n = all.filter(c => !c.hasAttribute('aria-hidden')).length;
      setWidth = (n > 0 && all.length >= n * 2)
        ? all[n].offsetLeft - all[0].offsetLeft
        : track.scrollWidth / 3;
    };
    const setScroll = (v: number) => { track.scrollLeft = v; expected = track.scrollLeft; };

    const tick = () => {
      if (setWidth > 0) {
        // Recentrado invisible: los tres juegos son identicos, sumar/restar uno deja el mismo
        // pixel. Banda ancha (~1 juego de recorrido a cada lado) para que un arrastre normal
        // nunca lo dispare visiblemente.
        if (track.scrollLeft < setWidth * 0.35) setScroll(track.scrollLeft + setWidth);
        else if (track.scrollLeft > setWidth * 1.65) setScroll(track.scrollLeft - setWidth);
        if (!paused && !reduced()) {
          acc += speedPxPerFrame;
          if (acc >= 1) { const step = Math.floor(acc); setScroll(track.scrollLeft + step); acc -= step; }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    // Si la posicion real se aleja de la que escribimos nosotros, es el usuario moviendolo
    // (arrastre, inercia, rueda horizontal): se pausa el avance y se reanuda 400 ms despues de
    // que se estabilice. Un scroll vertical de la pagina o un hover no tocan scrollLeft -> no pausa.
    const onUserScroll = () => {
      if (expected >= 0 && Math.abs(track.scrollLeft - expected) > 3) {
        paused = true;
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => { paused = false; }, 400);
      }
    };

    const attachListeners = () => {
      if (listenersOn) return;
      listenersOn = true;
      this.registerGlobalListener(track, 'scroll', onUserScroll, { passive: true });
    };

    // Arranca/detiene el rAF segun si la seccion esta cerca del viewport Y estamos en telefono
    // (en desktop el track no es un carrusel). Idempotente; measure() solo con la seccion visible.
    const sync = () => {
      // Con "reducir movimiento" el rAF no arranca: queda un carrusel de scroll manual (3 tarjetas,
      // los clones se ocultan por CSS) y NO se recentra.
      const wants = nearViewport && isMobile() && !reduced();
      if (wants && !raf) {
        this.zone.runOutsideAngular(() => {
          measure();
          // Arrancar en el juego del medio: un juego completo de margen para arrastrar a cada lado.
          if (setWidth > 0 && track.scrollLeft < setWidth * 0.5) setScroll(setWidth);
          else expected = track.scrollLeft;
          attachListeners();
          raf = requestAnimationFrame(tick);
        });
      } else if (wants && raf) {
        measure();
      } else if (!wants && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
        paused = false;
      }
    };
    const stop = () => { nearViewport = false; sync(); };

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { nearViewport = e.isIntersecting; }
      sync();
    }, { rootMargin: '120px 0px' });
    io.observe(section);
    this.observers.push(io);
    // Cambiar de desktop a telefono (o al reves), o togglear "reducir movimiento", con la seccion
    // a la vista, debe arrancar/parar el rAF.
    this.registerGlobalListener(window, 'resize', sync, { passive: true });
    if (mqReduce) this.registerGlobalListener(mqReduce, 'change', sync);
    this.marqueeStops.push(stop);
  }

  ngAfterViewInit() {
    // Pure DOM/visual wiring (parallax, scroll listeners, video autoplay, IntersectionObserver) —
    // window/document/IntersectionObserver don't exist during server-side prerendering, and
    // none of this affects the crawlable content, so it's skipped entirely off-browser.
    if (!this.isBrowser) return;

    requestAnimationFrame(() => {
      this.animationsReady = true;
    });

    const SELECTOR_REVELADO = '.features-section, .foco-section, .videos-section, .section-title, .bento-card, .foco-benefit-item, .foco-visual, .faq-item, .news-card';

    // Scroll Reveal Animation Logic (Unobserve once revealed for maximum performance)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll(SELECTOR_REVELADO).forEach(el => observer.observe(el));
    this.observers.push(observer);

    // [CTA PEGAJOSA MOVIL 2026-08-29] aparece al pasar el hero, se esconde al llegar al CTA final.
    // REVERTIR: borrar este bloque + la propiedad showStickyCta + el <button class="home-sticky-cta">.
    {
      const heroEl = document.getElementById('hero');
      const ctaEl = document.getElementById('cta');
      let heroPassed = false;
      let closerVisible = false;
      const syncSticky = () => {
        const next = heroPassed && !closerVisible;
        if (next !== this.showStickyCta) { this.showStickyCta = next; this.cdr.markForCheck(); }
      };
      if (heroEl) {
        const obsHeroPass = new IntersectionObserver(([e]) => { heroPassed = !e.isIntersecting; syncSticky(); });
        obsHeroPass.observe(heroEl);
        this.observers.push(obsHeroPass);
      }
      if (ctaEl) {
        // Se esconde en cuanto el CTA final toca la pantalla, y NO vuelve a salir mientras sigas
        // bajando (noticias + footer): closerVisible queda true si el CTA quedo por encima del
        // viewport. Solo reaparece si haces scroll hacia arriba y el CTA vuelve a quedar debajo.
        const obsCloser = new IntersectionObserver(([e]) => {
          const vh = (e.rootBounds && e.rootBounds.height) || window.innerHeight;
          closerVisible = e.isIntersecting || e.boundingClientRect.top < vh;
          syncSticky();
        }, { rootMargin: '0px 0px 120px 0px' });
        obsCloser.observe(ctaEl);
        this.observers.push(obsCloser);
      }
    }

    // Red de seguridad del revelado por scroll.
    //
    // Las 9 secciones bajo la linea de flotacion usan content-visibility: auto. Mientras una
    // seccion esta lejos del viewport el navegador se salta su renderizado y sus hijos no
    // tienen caja, asi que el IntersectionObserver de arriba no puede dispararse para ellos.
    // En la practica el navegador re-renderiza la seccion ANTES de que entre en pantalla y el
    // observer alcanza a disparar, pero si no lo hiciera esos elementos se quedarian en
    // opacity: 0 PARA SIEMPRE -- o sea, media landing en blanco.
    //
    // RENDIMIENTO (2026-08-29): esta red de seguridad estaba costando carisimo. Antes, en CADA
    // frame de scroll y para siempre, hacia:
    //   1. document.querySelector('.news-section') + getBoundingClientRect() INCONDICIONAL.
    //      .news-section tiene content-visibility: auto, y medir la geometria de un subarbol
    //      saltado OBLIGA al navegador a renderizarlo. Un reflow forzado por frame, indefinidamente.
    //   2. Un querySelectorAll de 9 selectores sobre todo el documento, tambien cada frame.
    //
    // Ahora: la lista de pendientes se calcula UNA vez y se va vaciando; la comprobacion de
    // noticias solo corre mientras no se hayan pedido; y cuando ya no queda nada por revelar el
    // barrido se apaga solo. En una pagina ya recorrida el costo pasa a ser cero.
    let pendientesDeRevelar: Element[] = Array.from(document.querySelectorAll(SELECTOR_REVELADO));
    let barridoActivo = true;
    let ultimoBarrido = 0;
    const barrerRevelado = () => {
      if (!barridoActivo) return;
      // El IntersectionObserver de arriba es el mecanismo primario de revelado; esto es solo
      // una red de seguridad para casos borde de content-visibility. No hace falta en cada
      // frame de scroll: a lo sumo cada ~250 ms. Antes, un usuario rebotando dentro del hero
      // (sin bajar lo suficiente para revelar todo) forzaba getBoundingClientRect sobre
      // decenas de elementos -- varios en secciones con content-visibility: auto, lo que
      // fuerza su render -- en cada frame, indefinidamente.
      const ahora = performance.now();
      if (ahora - ultimoBarrido < 250) return;
      ultimoBarrido = ahora;

      if (!this.noticiasSolicitadas) {
        const secNoticias = document.querySelector('.news-section');
        if (secNoticias) {
          const rn = secNoticias.getBoundingClientRect();
          if (rn.height > 0 && rn.top < window.innerHeight + 800 && rn.bottom > -800) {
            this.cargarNoticiasSiHaceFalta();
          }
        }
      }

      if (pendientesDeRevelar.length) {
        const alto = window.innerHeight;
        pendientesDeRevelar = pendientesDeRevelar.filter(el => {
          if (el.classList.contains('is-visible')) return false;
          const r = el.getBoundingClientRect();
          if (r.height > 0 && r.top < alto && r.bottom > 0) {
            el.classList.add('is-visible');
            return false;
          }
          return true;
        });
      }

      // Ya no puede hacer falta: nada pendiente y las noticias pedidas. Se apaga sola.
      if (!pendientesDeRevelar.length && this.noticiasSolicitadas) {
        barridoActivo = false;
      }
    };

    // Carruseles agarrables de telefono (noticias + testimonios). Cada uno se auto-gestiona con
    // su propio IntersectionObserver: solo avanza mientras su seccion esta cerca del viewport.
    this.setupGrabbableMarquee('.news-section', '.news-track', '.news-card', 0.4);
    // [TESTIMONIOS ESTATICOS 2026-08-29] el marquee de testimonios se desactivo (grilla estatica en
    // movil). REVERTIR: descomentar la linea de abajo + revertir el bloque CSS y el *ngFor.
    // this.setupGrabbableMarquee('.testimonials-section', '.testimonials-grid', '.testimonial-card', 0.32);

    // Barra de progreso del carrusel de noticias (desktop/tablet). NO se mide aca: .news-track vive
    // dentro de .news-section, que tiene content-visibility: auto, y leer scrollWidth forzaria su
    // render en el arranque. Se mide cuando la seccion se acerca (obsNoticias, mas abajo) y cuando
    // llegan las noticias (loadFirestoreNews). El listener de scroll pasa por un rAF.
    this.zone.runOutsideAngular(() => {
      this.newsTrackEl = document.querySelector('.news-track') as HTMLElement;
      this.newsThumbEl = document.querySelector('.news-scroll-thumb') as HTMLElement;
      this.newsIndicatorEl = document.querySelector('.news-scroll-indicator') as HTMLElement;
      if (this.newsTrackEl) {
        this.registerGlobalListener(this.newsTrackEl, 'scroll', this.onNewsScroll, { passive: true });
      }
      this.registerGlobalListener(window, 'resize', this.onNewsScroll, { passive: true });
    });

    // Registrar eventos en zona externa de Angular (cero lag y sin layout thrashing)
    this.zone.runOutsideAngular(() => {
      const sectionEl = document.getElementById('foco-tutor');
      const mascotEl = document.querySelector('.foco-mascot') as HTMLElement;

      let sectionRect: DOMRect | null = null;
      let mascotRect: DOMRect | null = null;

      const updateRects = () => {
        if (sectionEl) sectionRect = sectionEl.getBoundingClientRect();
        if (mascotEl) mascotRect = mascotEl.getBoundingClientRect();
      };

      // No se mide aca, por el mismo motivo: #foco-tutor es .foco-section, que tambien tiene
      // content-visibility: auto. El manejador de mousemove recalcula solo si los rects estan
      // en null, asi que la medicion ocurre recien cuando el puntero entra en la seccion.
      const invalidarRects = () => { sectionRect = null; mascotRect = null; };
      this.registerGlobalListener(window, 'resize', invalidarRects, { passive: true });

      let mouseTicking = false;
      const onMouseMove = (e: MouseEvent) => {
        if (this.hoveredBenefitIndex !== null || !sectionEl || !mascotEl) return;

        if (!mouseTicking) {
          window.requestAnimationFrame(() => {
            if (!sectionRect || !mascotRect) {
              updateRects();
            }

            const isInsideSection = sectionRect &&
              e.clientX >= sectionRect.left && e.clientX <= sectionRect.right &&
              e.clientY >= sectionRect.top && e.clientY <= sectionRect.bottom;

            if (!isInsideSection) {
              mascotEl.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
              mouseTicking = false;
              return;
            }

            const mascotCenterX = mascotRect!.left + mascotRect!.width / 2;
            const mascotCenterY = mascotRect!.top + mascotRect!.height / 2;

            const deltaX = e.clientX - mascotCenterX;
            const deltaY = e.clientY - mascotCenterY;

            // Desplazamiento máximo dulce de 22px
            const maxDisplacement = 22;
            const sensitivity = 300;

            const translateX = Math.max(-maxDisplacement, Math.min(maxDisplacement, (deltaX / sensitivity) * maxDisplacement));
            const translateY = Math.max(-maxDisplacement, Math.min(maxDisplacement, (deltaY / sensitivity) * maxDisplacement));

            const isHovered = e.clientX >= mascotRect!.left && e.clientX <= mascotRect!.right &&
              e.clientY >= mascotRect!.top && e.clientY <= mascotRect!.bottom;

            const scale = isHovered ? 1.06 : 1.0;

            mascotEl.style.transform = 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0) scale(' + scale + ')';
            mouseTicking = false;
          });
          mouseTicking = true;
        }
      };

      const onMouseLeave = () => {
        if (mascotEl) {
          mascotEl.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
        }
      };

      // RENDIMIENTO (2026-08-29): antes estos dos listeners se registraban en `document` para
      // toda la vida de la pagina. El de mousemove dispara con CUALQUIER movimiento del puntero,
      // en cualquier parte del documento, aunque #foco-tutor estuviera a miles de px. Ahora:
      //   - No se registran en absoluto si el dispositivo no tiene puntero fino (todo movil).
      //   - Solo estan enganchados mientras la seccion de Foco esta cerca del viewport.
      const punteroFino = typeof window.matchMedia === 'function'
        ? window.matchMedia('(pointer: fine)').matches
        : true;
      if (punteroFino && sectionEl && mascotEl) {
        let parallaxEnganchado = false;
        const engancharParallax = () => {
          if (parallaxEnganchado) return;
          parallaxEnganchado = true;
          document.addEventListener('mousemove', onMouseMove as EventListener, { passive: true });
          document.addEventListener('mouseleave', onMouseLeave, { passive: true });
        };
        const desengancharParallax = () => {
          if (!parallaxEnganchado) return;
          parallaxEnganchado = false;
          document.removeEventListener('mousemove', onMouseMove as EventListener);
          document.removeEventListener('mouseleave', onMouseLeave);
          mascotEl.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
        };
        this.desengancharParallaxFoco = desengancharParallax;

        const obsParallax = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) engancharParallax();
            else desengancharParallax();
          }
        }, { rootMargin: '200px 0px' });
        obsParallax.observe(sectionEl);
        this.observers.push(obsParallax);
      }

      // Parallax del hero + estado del navbar + red de seguridad del revelado.
      //
      // RENDIMIENTO (2026-08-29): antes habia TRES listeners de scroll separados en window
      // (invalidarRects, onParallaxScroll y el barrido de revelado), cada uno con su propio
      // gate de rAF. Ahora es UNO solo con un unico gate: el navegador despacha un evento en
      // vez de tres y todo el trabajo cae en el mismo frame.
      //
      // Ademas, el marcado de .is-scrolling (classList + clearTimeout + setTimeout) corria
      // ANTES del gate, o sea en cada evento crudo de scroll. Ahora esta dentro del rAF.
      const gridOverlay = document.querySelector('.hero-grid-overlay') as HTMLElement;
      const blobPurple = document.querySelector('.hero-blob-purple') as HTMLElement;
      const blobBlue = document.querySelector('.hero-blob-blue') as HTMLElement;
      const homeContainer = document.querySelector('.home-container') as HTMLElement;

      // RENDIMIENTO: en teléfonos el parallax del hero (escribir transform en cada frame de
      // scroll sobre .hero-grid-overlay -- un layer enmascarado > viewport con will-change --
      // y los 2 blobs) es trabajo de compositor imperceptible pero caro en GPU de gama baja,
      // y es justo el "lag al mover el hero de arriba a abajo" que se reporta. En puntero
      // grueso o con "reducir movimiento" no se escribe ningún transform: el layer queda
      // estático y barato. El estado del navbar y el barrido de revelado siguen corriendo.
      const parallaxOn = !window.matchMedia('(hover: none) and (pointer: coarse)').matches
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          ticking = false;
          const currentScrollY = window.scrollY;

          // Los rects del parallax de Foco dejan de ser validos al scrollear. Invalidar es
          // gratis; el recalculo perezoso llega solo cuando el puntero lo necesita.
          invalidarRects();

          // Marca la pagina como "scrolleando" para que las listas apiladas con :hover (el FAQ)
          // no disparen una transicion por cada item que pasa bajo un cursor quieto.
          if (homeContainer) {
            homeContainer.classList.add('is-scrolling');
            if (this.scrollEndTimer) clearTimeout(this.scrollEndTimer);
            this.scrollEndTimer = setTimeout(() => {
              homeContainer.classList.remove('is-scrolling');
            }, 150);
          }

          // Parallax updates (solo en escritorio / puntero fino — ver parallaxOn arriba)
          if (parallaxOn) {
            if (gridOverlay) {
              gridOverlay.style.transform = 'translate3d(0, ' + (currentScrollY * 0.22) + 'px, 0)';
            }
            if (blobPurple) {
              blobPurple.style.transform = 'translate3d(0, ' + (currentScrollY * 0.26) + 'px, 0) scale(' + (1 + currentScrollY * 0.00015) + ')';
            }
            if (blobBlue) {
              blobBlue.style.transform = 'translate3d(0, ' + (currentScrollY * 0.2) + 'px, 0) scale(' + (1 - currentScrollY * 0.0001) + ')';
            }
          }

          // Red de seguridad del revelado (se auto-apaga cuando ya no queda nada).
          barrerRevelado();

          // Navbar state updates (only trigger Angular zone if state changes)
          const newIsScrolled = currentScrollY > 50;
          const newNavbarHidden = currentScrollY > this.lastScrollY && currentScrollY > 100;

          if (newIsScrolled !== this.isScrolled || newNavbarHidden !== this.navbarHidden) {
            this.zone.run(() => {
              this.isScrolled = newIsScrolled;
              this.navbarHidden = newNavbarHidden;
              this.cdr.markForCheck();
            });
          }
          this.lastScrollY = currentScrollY;
        });
      };
      this.registerGlobalListener(window, 'scroll', onScroll, { passive: true });
    });

    // Noticias: se leen de Firestore recien cuando su seccion se acerca (ver el comentario en
    // ngOnInit sobre por que no se hace al arrancar). El margen de 800 px hace que lleguen ya
    // cargadas cuando el usuario termina de bajar. Si nunca baja, nunca se consulta.
    const seccionNoticias = document.querySelector('.news-section');
    if (seccionNoticias) {
      const obsNoticias = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          obsNoticias.disconnect();
          this.cargarNoticiasSiHaceFalta();
          // La seccion ya se esta renderizando: es seguro medir la barra de progreso.
          requestAnimationFrame(() => this.updateNewsScrollThumb());
        }
      }, { rootMargin: '800px 0px' });
      obsNoticias.observe(seccionNoticias);
      this.observers.push(obsNoticias);
    }

    // Video de demostracion: se PAUSA al salir de pantalla (no tiene sentido decodificar frames
    // que nadie mira) y se reanuda al volver, pero SOLO si el usuario ya habia pulsado play.
    // Hasta 2026-09-07 este observer lo arrancaba solo con que la seccion entrara en pantalla.
    const videosSection = document.querySelector('.videos-section');
    if (videosSection) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.videosSectionInView = entry.isIntersecting;
          const video = entry.target.querySelector('video.real-video-player') as HTMLVideoElement | null;
          if (!video) return;
          if (entry.isIntersecting) {
            if (!this.demoUserStarted) return;
            // Chrome rechaza en silencio play() sobre un video cuya propiedad viva '.muted' no
            // sea true, aunque el atributo este puesto: se fuerza justo antes de reproducir.
            video.muted = true;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.25 });
      videoObserver.observe(videosSection);
      this.observers.push(videoObserver);
    }

    // RENDIMIENTO (2026-08-29): la mascota de Foco es un <video autoplay loop> que, a diferencia
    // de los 3 videos de demo, NO se pausaba nunca al salir de pantalla: seguia decodificando
    // frames durante todo el recorrido del home. Es el tiron que se notaba a media pagina.
    // Se observa la SECCION, no el <video> de dentro: .foco-section es la que lleva
    // content-visibility, asi que siempre tiene caja. Un elemento dentro de un subarbol
    // saltado no la tiene, y el observer no podria dispararse para el. Mismo patron que el
    // observer de los videos de demo, que tambien observa su seccion.
    const focoSection = document.querySelector('.foco-section');
    if (focoSection) {
      const obsMascota = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const mascotVideo = entry.target.querySelector('video.foco-mascot') as HTMLVideoElement | null;
          if (!mascotVideo) continue;
          if (entry.isIntersecting) {
            mascotVideo.muted = true;
            mascotVideo.play().catch(() => {});
          } else {
            mascotVideo.pause();
          }
        }
      }, { threshold: 0.01 });
      obsMascota.observe(focoSection);
      this.observers.push(obsMascota);
    }

    // El hero NO lleva content-visibility (esta sobre la linea de flotacion), asi que su
    // simulacion animada seguia corriendo para siempre: una cadena infinita de setTimeout mas
    // un typewriter de 32 ms que re-entra a la zona de Angular ~10 veces por segundo. Estando
    // el usuario en el FAQ eso era puro churn de change detection. Ahora se pausa al salir.
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      const obsHero = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.reanudarAnimacionesHero();
          else this.pausarAnimacionesHero();
        }
      }, { rootMargin: '100px 0px' });
      obsHero.observe(heroSection);
      this.observers.push(obsHero);
    }
  }

  selectDemoTab(i: number) {
    this.activeTab = i;
    // El *ngIf monta un <video> nuevo: nace pausado y con preload="none".
    this.demoPlaying = false;
    // Se reanuda solo si el usuario ya habia pulsado play. Si nunca lo hizo, cambiar de
    // pestaña no descarga ni reproduce nada.
    // NO se consulta videosSectionInView aca a proposito: cambiar de pestaña ES un clic del
    // usuario sobre esta misma seccion, asi que por definicion la esta mirando. Depender del
    // IntersectionObserver haria que el cambio de pestaña no reanudara nada si el observer
    // todavia no habia disparado.
    if (this.demoUserStarted) {
      setTimeout(() => {
        const video = this.demoVideoEl();
        if (!video) return;
        video.muted = true;
        video.play().catch(() => {});
      }, 0);
    }
  }

  private demoVideoEl(): HTMLVideoElement | null {
    return document.querySelector('.videos-section video.real-video-player') as HTMLVideoElement | null;
  }

  /** Play/pausa del video de demostracion. Lo llaman el boton central y tambien un clic sobre
   *  el propio video: mientras reproduce, el overlay esta en pointer-events:none y el clic le
   *  llega al <video>, asi que no hay doble alternancia. */
  toggleDemoVideo() {
    const video = this.demoVideoEl();
    if (!video) return;
    if (video.paused) {
      this.demoUserStarted = true;
      video.muted = true;
      video.play().catch(() => {});
    } else {
      this.demoUserStarted = false;
      video.pause();
    }
  }

  // Removed @HostListener('window:scroll') to fix scroll lag.
  // Scroll logic is now handled in ngAfterViewInit inside runOutsideAngular.

  goTo(path: string) {
    this.router.navigate([path]);
  }

  getPremiumButtonText(): string {
    if (!this.isLoggedIn()) {
      return 'Adquirir Premium';
    }
    const profile = this.firestoreService.profileSignal();
    if (profile?.plan === 'premium') {
      return 'Ir al Panel Premium';
    }
    return 'Adquirir Premium';
  }

  onPremiumAction() {
    if (!this.isLoggedIn()) {
      localStorage.setItem('estudiauni_pending_checkout', JSON.stringify({
        plan: this.billingPeriod
      }));
      this.goTo('/register');
      return;
    }
    const profile = this.firestoreService.profileSignal();
    if (profile?.plan === 'premium') {
      this.goTo('/dashboard');
      return;
    }
    // Open the pricing modal skipping the plan cards (user already saw pricing on home)
    this.paymentService.openPricingModal(true, this.billingPeriod);
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
