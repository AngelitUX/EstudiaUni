<template>
  <div class="landing-page">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    
    <header class="navbar">
      <div class="container nav-content">
        <div class="logo">
          <span class="text-gradient">EstudiaUni</span>.cl
        </div>
        <nav class="nav-links">
          <a href="#features">Características</a>
          <a href="#pricing">Planes</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div class="nav-actions">
          <a :href="loginUrl" class="btn btn-outline">Ingresar</a>
          <a :href="registerUrl" class="btn btn-primary">Comenzar Gratis</a>
        </div>
      </div>
    </header>

    <main>
      <!-- Hero Section -->
      <section class="hero container">
        <div class="hero-content animate-fade-in">
          <div class="badge">🚀 El futuro de la educación PAES</div>
          <h1>Prepara la PAES de forma <br><span class="text-gradient">inteligente y guiada</span></h1>
          <p class="subtitle">
            Aprende a tu propio ritmo. Nuestra IA analiza tu progreso, identifica tus puntos débiles y crea una ruta de aprendizaje única para ti. Sin sobrecargas.
          </p>
          <div class="hero-actions">
            <a :href="registerUrl" class="btn btn-primary hero-btn">Comenzar Ahora</a>
            <a href="#features" class="btn btn-outline hero-btn">Cómo funciona</a>
          </div>
        </div>
        <div class="hero-image animate-fade-in animate-float delay-1">
          <div class="glass-card mockup-card">
            <div class="mockup-header">
              <div class="dots"><span></span><span></span><span></span></div>
              <div class="title">Tu Progreso - EstudiaUni</div>
            </div>
            <div class="mockup-body">
              <div class="mockup-chart">
                <div class="bar" style="height: 40%"></div>
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar highlight" style="height: 95%"></div>
              </div>
              <div class="mockup-ai-feedback">
                <i>✨</i> "¡Excelente mejora en Álgebra! Te sugiero revisar Probabilidades a continuación."
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features container">
        <h2 class="section-title text-center animate-fade-in">Desbloquea tu potencial</h2>
        <div class="features-grid">
          <div class="glass-card feature-card animate-fade-in delay-1">
            <div class="feature-icon">🧠</div>
            <h3>Análisis de IA</h3>
            <p>Obtén explicaciones detalladas de tus errores y comprende exactamente qué falló y por qué.</p>
          </div>
          <div class="glass-card feature-card animate-fade-in delay-2">
            <div class="feature-icon">🛤️</div>
            <h3>Ruta Adaptativa</h3>
            <p>Desbloquea contenido automáticamente a medida que dominas los conceptos previos.</p>
          </div>
          <div class="glass-card feature-card animate-fade-in delay-3">
            <div class="feature-icon">⏱️</div>
            <h3>Ensayos Reales</h3>
            <p>Simula la experiencia PAES con límite de tiempo calculando tu puntaje estimado.</p>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="pricing container">
        <h2 class="section-title text-center">Un plan que se ajusta a ti</h2>
        <div class="pricing-grid">
          <div class="glass-card pricing-card">
            <h3>Básico</h3>
            <div class="price">Gratis<span>/siempre</span></div>
            <ul class="features-list">
              <li>✔️ 1 Ensayo Diario</li>
              <li>✔️ 5 Mini-quizzes /día</li>
              <li>✔️ Todo el contenido Mineduc</li>
              <li>❌ Análisis profundo IA</li>
            </ul>
            <a :href="registerUrl" class="btn btn-outline w-full mt-4">Comenzar</a>
          </div>
          
          <div class="glass-card pricing-card premium">
            <div class="premium-badge">Recomendado</div>
            <h3>Premium</h3>
            <div class="price">$9.990<span>/mes</span></div>
            <ul class="features-list">
              <li>✔️ Ensayos Ilimitados</li>
              <li>✔️ Quizzes Ilimitados</li>
              <li>✔️ <strong>Análisis IA ilimitado</strong></li>
              <li>✔️ Prioridad en nuevas funciones</li>
            </ul>
            <a :href="registerUrl" class="btn btn-primary w-full mt-4">Actualizar a Premium</a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container text-center">
        <div class="logo">
          <span class="text-gradient">EstudiaUni</span>.cl
        </div>
        <p class="text-secondary mt-2">© 2026 EstudiaUni. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const loginUrl = 'https://estudiauni.web.app/login';
const registerUrl = 'https://estudiauni.web.app/register';
</script>

<style scoped>
/* Page Specific Styles */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1.5rem 0;
  z-index: 100;
  background: rgba(13, 15, 23, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.95rem;
}

.nav-links a:hover {
  color: white;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.w-full {
  width: 100%;
}

.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1.5rem; }

/* Hero Section */
.hero {
  padding-top: 180px;
  padding-bottom: 100px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 100vh;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  color: #a855f7;
  border-radius: 999px;
  font-weight: 500;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.hero h1 {
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  max-width: 90%;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.hero-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* Mockup */
.mockup-card {
  width: 100%;
  max-width: 500px;
  height: 350px;
  margin-left: auto;
  position: relative;
  background: rgba(30, 35, 50, 0.4);
}

.mockup-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.dots span {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
  background: #ff5f56;
}
.dots span:nth-child(2) { background: #ffbd2e; }
.dots span:nth-child(3) { background: #27c93f; }

.mockup-header .title {
  margin-left: auto;
  margin-right: auto;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.mockup-chart {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  height: 150px;
  margin-bottom: 2rem;
}

.bar {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px 8px 0 0;
  transition: all 0.5s ease;
}

.bar.highlight {
  background: var(--gradient-brand);
}

.mockup-ai-feedback {
  background: rgba(99, 102, 241, 0.1);
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #e2e8f0;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

/* Sections General */
.section-title {
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.text-center {
  text-align: center;
}

/* Features */
.features {
  padding: 100px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--text-secondary);
}

/* Pricing */
.pricing {
  padding: 100px 0;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
}

.pricing-card.premium {
  border: 1px solid var(--accent-primary);
  background: rgba(99, 102, 241, 0.05);
}

.premium-badge {
  position: absolute;
  top: -12px;
  right: 2rem;
  background: var(--gradient-brand);
  padding: 0.2rem 1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: bold;
}

.price {
  font-size: 3rem;
  font-weight: 800;
  font-family: var(--font-heading);
  margin: 1rem 0;
}

.price span {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.features-list {
  list-style: none;
  margin-bottom: 2rem;
  flex: 1;
}

.features-list li {
  margin-bottom: 1rem;
  color: #e2e8f0;
}

.footer {
  padding: 4rem 0;
  border-top: 1px solid var(--glass-border);
  margin-top: 5rem;
}

@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; text-align: center; }
  .features-grid { grid-template-columns: 1fr; }
  .pricing-grid { grid-template-columns: 1fr; }
  .hero-actions { justify-content: center; }
}
</style>
