import { Component, inject, HostListener, AfterViewInit, signal, computed, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- NAVBAR GLASSMORPHISM -->
    <nav class="navbar" [class.scrolled]="isScrolled" [class.navbar-hidden]="navbarHidden">
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
      <!-- DYNAMIC BACKGROUND -->
      <div class="dynamic-bg">
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
          <!-- LEFT COLUMN: Main title, subtitle, CTAs, Benefits & Social Proof -->
          <div class="hero-left-content">
            <div class="hero-badge-tag">
              <span class="sparkle-icon">✨</span> Tu tutor de IA para la PAES
            </div>

            <h1 class="hero-title">
              Prepárate para la <span class="text-gradient">PAES</span> con<br>
              <span class="ai-robotic-text" [class.ai-sparkle-flash]="heroSimStep === 4" data-text="Inteligencia Artificial">Inteligencia Artificial</span>
            </h1>

            <p class="hero-subtitle">
              Ensaya como en la prueba real. Nuestra IA detecta tus errores, te explica cada respuesta y crea un plan de estudio personalizado para mejorar tu puntaje.
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

            <!-- MODERN BENEFITS BAR (Replaces stats) -->
            <div class="hero-benefits-bar">
              <div class="benefit-chip">
                <div class="chip-icon">🎯</div>
                <div class="chip-info">
                  <strong>Adaptativo</strong>
                  <span>La IA crea tu plan de estudio</span>
                </div>
              </div>
              <div class="benefit-chip">
                <div class="chip-icon">⚡</div>
                <div class="chip-info">
                  <strong>En tiempo real</strong>
                  <span>Explicaciones al instante mientras ensayas</span>
                </div>
              </div>
              <div class="benefit-chip">
                <div class="chip-icon">🛡️</div>
                <div class="chip-info">
                  <strong>100% enfocado</strong>
                  <span>Solo contenido oficial PAES</span>
                </div>
              </div>
            </div>

            <!-- COMPACT SOCIAL PROOF ROW -->
            <div class="hero-social-proof">
              <div class="avatar-stack">
                <img src="assets/img/seccion opiniones/1.jpg" alt="Estudiante EstudiaUni" loading="lazy" decoding="async">
                <img src="assets/img/seccion opiniones/2.png" alt="Estudiante EstudiaUni" loading="lazy" decoding="async">
                <img src="assets/img/seccion opiniones/3.webp" alt="Estudiante EstudiaUni" loading="lazy" decoding="async">
              </div>
              <div class="proof-text">
                <div class="star-rating">⭐⭐⭐⭐⭐</div>
                <span>Únete a miles de estudiantes que ya están mejorando sus puntajes con IA</span>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Enhanced Live SaaS Interactive Simulation Card -->
          <div class="hero-right-preview">
            <div class="hero-sim-card glass-card">
              <!-- Top bar header -->
              <div class="sim-card-header">
                <div class="sim-header-left">
                  <span class="sim-badge-live"><span class="live-dot"></span> ENSAYO PAES</span>
                  <span class="sim-subject-pill">{{ currentSimExercise.subject }}</span>
                </div>
                <div class="sim-header-right">
                  <span class="sim-timer">⏱️ {{ currentSimExercise.timer }}</span>
                  <span class="sim-q-num">{{ currentSimExercise.questionNum }}</span>
                </div>
              </div>

              <!-- Progress bar -->
              <div class="sim-progress-bar-wrap">
                <div class="sim-progress-bar-fill" [style.width]="currentSimExercise.progress"></div>
              </div>

              <!-- Question Box -->
              <div class="sim-question-box">
                <p class="sim-q-text">{{ currentSimExercise.text }}</p>

                <!-- Options -->
                <div class="sim-options-list">
                  <div 
                    *ngFor="let opt of currentSimExercise.options; let idx = index" 
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
                      <li *ngFor="let st of currentSimExercise.strengths">✓ {{ st }}</li>
                    </ul>
                  </div>

                  <div class="side-block">
                    <span class="side-title color-warning">A reforzar</span>
                    <ul class="tag-list warning">
                      <li *ngFor="let wk of currentSimExercise.weaknesses">⚠️ {{ wk }}</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- FEATURES BENTO BOX -->
      <section id="features" class="features-section">
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
              <div class="bento-icon">🗺️</div>
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
              <div class="bento-icon">📝</div>
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
              <div class="bento-icon">🎯</div>
              <h3>Práctica Adaptativa</h3>
              <p>Nuestro algoritmo inteligente analiza tus respuestas y genera nuevas preguntas enfocadas exactamente en las áreas que necesitas reforzar.</p>
            </div>

            <!-- Small Card 2 -->
            <div class="bento-card glass-card">
              <div class="bento-icon">📈</div>
              <h3>Visualiza tu Progreso</h3>
              <p>Mide tu avance diario e identifica áreas de mejora al instante.</p>
            </div>
            
            <!-- Small Card 3 -->
            <div class="bento-card glass-card">
              <div class="bento-icon">🎓</div>
              <h3>Explora tu Futuro</h3>
              <p>Descubre universidades y carreras según tu ubicación e intereses.</p>
            </div>

            <!-- Small Card 4 -->
            <div class="bento-card glass-card">
              <div class="bento-icon">⚡</div>
              <h3>Acceso Inmediato</h3>
              <p>Comienza gratis hoy. Sin ingresar tarjeta de crédito.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FOCO AI TUTOR SECTION -->
      <section id="foco-tutor" class="foco-section">
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

                <img src="assets/img/gif.gif" alt="Foco el Pulpo" class="foco-mascot" (click)="onFocoClick()" loading="lazy" decoding="async">
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
                <div class="benefit-icon-wrapper"><span class="benefit-icon">💡</span></div>
                <div class="benefit-text">
                  <strong>Resuelve Dudas Al Instante:</strong> Hazle consultas sobre Álgebra o Lenguaje y te explica paso a paso, 24/7.
                </div>
              </div>
              
              <div class="foco-benefit-item delay-2" (mouseenter)="onBenefitHover(1)" (mouseleave)="onBenefitLeave()">
                <div class="benefit-icon-wrapper"><span class="benefit-icon">🎯</span></div>
                <div class="benefit-text">
                  <strong>Identifica Puntos Débiles:</strong> Analiza tus errores y te sugiere mini-quizzes personalizados para mejorar rápido.
                </div>
              </div>
              
              <div class="foco-benefit-item delay-3" (mouseenter)="onBenefitHover(2)" (mouseleave)="onBenefitLeave()">
                <div class="benefit-icon-wrapper"><span class="benefit-icon">🚀</span></div>
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
          <div class="tabs-buttons">
            <button class="tab-btn" [class.active]="activeTab === 0" (click)="activeTab = 0">
              <span class="tab-number">1</span> Ruta de aprendizaje
              <div class="active-indicator"></div>
            </button>
            <button class="tab-btn" [class.active]="activeTab === 1" (click)="activeTab = 1">
              <span class="tab-number">2</span> Ensayos PAES
              <div class="active-indicator"></div>
            </button>
            <button class="tab-btn" [class.active]="activeTab === 2" (click)="activeTab = 2">
              <span class="tab-number">3</span> Consulta al tutor IA
              <div class="active-indicator"></div>
            </button>
          </div>
          
          <div class="tab-content">
            <!-- Tab 1: Ruta de aprendizaje -->
            <div *ngIf="activeTab === 0" class="tab-pane fade-in">
              <div class="tab-visual tab-dashboard-wrapper">
                <!-- Premium Glassmorphic Video Player Placeholder -->
                <video 
                  src="assets/videos/rutaDeAprendizajeTest.mp4" 
                  autoplay 
                  loop 
                  muted 
                  playsinline 
                  preload="metadata"
                  class="real-video-player"
                  style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);"
                ></video>
              </div>
            </div>
            
            <!-- Tab 2: Ensayos PAES -->
            <div *ngIf="activeTab === 1" class="tab-pane fade-in">
              <div class="tab-visual tab-exam-wrapper">
                <!-- Premium Glassmorphic Video Player Placeholder -->
                <div class="mock-video-player">
                  <div class="video-play-btn">
                    <span class="play-arrow">▶</span>
                  </div>
                  <div class="video-controls-overlay">
                    <div class="controls-left">
                      <span class="control-icon">⏸</span>
                      <span class="control-time">01:20 / 03:00</span>
                    </div>
                    <div class="controls-timeline">
                      <div class="timeline-track">
                        <div class="timeline-fill" style="width: 44%"></div>
                        <div class="timeline-handle" style="left: 44%"></div>
                      </div>
                    </div>
                    <div class="controls-right">
                      <span class="control-icon">🔊</span>
                      <span class="control-icon">⚙️</span>
                      <span class="control-icon">⛶</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tab 3: Consulta al tutor IA -->
            <div *ngIf="activeTab === 2" class="tab-pane fade-in">
              <div class="tab-visual tab-chat-wrapper">
                <!-- Premium Glassmorphic Video Player Placeholder -->
                <div class="mock-video-player">
                  <div class="video-play-btn">
                    <span class="play-arrow">▶</span>
                  </div>
                  <div class="video-controls-overlay">
                    <div class="controls-left">
                      <span class="control-icon">⏸</span>
                      <span class="control-time">00:15 / 01:45</span>
                    </div>
                    <div class="controls-timeline">
                      <div class="timeline-track">
                        <div class="timeline-fill" style="width: 14%"></div>
                        <div class="timeline-handle" style="left: 14%"></div>
                      </div>
                    </div>
                    <div class="controls-right">
                      <span class="control-icon">🔊</span>
                      <span class="control-icon">⚙️</span>
                      <span class="control-icon">⛶</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <radialGradient id="nebula-left-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#855cd6" stop-opacity="0.22" />
                <stop offset="60%" stop-color="#855cd6" stop-opacity="0.05" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="nebula-center-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#d946ef" stop-opacity="0.25" />
                <stop offset="60%" stop-color="#d946ef" stop-opacity="0.06" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="nebula-right-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.22" />
                <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.05" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
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
              
              <filter id="glow-blur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="30" />
              </filter>
            </defs>
            
            <!-- Nebulosas Reactivas de Fondo (Se encienden al hacer hover en las tarjetas) -->
            <circle class="nebula-glow nebula-left" cx="200" cy="250" r="180" fill="url(#nebula-left-grad)" filter="url(#glow-blur)" />
            <circle class="nebula-glow nebula-center" cx="600" cy="270" r="220" fill="url(#nebula-center-grad)" filter="url(#glow-blur)" />
            <circle class="nebula-glow nebula-right" cx="1000" cy="250" r="180" fill="url(#nebula-right-grad)" filter="url(#glow-blur)" />

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
          <!-- Tarjeta 1: Mati -->
          <div class="testimonial-card testimonial-card-1">
            <div class="testimonial-header">
              <div class="testimonial-avatar">
                <img src="assets/img/seccion opiniones/1.jpg" alt="Estudiante Mati" loading="lazy" decoding="async">
              </div>
              <div class="testimonial-info">
                <div class="name-row">
                  <h4>Mati</h4>
                  <!-- Icono verificado verificado en azul -->
                  <svg class="verify-icon" viewBox="0 0 24 24" fill="currentColor" title="Estudiante Verificado">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p>Aspirante a Ing. Civil</p>
              </div>
            </div>
            
            <!-- Estrellas SVG doradas de alta calidad -->
            <div class="testimonial-stars">
              <svg *ngFor="let s of [1,2,3,4,5]" class="star-icon" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#f59e0b"/>
              </svg>
            </div>
            
            <p class="testimonial-text">"La página está bacán, de verdad te salva. El tutor IA es brígido porque te explica al toque por qué te equivocaste en medio del ensayo, no tienes que andar buscando en Google o viendo videos largos que burren. Apaña caleta para entender todo."</p>
          </div>

          <!-- Tarjeta 2: ValeRojas -->
          <div class="testimonial-card featured testimonial-card-2">
            <div class="testimonial-header">
              <div class="testimonial-avatar">
                <img src="assets/img/seccion opiniones/2.png" alt="Estudiante ValeRojas" loading="lazy" decoding="async">
              </div>
              <div class="testimonial-info">
                <div class="name-row">
                  <h4>ValeRojas</h4>
                  <svg class="verify-icon" viewBox="0 0 24 24" fill="currentColor" title="Estudiante Verificada">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p>Futura estudiante de Psicología</p>
              </div>
            </div>
            
            <div class="testimonial-stars">
              <svg *ngFor="let s of [1,2,3,4,5]" class="star-icon" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#f59e0b"/>
              </svg>
            </div>
            
            <p class="testimonial-text">"Me costaba sentarme a estudiar, pero acá con los simulacros interactivos se hace cero pesado. La página cacha altiro lo que te cuesta y te hace repasar eso. Me pasé al premium hace una semana y vale 100% la pena."</p>
          </div>

          <!-- Tarjeta 3: Seba -->
          <div class="testimonial-card testimonial-card-3">
            <div class="testimonial-header">
              <div class="testimonial-avatar">
                <img src="assets/img/seccion opiniones/3.webp" alt="Estudiante Seba" loading="lazy" decoding="async">
              </div>
              <div class="testimonial-info">
                <div class="name-row">
                  <h4>Seba</h4>
                  <svg class="verify-icon" viewBox="0 0 24 24" fill="currentColor" title="Estudiante Verificado">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p>Aspirante a Derecho</p>
              </div>
            </div>
            
            <div class="testimonial-stars">
              <svg *ngFor="let s of [1,2,3,4,5]" class="star-icon" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#f59e0b"/>
              </svg>
            </div>
            
            <p class="testimonial-text">"Está filete la plataforma. Lo que más me gusta es que puedo hacer los miniquizzes y configurarlo como yo quiera y los mininjuegos son adictivos, recomiendo la pagina a todos los que les cueste estudiar como yo jaja."</p>
          </div>
        </div>
      </section>

      <!-- PRICING SECTION -->
      <section id="pricing" class="pricing-section section-fade pricing-fade" [class.yearly-active]="billingPeriod === 'yearly'">
        <!-- Lienzo SVG de Fondo Dinámico e Innovador -->
        <div class="pricing-flow-bg">
          <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
               <!-- Filtro de Difuminado de Alta Fidelidad para Bordes Suaves -->
               <filter id="pricing-studio-blur" x="-50%" y="-50%" width="200%" height="200%">
                 <feGaussianBlur stdDeviation="75" />
               </filter>

               <!-- Nebulosas Reactivas Vibrantes -->
               <radialGradient id="nebula-basic" cx="25%" cy="50%" r="35%">
                 <stop offset="0%" stop-color="#10b981" stop-opacity="0.45"/>
                 <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.3"/>
                 <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
               </radialGradient>
               <radialGradient id="nebula-premium" cx="75%" cy="50%" r="40%">
                 <stop offset="0%" stop-color="#855cd6" stop-opacity="0.55"/>
                 <stop offset="50%" stop-color="#f472b6" stop-opacity="0.35"/>
                 <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
               </radialGradient>

               <!-- Nebulosa Dorada de Ahorro Anual -->
               <radialGradient id="nebula-yearly" cx="50%" cy="50%" r="40%">
                 <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.6"/>
                 <stop offset="55%" stop-color="#d97706" stop-opacity="0.3"/>
                 <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
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
             <circle class="pricing-nebula basic-nebula" cx="360" cy="300" r="300" fill="url(#nebula-basic)" filter="url(#pricing-studio-blur)" />
             <circle class="pricing-nebula premium-nebula" cx="1080" cy="300" r="350" fill="url(#nebula-premium)" filter="url(#pricing-studio-blur)" />
             
             <!-- Nebulosa Dorada Reactiva Anual -->
             <circle class="pricing-nebula yearly-nebula" cx="720" cy="300" r="380" fill="url(#nebula-yearly)" filter="url(#pricing-studio-blur)" />

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
        
        <!-- Toggle Anual/Mensual Interactivo -->
        <div class="billing-toggle-container">
          <button class="billing-btn" [class.active]="billingPeriod === 'monthly'" (click)="billingPeriod = 'monthly'">
            Mensual
          </button>
          <div class="billing-switch" (click)="billingPeriod = billingPeriod === 'monthly' ? 'yearly' : 'monthly'">
            <div class="billing-switch-handle" [style.transform]="billingPeriod === 'yearly' ? 'translateX(32px)' : 'translateX(0px)'"></div>
          </div>
          <button class="billing-btn" [class.active]="billingPeriod === 'yearly'" (click)="billingPeriod = 'yearly'">
            Anual <span class="discount-pill">¡Ahorra 41%!</span>
          </button>
        </div>

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

      <!-- NEWS SECTION -->
      <section id="news" class="news-section section-fade news-fade">
        <div class="news-bg-decor"></div>
        <h2 class="section-title">Actualidad y <span class="text-gradient">Noticias PAES</span></h2>
        <p class="section-subtitle-custom">Mantente al tanto de las últimas novedades oficiales del DEMRE y consejos clave para tu postulación.</p>
        
        <div class="news-carousel-container">
          <button class="carousel-control prev" (click)="scrollNews('left')" aria-label="Noticia anterior">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div class="news-track">
            <div class="news-card glass-card" *ngFor="let item of news">
              <div class="news-header-img">
                <div class="news-img-skeleton" *ngIf="!item.isLoaded"></div>
                <img [src]="item.imageUrl" (load)="item.isLoaded = true" [class.loaded]="item.isLoaded" alt="Portada de la noticia" class="news-cover-img" loading="lazy" decoding="async" />
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
                <a [href]="item.linkUrl" target="_blank" class="news-link">
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
      </section>

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
              
              <filter id="faq-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <!-- Slow Floating Nebulas (Dynamic Morphing Backgrounds) -->
            <circle class="faq-nebula nebula-1" cx="250" cy="300" r="280" fill="url(#faq-nebula-left)" />
            <circle class="faq-nebula nebula-2" cx="1190" cy="320" r="260" fill="url(#faq-nebula-right)" />

            <!-- Subtly dotted technological orbits centering the container -->
            <circle cx="720" cy="300" r="420" stroke="rgba(133, 92, 214, 0.08)" stroke-width="1.2" stroke-dasharray="6 8" class="faq-orbit-1" />
            <circle cx="720" cy="300" r="540" stroke="rgba(59, 130, 246, 0.06)" stroke-width="1" stroke-dasharray="10 12" class="faq-orbit-2" />

            <!-- Glowing Technical Node Satellites -->
            <circle cx="340" cy="180" r="5" fill="#855cd6" filter="url(#faq-glow-filter)" class="faq-satellite sat-1" />
            <circle cx="1120" cy="420" r="5" fill="#3b82f6" filter="url(#faq-glow-filter)" class="faq-satellite sat-2" />
            
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
          <div class="faq-item glass-card" *ngFor="let faq of faqs; let i = index" [class.active]="openFaq === i">
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

      <!-- FINAL CTA -->
      <section id="cta" class="cta-section section-fade cta-fade">
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
              <a routerLink="/trabaja-con-nosotros" style="cursor: pointer; margin-top: 0.25rem;">Trabaja con nosotros ↗</a>
            </div>
            
            <div class="footer-col">
              <h4>Recursos</h4>
              <a href="https://demre.cl/" target="_blank" rel="noopener" style="cursor: pointer;">Portal Oficial DEMRE ↗</a>
              <a href="https://demre.cl/publicaciones/" target="_blank" rel="noopener" style="cursor: pointer;">Temarios Oficiales PAES ↗</a>
              <a href="https://demre.cl/universidades/" target="_blank" rel="noopener" style="cursor: pointer;">Guía de Universidades ↗</a>
              <a href="https://portal.beneficiosestudiantiles.cl/" target="_blank" rel="noopener" style="cursor: pointer;">Beneficios Estudiantiles ↗</a>
            </div>
            
            <div class="footer-col">
              <h4>Soporte y Legal</h4>
              <a routerLink="/soporte" style="cursor: pointer;">Soporte de Usuario y Contacto ↗</a>
              <a style="cursor: pointer;" (click)="scrollTo('faq')">Preguntas Frecuentes </a>
              <a style="cursor: pointer;" (click)="showLegalModal = true; legalModalType = 'terms'">Términos de Servicio </a>
              <a style="cursor: pointer;" (click)="showLegalModal = true; legalModalType = 'privacy'">Política de Privacidad </a>
            </div>
          </div>
          
          <div class="footer-bottom">
            <div class="footer-bottom-left">
              <p>© 2026 EstudiaUni. Todos los derechos reservados.</p>
            </div>
            <div class="footer-bottom-right">
              <a style="cursor: pointer;" (click)="scrollToTop()">Inicio →</a>
              <span class="separator">•</span>
              <a style="cursor: pointer;" (click)="scrollTo('pricing')">Planes →</a>
              <span class="separator">•</span>
              <a routerLink="/soporte">Soporte →</a>
            </div>
          </div>
        </div>
      </footer>

      <!-- LEGAL MODAL -->
      <div class="legal-modal-overlay" *ngIf="showLegalModal" (click)="showLegalModal = false">
        <div class="legal-modal-content" (click)="$event.stopPropagation()">
          <div class="legal-modal-header">
            <h3>{{ legalModalType === 'terms' ? 'Términos de Servicio' : 'Política de Privacidad' }}</h3>
            <button class="close-btn" (click)="showLegalModal = false">✕</button>
          </div>
          <div class="legal-modal-body" *ngIf="legalModalType === 'terms'">
            <h4>Te damos la bienvenida a EstudiaUni</h4>
            <p>El uso y acceso a nuestro sitio web implica que estás de acuerdo con la totalidad de estas normas y directrices. Te sugerimos que las leas con atención antes de empezar a estudiar con nosotros. En caso de no estar de acuerdo con algún punto, te invitamos a no hacer uso de la plataforma.</p>

            <h4>I. ¿En qué consiste nuestra plataforma?</h4>
            <p>EstudiaUni es un entorno virtual de aprendizaje cuyo propósito es acompañar a los postulantes chilenos en su camino hacia la rendición de la PAES. Al interior de la plataforma encontrarás ensayos dinámicos, material de apoyo, métricas de rendimiento y nuestro Tutor basado en IA operativo las 24 horas del día. Toda esta oferta está estructurada como un recurso de apoyo y refuerzo, alineado con los contenidos estipulados por el DEMRE.</p>

            <h4>II. Enfoque y propósito de nuestros materiales</h4>
            <p>Cualquier recurso presente en EstudiaUni —incluyendo ejercicios, correcciones y las guías del asistente inteligente— cumple una función formativa y de orientación. No podemos asegurar un rendimiento determinado en la prueba oficial u otras mediciones. Por ello, instamos a nuestra comunidad a utilizar nuestros recursos como un complemento al estudio formal y a revisar las comunicaciones oficiales emitidas por las autoridades pertinentes.</p>

            <h4>III. Uso de nuestro asistente virtual (Foco)</h4>
            <p>Nuestro Tutor IA (conocido como Foco) es un complemento digital ideado para acompañarte en tu aprendizaje. A través de tecnología avanzada, busca resolver dudas y hacer más digeribles los temas de estudio. No obstante, como cualquier herramienta artificial, sus sugerencias deben interpretarse como una guía y no como verdades absolutas, siendo ideal contrastar datos clave con fuentes académicas u oficiales.</p>

            <h4>IV. Planes, cobros y facturación</h4>
            <p>EstudiaUni cuenta con diversas modalidades de suscripción que se detallan en el portal principal. Al optar por un plan, das tu consentimiento para que se efectúen los cargos respectivos. Los ciclos de cobro son automáticos hasta que decidas anular el servicio. Todas las transacciones se manejan mediante procesadores seguros, los cuales intentarán realizar cobros nuevamente si ocurre algún error. Eventuales modificaciones en nuestras tarifas no alterarán el ciclo que ya tienes en curso.</p>

            <h4>V. Cómo dar de baja tu plan</h4>
            <p>Tienes la libertad de detener tu suscripción en cualquier instante desde el menú de configuración de tu perfil. Al hacerlo, seguirás disfrutando de los beneficios adquiridos hasta que termine el periodo de tiempo que ya abonaste. Cabe destacar que la cancelación no conlleva la devolución del dinero por los días o meses restantes de tu ciclo actual.</p>

            <h4>VI. Tu perfil y responsabilidad de acceso</h4>
            <p>Es indispensable que la información que utilices al crear tu perfil sea real y exacta. Tu cuenta es estrictamente individual e intransferible, por lo que recae en ti la obligación de mantener tus datos de ingreso en privado. EstudiaUni se reserva la facultad de bloquear o inhabilitar perfiles si se detecta un uso fraudulento o compartido de los mismos.</p>

            <h4>VII. Derechos de autor y uso del material</h4>
            <p>Absolutamente todos los recursos que conforman EstudiaUni son propiedad nuestra o de nuestros aliados y están amparados por la legislación vigente de derechos de autor. Al ser usuario, recibes un permiso individual y limitado para estudiar con este material, quedando totalmente restringida cualquier forma de copia, distribución, o explotación con motivos comerciales.</p>

            <h4>VIII. Reglas de uso y alcances de nuestra responsabilidad</h4>
            <p>Al unirte a EstudiaUni, te obligas a darle un uso puramente académico al sitio y a evitar acciones que alteren su correcto funcionamiento. El servicio se entrega "en el estado en que se encuentra" y, si bien procuramos su excelencia, no prometemos que sea infalible o ininterrumpido. No asumiremos daños colaterales que deriven de tus decisiones de estudio, y mantenemos el derecho a actualizar este reglamento cuando sea oportuno.</p>
          </div>
          <div class="legal-modal-body" *ngIf="legalModalType === 'privacy'">
            <h4>I. ¿Qué datos recolectamos?</h4>
            <p>A lo largo de tu experiencia en EstudiaUni, guardamos detalles fundamentales como tu nombre e email al momento de inscribirte. Igualmente, registramos la actividad que tienes en la plataforma: resultados de simulacros, evolución de tu aprendizaje, charlas con nuestro asistente de IA y demás parámetros sobre tu desempeño general.</p>

            <h4>II. ¿Para qué usamos tu información?</h4>
            <p>Todos estos datos tienen un fin claro: entregar un servicio educativo más eficiente. Esto nos permite adaptar el plan de estudios a tus necesidades, hacer que el Tutor responda de forma más precisa, gestionar tus pagos de suscripción y mantenerte informado sobre mejoras, anuncios de la plataforma o cambios relevantes en tu cuenta.</p>

            <h4>III. ¿Cómo resguardamos tus datos?</h4>
            <p>Aplicamos sistemas de seguridad tecnológica y de organización reconocidos a nivel global para impedir que agentes externos accedan, modifiquen o destruyan tu información. Tus claves de acceso se encriptan y los datos de pago jamás se alojan directamente con nosotros, ya que usamos servicios de cobro externos de alta seguridad.</p>

            <h4>IV. Políticas respecto a terceros</h4>
            <p>La confidencialidad es prioridad para EstudiaUni. En ningún caso comercializamos o cedemos tus registros personales a otras compañías para que hagan publicidad. Las únicas instancias en las que compartimos datos se limitan a necesidades técnicas operativas (como procesar tu pago) o en situaciones donde la ley o alguna autoridad competente nos lo exija expresamente.</p>

            <h4>V. Rastreo y uso de cookies</h4>
            <p>Nuestra web se apoya en cookies y herramientas parecidas para mantenerte conectado sin pedirte la clave a cada rato, recordar tus elecciones visuales y analizar el comportamiento de la comunidad con el fin de mejorar el diseño del sitio. Tienes la potestad de bloquear las cookies desde tu navegador, aunque esto puede provocar que la plataforma no rinda al 100%.</p>

            <h4>VI. Control y derechos sobre tu perfil</h4>
            <p>Cuentas con total libertad para revisar, enmendar o exigir la eliminación definitiva de tu huella de datos en nuestra plataforma. Podrás realizar buena parte de estos ajustes directamente en tu panel de configuración. Para gestiones más complejas sobre tu privacidad, siempre tendrás a disposición nuestro equipo de atención al estudiante.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    
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
    .blob {
      position: absolute;
      filter: blur(90px);
      border-radius: 50%;
      opacity: 0.5;
      animation: morph-blob 20s infinite alternate ease-in-out;
      will-change: transform;
      transform: translateZ(0);
      backface-visibility: hidden;
    }
    .blob-purple {
      width: 50vw;
      height: 50vw;
      background: rgba(133, 92, 214, 0.4);
      top: -20vh;
      left: -10vw;
    }
    .blob-blue {
      width: 40vw;
      height: 40vw;
      background: rgba(59, 130, 246, 0.3);
      bottom: -10vh;
      right: -10vw;
      animation-delay: -5s;
    }
    .blob-yellow {
      width: 30vw;
      height: 30vw;
      background: rgba(251, 191, 36, 0.25);
      top: 30vh;
      left: 60vw;
      animation-delay: -10s;
    }
    @keyframes morph-blob {
      0% { transform: translate3d(0, 0, 0) scale(1); }
      33% { transform: translate3d(8vw, -8vh, 0) scale(1.1); }
      66% { transform: translate3d(-5vw, 5vh, 0) scale(0.9); }
      100% { transform: translate3d(0, 0, 0) scale(1); }
    }


    .home-container {
      background: transparent;
      width: 100% !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
      position: relative;
    }

    /* ===== VARIABLES & BASE ===== */
    .home-container { min-height: 100vh; }
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
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* ===== NAVBAR ===== */
    .navbar {
      position: fixed;
      top: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 1000px;
      z-index: 1000;
      padding: 0.6rem 1.5rem;
      transition: transform 0.5s cubic-bezier(0.33, 1, 0.68, 1), background-color 0.4s ease, border-color 0.4s ease, padding 0.4s ease, top 0.4s ease, box-shadow 0.4s ease;
      background: rgba(255, 255, 255, 0.72); /* Glassmorphism premium equilibrado */
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 999px;
      border: 1px solid rgba(133, 92, 214, 0.16); /* Borde sutil de marca */
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
      top: 1rem;
      padding: 0.5rem 1.5rem;
      background: rgba(255, 255, 255, 0.88); /* Transición armónica y sutil en scroll, sin saltos de color */
      border-color: rgba(133, 92, 214, 0.22);
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
    /* Botón principal en navbar */
    .navbar .btn-primary {
      padding: 0.6rem 1.2rem;
      font-size: 0.95rem;
      border-radius: 999px;
      transition: all 0.3s ease;
    }
    .navbar .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(133, 92, 214, 0.4);
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
    .hero-glow-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(130px);
      opacity: 0.55;
      will-change: transform;
    }
    .hero-blob-purple {
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(133, 92, 214, 0.48) 0%, rgba(133, 92, 214, 0) 70%);
      top: -150px;
      left: -150px;
      animation: pulse-slow 8s ease-in-out infinite alternate;
    }
    .hero-blob-blue {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0) 70%);
      top: 220px;
      right: -100px;
      animation: pulse-slow 12s ease-in-out infinite alternate-reverse;
    }
    .floating-symbol {
      position: absolute;
      font-family: var(--font-heading);
      font-weight: 300;
      color: var(--accent-primary);
      opacity: 0.02;
      will-change: opacity, filter;
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
    @keyframes pulse-slow {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.12); opacity: 0.65; }
    }
    @keyframes symbol-fade-pulse-1 {
      0%, 100% { opacity: 0.02; filter: blur(3px); }
      50% { opacity: 0.30; filter: blur(0px); }
    }
    @keyframes symbol-fade-pulse-2 {
      0%, 100% { opacity: 0.02; filter: blur(3px); }
      50% { opacity: 0.24; filter: blur(0px); }
    }
    @keyframes symbol-fade-pulse-3 {
      0%, 100% { opacity: 0.02; filter: blur(3px); }
      50% { opacity: 0.28; filter: blur(0px); }
    }
    @keyframes symbol-fade-pulse-4 {
      0%, 100% { opacity: 0.02; filter: blur(3px); }
      50% { opacity: 0.26; filter: blur(0px); }
    }

    .hero-section {
      position: relative;
      z-index: 1;
      width: 100%;
      padding-top: 9rem;
      padding-bottom: 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    
    .hero-grid {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 3rem;
      align-items: center;
      width: 100%;
      max-width: 1240px;
      padding: 0 2rem;
      position: relative;
      z-index: 10;
    }

    .hero-badge-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(133, 92, 214, 0.08);
      border: 1px solid rgba(133, 92, 214, 0.22);
      color: #855cd6;
      font-size: 0.82rem;
      font-weight: 700;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      margin-bottom: 1.25rem;
      backdrop-filter: blur(10px);
    }
    .sparkle-icon {
      font-size: 0.95rem;
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
      gap: 1rem;
      margin-bottom: 2rem;
    }

    /* ===== MODERN BENEFITS BAR ===== */
    .hero-benefits-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      width: 100%;
      background: rgba(255, 255, 255, 0.75);
      border: 1px solid rgba(133, 92, 214, 0.16);
      border-radius: 16px;
      padding: 0.85rem 1rem;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
      margin-bottom: 1.5rem;
    }
    .benefit-chip {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .chip-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
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

    /* ===== SOCIAL PROOF ROW ===== */
    .hero-social-proof {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.2rem 0;
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
    .proof-text span {
      font-size: 0.78rem;
      color: #4b5563;
      font-weight: 600;
    }

    /* ===== SIMULATION CARD ENHANCEMENTS ===== */
    .sim-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.65rem;
    }
    .sim-badge-live {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #059669;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      letter-spacing: 0.04em;
    }
    .sim-subject-pill {
      background: rgba(133, 92, 214, 0.08);
      border: 1px solid rgba(133, 92, 214, 0.2);
      color: #855cd6;
      font-size: 0.76rem;
      font-weight: 700;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
    }
    .sim-header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.78rem;
      color: #6b7280;
      font-weight: 600;
    }

    .sim-progress-bar-wrap {
      width: 100%;
      height: 5px;
      background: #f3f4f6;
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 0.9rem;
    }
    .sim-progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #855cd6, #3b82f6);
      border-radius: 999px;
      transition: width 0.6s ease;
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
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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

    /* THE DOME */
    .hero-stats {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 5rem;
      margin-top: 2rem;
      margin-bottom: 5rem;
      padding: 0 2rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s ease;
    }
    .hero-stats.is-visible .stat-item {
      opacity: 1;
      transform: translateY(0);
    }
    .hero-stats.is-visible .stat-item:nth-child(1) { transition-delay: 0.1s; }
    .hero-stats.is-visible .stat-item:nth-child(2) { transition-delay: 0.3s; }
    .hero-stats.is-visible .stat-item:nth-child(3) { transition-delay: 0.5s; }

    .stat-icon {
      width: 60px;
      height: 60px;
      background: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      border: 2px solid rgba(0, 0, 0, 0.05);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      animation: stat-float 4s ease-in-out infinite;
    }
    
    .stat-item:nth-child(2) .stat-icon { animation-delay: 1.3s; }
    .stat-item:nth-child(3) .stat-icon { animation-delay: 2.6s; }
    
    @keyframes stat-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .stat-text {
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .stat-number {
      font-size: 1.8rem;
      font-weight: 800;
      color: #111827;
      line-height: 1;
      letter-spacing: -0.02em;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
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
      stroke-dashoffset: 0;
      animation: circuit-pulse 10s linear infinite;
    }
    .path-delay-1 { animation-delay: 0s; }
    .path-delay-2 { animation-delay: 3s; animation-duration: 12s; }
    .path-delay-3 { animation-delay: 1.5s; animation-duration: 8s; }
    .path-delay-4 { animation-delay: 4.5s; animation-duration: 11s; }

    @keyframes circuit-pulse {
      0% { stroke-dashoffset: 260; }
      100% { stroke-dashoffset: -260; }
    }

    .node-glow {
      animation: node-glow-pulse 2s ease-in-out infinite alternate;
      transform-origin: center;
    }

    @keyframes node-glow-pulse {
      0% { r: 5px; opacity: 0.15; }
      100% { r: 11px; opacity: 0.45; }
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
      padding: 8rem 0;
      position: relative;
      overflow: hidden;
      background: linear-gradient(to bottom, #ffffff 0%, rgba(133, 92, 214, 0.03) 25%, rgba(255, 255, 255, 0.95) 75%, #ffffff 100%);
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
      filter: drop-shadow(0 2px 5px rgba(133, 92, 214, 0.15));
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
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
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
      0% { box-shadow: 0 20px 45px rgba(133, 92, 214, 0.08); }
      100% { box-shadow: 0 20px 45px rgba(133, 92, 214, 0.18), 0 0 15px rgba(133, 92, 214, 0.15); }
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
      font-style: italic;
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
      background: linear-gradient(to bottom, #ffffff 0%, rgba(133, 92, 214, 0.04) 30%, rgba(255, 255, 255, 0.95) 70%, #ffffff 100%);
      transition: background 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    /* Estado Dorado de Ahorro Anual Activo */
    .pricing-section.yearly-active {
      background: linear-gradient(to bottom, #ffffff 0%, rgba(245, 158, 11, 0.07) 30%, rgba(255, 255, 255, 0.95) 70%, #ffffff 100%);
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
      transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: center;
      opacity: 0.45;
    }
    .basic-nebula { transform-origin: 360px 300px; }
    .premium-nebula { transform-origin: 1080px 300px; }
    
    .yearly-nebula {
      transform-origin: 720px 300px;
      opacity: 0;
      transform: scale(0.6);
    }

    /* Mostrar Nebulosa Dorada y atenuar básicas cuando Anual está activo */
    .pricing-section.yearly-active .yearly-nebula {
      opacity: 0.95;
      transform: scale(1.1);
    }
    .pricing-section.yearly-active .basic-nebula,
    .pricing-section.yearly-active .premium-nebula {
      opacity: 0.12;
    }

    /* Modern CSS :has Selector for high-fidelity pricing interactions */
    .pricing-section:not(.yearly-active):has(.basic-card:hover) .basic-nebula {
      opacity: 0.96;
      transform: scale(1.35);
    }
    .pricing-section:not(.yearly-active):has(.premium-card:hover) .premium-nebula {
      opacity: 0.98;
      transform: scale(1.35);
    }

    /* Constellation Dynamic Orbits */
    .pricing-orbit {
      transform-origin: 720px 300px;
      animation: spin-pricing-orbit 40s linear infinite;
      transition: stroke 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .orbit-outer {
      animation-duration: 60s;
      animation-direction: reverse;
    }
    
    /* Cambiar órbitas a dorado en modo anual */
    .pricing-section.yearly-active .pricing-orbit {
      stroke: rgba(245, 158, 11, 0.15) !important;
    }
    .pricing-section.yearly-active .orbit-inner {
      stroke: rgba(245, 158, 11, 0.25) !important;
    }

    @keyframes spin-pricing-orbit {
      100% { transform: rotate(360deg); }
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
    
    /* Toggle Anual/Mensual */
    .billing-toggle-container {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      background: rgba(133, 92, 214, 0.05);
      border: 1px solid rgba(133, 92, 214, 0.1);
      padding: 0.4rem;
      border-radius: 99px;
      margin-bottom: 2.2rem;
      position: relative;
      z-index: 5;
    }
    .billing-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 700;
      padding: 0.5rem 1.2rem;
      cursor: pointer;
      border-radius: 99px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .billing-btn.active {
      color: white;
      background: var(--accent-primary);
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.3);
      transition: background 1.2s ease, box-shadow 1.2s ease;
    }
    
    /* Active Button en modo anual */
    .pricing-section.yearly-active .billing-btn.active {
      background: linear-gradient(135deg, #f59e0b, #d97706) !important;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.45) !important;
    }

    .billing-switch {
      width: 58px;
      height: 28px;
      background: rgba(133, 92, 214, 0.15);
      border-radius: 99px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease, background 1.2s ease;
    }
    
    /* Switch en modo anual */
    .pricing-section.yearly-active .billing-switch {
      background: rgba(245, 158, 11, 0.25) !important;
    }
    .billing-switch-handle {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .discount-pill {
      font-size: 0.72rem;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 0.15rem 0.5rem;
      border-radius: 99px;
      font-weight: 800;
      animation: gold-pulse 2s infinite ease-in-out;
    }
    @keyframes gold-pulse {
      0% { transform: scale(1); opacity: 0.95; }
      50% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1); opacity: 0.95; }
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2.2rem;
      max-width: 820px;
      margin: 0 auto;
      align-items: stretch;
      position: relative;
      z-index: 5;
    }
    .pricing-card {
      padding: 1.8rem 1.6rem;
      border-radius: 24px;
      text-align: left;
      position: relative;
      border: 1px solid rgba(133, 92, 214, 0.08);
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: 0 15px 35px rgba(133, 92, 214, 0.01);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
      transition: border-color 1.2s ease, box-shadow 1.2s ease;
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
    /* Nebulosas del fondo FAQ */
    .faq-nebula {
      animation: faq-nebula-morph 25s infinite alternate ease-in-out;
      will-change: transform, opacity;
      transform-origin: center;
    }
    .faq-nebula.nebula-2 {
      animation-delay: -8s;
    }
    @keyframes faq-nebula-morph {
      0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
      50% { transform: translate(-30px, 40px) scale(1.15); opacity: 1; }
      100% { transform: translate(40px, -20px) scale(0.9); opacity: 0.8; }
    }
    /* Rotación de órbitas técnicas */
    .faq-orbit-1 {
      animation: faq-spin-clockwise 80s linear infinite;
      transform-origin: 720px 300px;
      will-change: transform;
    }
    .faq-orbit-2 {
      animation: faq-spin-counter 100s linear infinite;
      transform-origin: 720px 300px;
      will-change: transform;
    }
    @keyframes faq-spin-clockwise {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes faq-spin-counter {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    /* Satélites de red neuronal */
    .faq-satellite {
      animation: faq-sat-pulse 4s infinite ease-in-out alternate;
      transform-origin: center;
      will-change: transform, opacity;
    }
    .faq-satellite.sat-2 {
      animation-delay: -2s;
    }
    @keyframes faq-sat-pulse {
      0% { opacity: 0.3; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1.2); }
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
    .faq-item {
      overflow: hidden;
      background: white;
      border: 2px solid #cbd5e1;
      border-radius: var(--border-radius);
      transition: all 0.3s ease;
    }
    .faq-item.glass-card {
      border: 2px solid #cbd5e1;
    }
    .faq-item:hover {
      border-color: rgba(133, 92, 214, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(133, 92, 214, 0.08);
    }
    .faq-question {
      width: 100%;
      text-align: left;
      padding: 1.5rem;
      background: none;
      border: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-family: var(--font-heading);
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .faq-icon {
      color: var(--accent-primary);
      transition: transform 0.3s ease;
      display: flex;
      flex-shrink: 0;
      margin-left: 1rem;
    }
    .faq-item.active .faq-icon {
      transform: rotate(180deg);
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
    .news-card {
      flex: 0 0 calc(33.333% - 1.34rem);
      min-width: 320px;
      scroll-snap-align: start;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 2px solid #cbd5e1;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .news-card.glass-card {
      border: 2px solid #cbd5e1;
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
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      font-weight: 600;
    }
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
    .bento-card, .testimonial-card, .pricing-card {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
        #ffffff 0%, 
        rgba(133, 92, 214, 0.05) 20%, 
        rgba(255, 255, 255, 0.95) 75%, 
        #ffffff 100%
      );
      transition: background 1.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .videos-section.theme-tab-0 {
      --theme-primary: #855cd6;
      --theme-glow: rgba(133, 92, 214, 0.15);
      --theme-accent: #3b82f6;
      background: linear-gradient(to bottom, 
        #ffffff 0%, 
        rgba(133, 92, 214, 0.05) 20%, 
        rgba(255, 255, 255, 0.95) 75%, 
        #ffffff 100%
      );
    }
    .videos-section.theme-tab-1 {
      --theme-primary: #06b6d4;
      --theme-glow: rgba(6, 182, 212, 0.15);
      --theme-accent: #1d4ed8;
      background: linear-gradient(to bottom, 
        #ffffff 0%, 
        rgba(6, 182, 212, 0.05) 20%, 
        rgba(255, 255, 255, 0.95) 75%, 
        #ffffff 100%
      );
    }
    .videos-section.theme-tab-2 {
      --theme-primary: #10b981;
      --theme-glow: rgba(16, 185, 129, 0.15);
      --theme-accent: #a855f7;
      background: linear-gradient(to bottom, 
        #ffffff 0%, 
        rgba(16, 185, 129, 0.05) 20%, 
        rgba(255, 255, 255, 0.95) 75%, 
        #ffffff 100%
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
    
    .videos-orbit-rotate-container {
      transform-origin: 740px 300px;
      animation: videos-slow-bg-rotate 140s linear infinite;
    }
    @keyframes videos-slow-bg-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .orb-group {
      opacity: 0;
      transition: opacity 1.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .orb-group.active {
      opacity: 1;
    }

    .flow-pulse-node {
      animation: flow-node-pulse 2.5s ease-in-out infinite alternate;
    }
    @keyframes flow-node-pulse {
      0% { r: 3px; opacity: 0.25; }
      100% { r: 8px; opacity: 0.65; }
    }

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
      max-width: 1200px;
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
      gap: 1.2rem;
    }
    .tab-btn {
      background: rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(8px);
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
      animation: active-tab-pulse 1.8s ease-in-out infinite alternate;
    }
    .tab-btn.active .tab-number {
      background: var(--theme-primary);
      color: white;
      box-shadow: 0 4px 12px var(--theme-glow);
    }
    
    @keyframes active-tab-pulse {
      0% {
        box-shadow: 0 15px 35px var(--theme-glow), 0 0 0px var(--theme-primary);
      }
      100% {
        box-shadow: 0 15px 35px var(--theme-glow), 0 0 16px var(--theme-primary);
      }
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
      flex: 1.8;
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
      min-height: 330px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 0;
      border: 2.5px solid var(--theme-primary);
      box-shadow: 0 25px 65px var(--theme-glow);
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .tab-dashboard-wrapper { background: linear-gradient(135deg, #fef3c7, #ffedd5); }
    .tab-exam-wrapper { background: linear-gradient(135deg, #e0e7ff, #ede9fe); }
    .tab-chat-wrapper { background: linear-gradient(135deg, #dcfce7, #dbeafe); }

    /* ===== MOCKUPS INTERACTIVOS PREMIUM ===== */
    
    /* 1. MOCKUP VIDEO PLAYER (PREHOLDER) */
    .mock-video-player {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(16px);
      border-radius: 27px;
      border: 1px solid rgba(255, 255, 255, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .mock-video-player:hover {
      background: rgba(255, 255, 255, 0.35);
      border-color: rgba(255, 255, 255, 0.55);
    }
    
    /* Botón Play central con doble aro y brillo continuo */
    .video-play-btn {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--theme-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 10px 25px var(--theme-glow);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      z-index: 5;
    }
    .video-play-btn::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2.5px solid var(--theme-primary);
      opacity: 0.5;
      animation: play-btn-ring-pulse 2s infinite linear;
    }
    @keyframes play-btn-ring-pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.18); opacity: 0; }
    }
    .play-arrow {
      font-size: 1.6rem;
      color: white;
      margin-left: 4px; /* Centrado visual exacto del triángulo */
      transition: transform 0.3s;
    }
    .mock-video-player:hover .video-play-btn {
      transform: scale(1.1);
      box-shadow: 0 15px 35px var(--theme-glow);
    }
    .mock-video-player:hover .play-arrow {
      transform: scale(1.08);
    }
    
    /* Barra de controles inferior glassmórfica */
    .video-controls-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(15, 15, 25, 0.7);
      backdrop-filter: blur(12px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.8rem 1.2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.2rem;
      z-index: 6;
      transform: translateY(0);
      transition: transform 0.3s ease;
    }
    .controls-left, .controls-right {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }
    .control-icon {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.85);
      cursor: pointer;
      transition: color 0.2s;
    }
    .control-icon:hover {
      color: var(--theme-primary);
    }
    .control-time {
      font-size: 0.75rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.6);
      font-family: monospace;
    }
    
    /* Timeline del reproductor de video */
    .controls-timeline {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .timeline-track {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 99px;
      position: relative;
      cursor: pointer;
    }
    .timeline-fill {
      height: 100%;
      background: var(--theme-primary);
      border-radius: 99px;
    }
    .timeline-handle {
      position: absolute;
      top: 50%;
      width: 10px;
      height: 10px;
      background: white;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      transition: transform 0.1s;
    }
    .timeline-track:hover .timeline-handle {
      transform: translate(-50%, -50%) scale(1.3);
    }
    
    @media (max-width: 900px) {
      .tabs-container { flex-direction: column; gap: 2rem; }
      .tab-btn.active { transform: translateY(0); }
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
      background-color: #ffffff;
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
    
    /* Animación de rotación de las líneas orbitales */
    .orbit-line-1 {
      animation: orbit-rotate-clockwise 25s linear infinite;
      transform-origin: 300px 300px;
    }
    .orbit-line-2 {
      animation: orbit-rotate-counter 35s linear infinite;
      transform-origin: 300px 300px;
    }
    .orbit-line-3 {
      animation: orbit-rotate-clockwise 50s linear infinite;
      transform-origin: 300px 300px;
    }

    @keyframes orbit-rotate-clockwise {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes orbit-rotate-counter {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
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
      backdrop-filter: blur(10px);
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
    
    .foco-mascot {
      width: 100%;
      height: auto;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 20px 40px rgba(133, 92, 214, 0.15));
      cursor: pointer;
      transition: transform 0.18s ease-out, filter 0.4s ease;
    }
    
    .foco-mascot:hover {
      filter: drop-shadow(0 25px 50px rgba(133, 92, 214, 0.4)) brightness(1.05);
    }
    
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
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(8px);
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
        text-align: center;
      }
      .foco-title { text-align: center; }
      .foco-benefit-item { text-align: left; }
      .foco-mascot-wrapper { max-width: 350px; margin: 0 auto; }
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
      .hero-social-proof {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .proof-text {
        align-items: center;
      }
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
        top: 0.75rem !important;
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
      .hero-section { padding-top: 6.5rem; overflow: hidden; }
      .hero-title { font-size: clamp(1.8rem, 6vw, 2.6rem); }
      .hero-subtitle { font-size: 1rem; }
      .hero-actions { flex-direction: column; width: 100%; max-width: 320px; margin: 0 auto; gap: 0.75rem; }
      .hero-actions .btn { width: 100%; justify-content: center; }
      .bento-grid { grid-template-columns: 1fr; }
      .bento-large { grid-column: span 1; }
      .pricing-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
      .section-title { font-size: 1.85rem; }

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
      .hero-stats { flex-direction: column; width: 100%; max-width: 300px; margin: 2rem auto 0; gap: 0.85rem; }
      .stat-item { width: 100%; justify-content: center; padding: 0.75rem 1.25rem; }
      .tabs-buttons {
        flex-wrap: nowrap;
        overflow-x: auto;
        width: 100%;
        padding-bottom: 0.5rem;
        justify-content: flex-start;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .tabs-buttons::-webkit-scrollbar { display: none; }
      .tab-btn { flex-shrink: 0; white-space: nowrap; font-size: 0.88rem; padding: 0.7rem 1.1rem; }
      .news-card { min-width: 85vw; max-width: 85vw; }
      .news-carousel-container { padding: 0 0.5rem; }
      .bento-card { padding: 1.5rem 1.25rem; }
      .roadmap-visual { flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
    }
    @media (max-width: 480px) {
      .navbar { padding: 0.45rem 0.75rem; }
      .nav-logo { font-size: 1.2rem; }
      .pricing-card { padding: 1.5rem 1.25rem; }
      .legal-modal-content { width: 95%; padding: 1.25rem; max-height: 85vh; }
      .legal-modal-header .close-btn { width: 44px; height: 44px; font-size: 1.3rem; }
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
    
    .non-clickable {
      pointer-events: none;
      cursor: default;
      opacity: 0.7;
    }

    /* ===== LEGAL MODAL ===== */
    .legal-modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      z-index: 10000;
    }
    .legal-modal-content {
      background: var(--bg-primary, #ffffff); border-radius: 16px;
      width: 90%; max-width: 600px; max-height: 80vh;
      overflow-y: auto; padding: 2rem;
      box-shadow: 0 25px 50px rgba(0,0,0,0.15);
      border: 1px solid var(--glass-border, rgba(133, 92, 214, 0.15));
    }
    .legal-modal-header {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid var(--glass-border, rgba(133, 92, 214, 0.15));
      padding-bottom: 1rem; margin-bottom: 1.5rem;
    }
    .legal-modal-header h3 { margin: 0; font-size: 1.5rem; background: var(--gradient-primary, linear-gradient(135deg, #855cd6 0%, #3b82f6 100%)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .legal-modal-header .close-btn { border: none; background: var(--bg-secondary, #f3f4f6); color: var(--text-secondary, #4b5563); width: 34px; height: 34px; border-radius: 10px; font-size: 1.1rem; cursor: pointer; display: grid; place-items: center; transition: all 0.2s; line-height: 1; }
    .legal-modal-header .close-btn:hover { background: rgba(239,68,68,0.25); color: #fca5a5 !important; }
    .legal-modal-body h4 { color: var(--text-primary, #111827); margin-top: 1.5rem; margin-bottom: 0.5rem; }
    .legal-modal-body p { color: var(--text-secondary, #4b5563); line-height: 1.6; font-size: 0.95rem; }
  `]
})
export class HomeComponent implements AfterViewInit, OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  public firestoreService = inject(FirestoreService);
  private paymentService = inject(PaymentService);
  private zone = inject(NgZone);

  isLoggedIn$ = this.authService.isLoggedIn$;
  user$ = this.authService.user$;

  // Use toSignal for easy access in template and expressions
  isLoggedIn = toSignal(this.isLoggedIn$, { initialValue: false });
  user = toSignal(this.user$, { initialValue: null });

  profileInitial = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.charAt(0).toUpperCase() || 'U';
  });

  activeTab = 0;
  billingPeriod: 'monthly' | 'yearly' = 'monthly';

  openFaq: number | null = null;
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
      imageUrl: 'assets/img/seccion noticias/noticia1.jpeg'
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
      imageUrl: 'assets/img/seccion noticias/noticia2.jpg'
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
      imageUrl: 'assets/img/seccion noticias/noticia3.webp'
    }
  ];

  scrollNews(direction: 'left' | 'right') {
    const container = document.querySelector('.news-track') as HTMLElement;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  count1 = 0;
  count2 = 0;
  count3 = 0;
  statsAnimated = false;
  isScrolled = false;
  mobileMenuOpen = false;
  animationsReady = false;
  currentTheme = 'theme-hero';
  navbarHidden = false;
  lastScrollY = 0;
  scrollOffset = 0;

  showLegalModal = false;
  legalModalType: 'terms' | 'privacy' = 'terms';

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

    setTimeout(() => {
      this.showFocoBubble = false;
    }, 5000);
  }


  animateCounters() {
    if (this.statsAnimated) return;
    this.statsAnimated = true;
    this.animateValue('count1', 0, 5000, 2000);
    this.animateValue('count2', 0, 1000, 2000);
    this.animateValue('count3', 0, 95, 2000);
  }

  animateValue(prop: string, start: number, end: number, duration: number) {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      (this as any)[prop] = Math.floor(easeProgress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Hero Live Interactive SaaS Simulation Dataset & State Machine
  heroSimExercises = [
    {
      subject: '✏️ Matemáticas',
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
      subject: '📖 Competencia Lectora',
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
      subject: '🧪 Ciencias - Química',
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

  get currentSimExercise() {
    return this.heroSimExercises[this.heroSimIndex];
  }

  startHeroSimulation() {
    this.runHeroSimCycle();
  }

  runHeroSimCycle() {
    this.heroSimStep = 0;
    this.heroSimTypedText = '';
    if (this.heroSimTypingTimer) clearInterval(this.heroSimTypingTimer);
    if (this.heroSimCycleTimer) clearTimeout(this.heroSimCycleTimer);

    // Step 1 (t = 2.2s): Select Option
    this.heroSimCycleTimer = setTimeout(() => {
      this.heroSimStep = 1;

      // Step 2 (t = 3.8s): Analyzing Response
      setTimeout(() => {
        this.heroSimStep = 2;

        // Step 3 (t = 5.2s): Start Typewriter
        setTimeout(() => {
          this.heroSimStep = 3;
          const fullText = this.currentSimExercise.explanation;
          let charIdx = 0;
          this.heroSimTypingTimer = setInterval(() => {
            if (charIdx < fullText.length) {
              this.heroSimTypedText += fullText.charAt(charIdx);
              charIdx++;
            } else {
              clearInterval(this.heroSimTypingTimer);
              // Step 4 (t = +1s): Show Concept Pill
              setTimeout(() => {
                this.heroSimStep = 4;

                // Step 5 (t = +3.2s): Transition to next exercise
                setTimeout(() => {
                  this.heroSimIndex = (this.heroSimIndex + 1) % this.heroSimExercises.length;
                  this.runHeroSimCycle();
                }, 3200);
              }, 900);
            }
          }, 32);
        }, 1500);
      }, 1600);
    }, 2200);
  }

  ngOnInit() {
    this.firestoreService.getUserProfile().subscribe();
    this.loadFirestoreNews();
    this.startHeroSimulation();
  }

  async loadFirestoreNews() {
    try {
      const data = await this.firestoreService.getNews();
      if (data && data.length > 0) {
        this.news = data;
      }
    } catch (e) {
      console.error('Error loading news from Firestore:', e);
    }
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.animationsReady = true;
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

      updateRects();
      window.addEventListener('resize', updateRects, { passive: true });
      window.addEventListener('scroll', updateRects, { passive: true });

      let mouseTicking = false;
      document.addEventListener('mousemove', (e: MouseEvent) => {
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

            mascotEl.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
            mouseTicking = false;
          });
          mouseTicking = true;
        }
      }, { passive: true });

      document.addEventListener('mouseleave', () => {
        if (mascotEl) {
          mascotEl.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
        }
      }, { passive: true });

      // Optimized scroll listener outside Angular zone to fix lag
      const gridOverlay = document.querySelector('.hero-grid-overlay') as HTMLElement;
      const blobPurple = document.querySelector('.hero-blob-purple') as HTMLElement;
      const blobBlue = document.querySelector('.hero-blob-blue') as HTMLElement;

      let ticking = false;
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (!ticking) {
          window.requestAnimationFrame(() => {
            // Parallax updates
            if (gridOverlay) {
              gridOverlay.style.transform = `translate3d(0, ${currentScrollY * 0.22}px, 0)`;
            }
            if (blobPurple) {
              blobPurple.style.transform = `translate3d(0, ${currentScrollY * 0.26}px, 0) scale(${1 + currentScrollY * 0.00015})`;
            }
            if (blobBlue) {
              blobBlue.style.transform = `translate3d(0, ${currentScrollY * 0.2}px, 0) scale(${1 - currentScrollY * 0.0001})`;
            }

            // Navbar state updates (only trigger Angular zone if state changes)
            const newIsScrolled = currentScrollY > 50;
            const newNavbarHidden = currentScrollY > this.lastScrollY && currentScrollY > 100;

            if (newIsScrolled !== this.isScrolled || newNavbarHidden !== this.navbarHidden) {
              this.zone.run(() => {
                this.isScrolled = newIsScrolled;
                this.navbarHidden = newNavbarHidden;
              });
            }
            this.lastScrollY = currentScrollY;
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    });

    // Scroll Reveal Animation Logic (Unobserve once revealed for maximum performance)
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (entry.target.classList.contains('hero-stats')) {
            this.animateCounters();
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.features-section, .foco-section, .videos-section, .section-title, .bento-card, .foco-benefit-item, .foco-visual, .hero-stats, .faq-item, .news-card');
    animatedElements.forEach(el => observer.observe(el));
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
