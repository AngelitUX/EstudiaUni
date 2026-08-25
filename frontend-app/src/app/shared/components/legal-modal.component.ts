import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-legal-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-modal-overlay" *ngIf="type" (click)="close.emit()">
      <div class="legal-modal-content" (click)="$event.stopPropagation()">
        <div class="legal-modal-header">
          <h3>{{ type === 'terms' ? 'Términos de Servicio' : 'Política de Privacidad' }}</h3>
          <button class="close-btn" (click)="close.emit()">✕</button>
        </div>
        <div class="legal-modal-body" *ngIf="type === 'terms'">
          <p class="legal-updated">Última actualización: 12 de agosto de 2026</p>
          <p>Estos Términos de Servicio ("Términos") regulan el acceso y uso de la plataforma EstudiaUni.cl (el "Servicio"), incluyendo su sitio web, aplicaciones y cualquier funcionalidad asociada. Al crear una cuenta o utilizar el Servicio, aceptas quedar vinculado por estos Términos y por nuestra Política de Privacidad. Si no estás de acuerdo con alguna disposición, te pedimos no utilizar la plataforma.</p>

          <h4>I. Descripción del Servicio</h4>
          <p>EstudiaUni es una plataforma educativa en línea orientada a apoyar la preparación de estudiantes chilenos para la Prueba de Acceso a la Educación Superior (PAES). El Servicio incluye, entre otros elementos, rutas de aprendizaje, ensayos y mini-ensayos de práctica, herramientas de seguimiento de progreso, contenido de apoyo y un tutor de inteligencia artificial ("Foco"). El contenido se elabora tomando como referencia los temarios publicados por el DEMRE, pero EstudiaUni no está afiliada, patrocinada ni respaldada por el DEMRE, el Ministerio de Educación ni ninguna universidad.</p>

          <h4>II. Elegibilidad y cuentas de usuario</h4>
          <p>Para usar funciones que requieren registro debes proporcionar información veraz, exacta y actualizada (nombre y correo electrónico, como mínimo). Tu cuenta es personal e intransferible; eres responsable de mantener la confidencialidad de tus credenciales y de toda actividad realizada desde tu cuenta. Si eres menor de 18 años, recomendamos que uses la plataforma con el conocimiento y, cuando corresponda, la supervisión de tu padre, madre o apoderado. Nos reservamos el derecho de solicitar verificación de identidad y de suspender cuentas con información falsa o uso indebido.</p>

          <h4>III. Naturaleza educativa del contenido y ausencia de garantía de resultados</h4>
          <p>Todos los recursos de EstudiaUni —ensayos, correcciones, estadísticas, rutas de aprendizaje y las respuestas del Tutor IA— tienen una finalidad formativa y de apoyo al estudio. No garantizamos un puntaje, resultado específico en la PAES ni la admisión a ninguna institución de educación superior. El desempeño depende de múltiples factores ajenos a la plataforma. Recomendamos contrastar siempre la información con las comunicaciones oficiales del DEMRE y de las instituciones educativas correspondientes.</p>

          <h4>IV. Tutor de Inteligencia Artificial ("Foco")</h4>
          <p>Foco es un asistente basado en modelos de inteligencia artificial de proveedores externos, diseñado para resolver dudas, explicar contenidos y sugerir planes de repaso personalizados. Las respuestas se generan de forma automatizada y, como toda herramienta de IA, pueden contener imprecisiones o errores ocasionales ("alucinaciones"). Las respuestas de Foco no constituyen asesoría profesional de ningún tipo y deben verificarse frente a fuentes académicas u oficiales antes de tomarlas como definitivas.</p>

          <h4>V. Planes, precios y medios de pago</h4>
          <p>EstudiaUni ofrece un plan gratuito y uno o más planes de pago ("Plan Pro" u otros equivalentes), cuyos precios, moneda (pesos chilenos) y beneficios se detallan en la sección de precios de la plataforma. Los pagos de las suscripciones son procesados por Flow, un proveedor de pagos externo; EstudiaUni no almacena los datos completos de tu tarjeta o medio de pago. Al contratar un plan pagado, autorizas el cobro periódico (mensual o anual, según elijas) hasta que canceles tu suscripción. Los cargos se renuevan automáticamente al finalizar cada ciclo, salvo cancelación previa. Podemos modificar los precios de los planes hacia adelante, notificándolo con antelación razonable; los cambios no afectan un ciclo de facturación ya iniciado.</p>

          <h4>VI. Cancelación y reembolsos</h4>
          <p>Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta, mediante un procedimiento tan simple como el de contratación. Al cancelar, conservarás el acceso a los beneficios del plan pagado hasta el término del período ya facturado, sin renovaciones posteriores. Salvo que la ley aplicable disponga lo contrario (por ejemplo, derecho a retracto dentro del plazo legal para compras a distancia), los pagos ya realizados no son reembolsables de forma proporcional por el tiempo no utilizado.</p>

          <h4>VII. Propiedad intelectual</h4>
          <p>El software, diseño, marca, logotipos, textos, ejercicios, ilustraciones y demás contenidos de EstudiaUni son de propiedad de EstudiaUni o de terceros licenciantes, y se encuentran protegidos por la Ley N° 17.336 sobre Propiedad Intelectual y demás normativa aplicable. Se te concede una licencia personal, limitada, no exclusiva e intransferible para acceder y utilizar el contenido exclusivamente con fines de estudio personal. Queda prohibida su reproducción, distribución, ingeniería inversa, scraping automatizado o explotación comercial sin autorización previa y escrita.</p>

          <h4>VIII. Conducta del usuario y usos prohibidos</h4>
          <p>Al usar EstudiaUni te comprometes a: (a) utilizar la plataforma únicamente con fines académicos y lícitos; (b) no compartir tu cuenta con terceros ni usar cuentas de otras personas; (c) no intentar vulnerar la seguridad del Servicio, extraer masivamente su contenido o interferir con su funcionamiento; y (d) no utilizar el Tutor IA con fines abusivos, ilegales o contrarios a estos Términos. El incumplimiento de estas reglas puede dar lugar a la suspensión o cierre de tu cuenta.</p>

          <h4>IX. Disponibilidad del servicio y limitación de responsabilidad</h4>
          <p>Nos esforzamos por mantener EstudiaUni disponible de forma continua, pero el Servicio se entrega "tal como está" y "según disponibilidad", sin garantías de funcionamiento ininterrumpido o libre de errores. En la máxima medida permitida por la ley, EstudiaUni no será responsable por daños indirectos, lucro cesante o pérdida de datos derivados del uso o la imposibilidad de uso de la plataforma. Nada en esta cláusula limita los derechos irrenunciables que la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores reconoce a los usuarios en Chile.</p>

          <h4>X. Suspensión y terminación</h4>
          <p>Podemos suspender o cerrar tu cuenta si detectamos incumplimientos graves de estos Términos, uso fraudulento, o por requerimiento legal. Tú puedes cerrar tu cuenta en cualquier momento desde tu configuración o solicitándolo a contacto.estudiauni&#64;gmail.com. Las cláusulas que por su naturaleza deban sobrevivir a la terminación (propiedad intelectual, limitación de responsabilidad, ley aplicable) seguirán vigentes.</p>

          <h4>XI. Modificaciones a estos Términos</h4>
          <p>Podemos actualizar estos Términos para reflejar cambios legales, técnicos o del Servicio. Publicaremos la versión vigente en esta misma sección indicando la fecha de última actualización; los cambios sustanciales se comunicarán por correo electrónico o mediante aviso destacado en la plataforma. El uso continuado del Servicio después de una actualización implica tu aceptación de los nuevos Términos.</p>

          <h4>XII. Ley aplicable y jurisdicción</h4>
          <p>Estos Términos se rigen por las leyes de la República de Chile. Cualquier controversia se someterá a los tribunales ordinarios de justicia competentes, sin perjuicio de las normas de protección al consumidor que permiten a los usuarios recurrir a los tribunales de su propio domicilio.</p>

          <h4>XIII. Contacto</h4>
          <p>Ante cualquier consulta sobre estos Términos, escríbenos a contacto.estudiauni&#64;gmail.com o a través de nuestro <a routerLink="/soporte" (click)="close.emit()">Centro de Soporte</a>.</p>
        </div>
        <div class="legal-modal-body" *ngIf="type === 'privacy'">
          <p class="legal-updated">Última actualización: 12 de agosto de 2026</p>
          <p>En EstudiaUni tratamos tus datos personales conforme a la Ley N° 19.628 sobre Protección de la Vida Privada y demás normativa chilena aplicable en materia de protección de datos. Esta Política explica qué información recopilamos, para qué la usamos, con quién la compartimos y qué derechos tienes sobre ella.</p>

          <h4>I. Responsable del tratamiento</h4>
          <p>EstudiaUni.cl es responsable del tratamiento de los datos personales recopilados a través de la plataforma. Para cualquier consulta o ejercicio de derechos relacionados con tus datos, puedes contactarnos en contacto.estudiauni&#64;gmail.com.</p>

          <h4>II. Datos que recopilamos</h4>
          <p>Recopilamos: (a) datos de identificación y contacto (nombre, correo electrónico, contraseña cifrada); (b) datos académicos y de uso (respuestas en ensayos, avance en rutas de aprendizaje, estadísticas de rendimiento, historial de interacciones con el Tutor IA); (c) datos de suscripción y facturación a nivel de estado del plan (no almacenamos números completos de tarjetas, ya que el cobro lo procesa Flow); y (d) datos técnicos (dirección IP, tipo de dispositivo/navegador, cookies y registros de actividad) recopilados de forma automática.</p>

          <h4>III. Finalidades del tratamiento</h4>
          <p>Usamos tus datos para: crear y administrar tu cuenta; personalizar tu ruta de estudio y las respuestas del Tutor IA; procesar pagos y gestionar suscripciones; medir y mejorar el rendimiento de la plataforma; enviarte comunicaciones operativas (confirmaciones, avisos de cambios) y, solo si lo autorizas, comunicaciones promocionales; prevenir fraudes y cumplir obligaciones legales.</p>

          <h4>IV. Con quién compartimos tu información</h4>
          <p>No vendemos tus datos personales. Los compartimos únicamente con proveedores que nos ayudan a operar el Servicio, bajo acuerdos de confidencialidad y tratamiento de datos: Flow (procesamiento de pagos), Google Firebase / Google Cloud (autenticación y alojamiento de datos), proveedores de modelos de inteligencia artificial utilizados por el Tutor IA (para procesar tus consultas y generar respuestas), y herramientas de analítica para entender el uso agregado de la plataforma. También podemos divulgar información cuando la ley, un tribunal o una autoridad competente lo exija.</p>

          <h4>V. Transferencia internacional de datos</h4>
          <p>Algunos de nuestros proveedores (por ejemplo, de infraestructura en la nube o de modelos de inteligencia artificial) pueden procesar datos fuera de Chile. En esos casos, exigimos contractualmente a dichos proveedores mantener estándares de protección de datos equivalentes a los exigidos por la normativa chilena.</p>

          <h4>VI. Plazo de conservación</h4>
          <p>Conservamos tus datos personales mientras mantengas una cuenta activa en EstudiaUni y, posteriormente, durante el plazo necesario para cumplir obligaciones legales, contables o tributarias, o para resolver eventuales controversias. Si solicitas la eliminación de tu cuenta, procederemos conforme a lo indicado en la sección VIII.</p>

          <h4>VII. Medidas de seguridad</h4>
          <p>Aplicamos medidas técnicas y organizativas razonables (cifrado de contraseñas, control de accesos, proveedores de infraestructura certificados) para proteger tus datos frente a accesos no autorizados, pérdida o alteración. Ningún sistema es completamente infalible; si detectamos un incidente de seguridad que afecte tus datos, te lo comunicaremos conforme a la normativa vigente.</p>

          <h4>VIII. Cookies y tecnologías similares</h4>
          <p>Usamos cookies propias y de terceros para mantener tu sesión iniciada, recordar tus preferencias y analizar el uso de la plataforma con fines de mejora continua. Puedes bloquear o eliminar las cookies desde la configuración de tu navegador; ten en cuenta que esto podría afectar el funcionamiento normal del sitio.</p>

          <h4>IX. Tus derechos (ARCO)</h4>
          <p>Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) sobre tus datos personales, así como solicitar la portabilidad de tu información cuando sea técnicamente posible. La mayoría de estos ajustes puedes realizarlos directamente desde tu panel de configuración; para solicitudes adicionales, escríbenos a contacto.estudiauni&#64;gmail.com indicando tu nombre y correo de registro. Responderemos dentro de los plazos que establece la ley.</p>

          <h4>X. Menores de edad</h4>
          <p>EstudiaUni está pensada principalmente para estudiantes en proceso de rendir la PAES, quienes pueden ser menores de 18 años. Si tienes menos de 14 años, no debes registrarte sin la autorización y supervisión de tu padre, madre o apoderado. Los padres o apoderados que consideren que un menor a su cargo nos ha proporcionado datos sin su consentimiento pueden contactarnos para solicitar su eliminación.</p>

          <h4>XI. Cambios a esta Política</h4>
          <p>Podemos actualizar esta Política de Privacidad para reflejar cambios legales o en nuestras prácticas de tratamiento de datos. Publicaremos la versión vigente en esta misma sección junto con su fecha de actualización, y te notificaremos los cambios relevantes por correo electrónico o mediante aviso en la plataforma.</p>

          <h4>XII. Contacto</h4>
          <p>Si tienes preguntas sobre esta Política o quieres ejercer tus derechos, contáctanos en contacto.estudiauni&#64;gmail.com o a través de nuestro <a routerLink="/soporte" (click)="close.emit()">Centro de Soporte</a>.</p>

          <h4>XIII. Turnstile de Cloudflare</h4>
          <p>Para proteger la plataforma de bots y actividad maliciosa usamos <strong>Cloudflare Turnstile</strong>, una herramienta de verificación que no te pide resolver ningún acertijo visual. A continuación reproducimos, en su idioma original, el addendum de privacidad que Cloudflare exige incluir a los sitios que usan este servicio.</p>

          <div class="legal-turnstile-addendum">
            <p class="legal-updated">Turnstile Privacy Addendum — Last updated: June 18, 2025</p>

            <h4>1. Introduction</h4>
            <p>Turnstile, developed by Cloudflare, Inc. ("Cloudflare"), is a pro-privacy website security tool that processes minimal Signals (as defined below) solely to protect web properties against malicious activity by distinguishing human users from bots and blocking bot traffic.</p>
            <p>Cloudflare does not control whether a website chooses to use Turnstile; instead, we make Turnstile available to any website that is looking for a way to detect and block bot traffic.</p>

            <h4>2. Scope of this Addendum</h4>
            <p>This Turnstile Addendum is supplemental to Cloudflare's main <a href="https://www.cloudflare.com/en-gb/privacypolicy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>. It provides additional information specific to your use and interaction with Turnstile. This Addendum also applies to the personal data processed using Cloudflare's Challenge Platform, and any reference to "Turnstile" in this addendum applies equally to the Challenge Platform.</p>
            <p>The Cloudflare Privacy Policy continues to apply to your use and interaction with Turnstile, except where this Turnstile Addendum provides more specific information. In those cases, the more specific information will apply instead.</p>

            <h4>3. Information We Collect</h4>
            <p>Cloudflare Turnstile processes a variety of client-side signals ("Signals") such as client IP address, TLS Fingerprint, User-Agent Header and Sitekey and associated origin. Cloudflare does not have the ability to directly identify any individuals from any of the Signals Turnstile collects, including IP addresses.</p>

            <h4>4. How We Use Information We Collect</h4>
            <p><em>(i) Bot detection and blocking</em></p>
            <p>Turnstile is a tool to protect web properties by distinguishing human users from bots and blocking any detected bot traffic that could otherwise harm the safety and security of that property.</p>
            <p>It does so by evaluating the Signals listed above specific to both the website visitor and the website visited. The purpose of collecting these Signals is not to identify, profile or target any individuals but solely to detect and block bots. The Signals collected by Turnstile are strictly necessary for this purpose (i.e. detecting and blocking bots to enable visitors to enjoy a safe and secure experience when visiting websites that have implemented Turnstile).</p>
            <p>Cloudflare is a data processor of Signals that we process to provide the Turnstile service to our customers, that is, securing our customers' websites. This means that we process Signals for this purpose on behalf of, and pursuant to instructions issued by, our website operator customers (who are the data controllers of any data processed for this purpose). If you have questions, or wish to exercise any data protection rights, regarding Cloudflare's processing of Turnstile data to provide our service, please contact the relevant website operator.</p>
            <p><em>(ii) Improving Turnstile's bot detection capabilities</em></p>
            <p>Cloudflare also processes the Signals described in this Privacy Notice to improve Turnstile. This is necessary to refine and improve our bot detection algorithms in order to respond to evolving bot threats, and to maintain the security of the web properties that website visitors choose to visit.</p>
            <p>Cloudflare is a data controller of Signals that we process to improve Turnstile's bot detection capabilities. This Turnstile Privacy Notice (in conjunction with Cloudflare's main <a href="https://www.cloudflare.com/en-gb/privacypolicy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>) governs our processing of Signals for this purpose.</p>

            <h4>5. Notice to EU and UK Residents</h4>
            <p>To the extent that the data described in the Turnstile Privacy Notice qualifies as personal data, then:</p>
            <ul>
              <li>When processing this personal data as a processor to protect our customers' websites, our customers, as controllers, determine the lawful basis of this processing, and we process this data under their instruction and on their behalf; and</li>
              <li>When processing this personal data as a controller, we rely on our legitimate interests in improving the effectiveness of Turnstile's bot detection capabilities to process this Turnstile data.</li>
            </ul>

            <h4>6. Cookies</h4>
            <p>The Signals collected by Turnstile are strictly necessary for the purpose of detecting and blocking bots to enable visitors to enjoy a safe and secure experience when visiting websites that have implemented Turnstile.</p>
            <p>For more information about the cookies used by Cloudflare, please check our <a href="https://www.cloudflare.com/en-gb/cookie-policy/" target="_blank" rel="noopener noreferrer">Cookie Policy</a> and our <a href="https://developers.cloudflare.com/turnstile/" target="_blank" rel="noopener noreferrer">Turnstile Developer Docs</a>.</p>

            <h4>Contact for Privacy Concerns</h4>
            <p>If you have questions or concerns about this Turnstile Privacy Notice or your personal data processed through Turnstile, please contact Cloudflare's Data Protection Officer at <a href="mailto:dpo&#64;cloudflare.com">dpo&#64;cloudflare.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
    .legal-modal-body p.legal-updated { font-size: 0.8rem; font-weight: 700; color: #855cd6; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 1rem; }
    .legal-turnstile-addendum { margin-top: 0.5rem; padding: 1rem 1.25rem; border: 1px solid var(--glass-border, rgba(133, 92, 214, 0.15)); border-radius: 12px; background: var(--bg-secondary, #f9fafb); }
    .legal-turnstile-addendum h4:first-child { margin-top: 0; }
    .legal-turnstile-addendum ul { color: var(--text-secondary, #4b5563); line-height: 1.6; font-size: 0.95rem; padding-left: 1.25rem; margin: 0.5rem 0; }
    @media (max-width: 480px) {
      .legal-modal-content { width: 95%; padding: 1.25rem; max-height: 85vh; }
      .legal-modal-header .close-btn { width: 44px; height: 44px; font-size: 1.3rem; }
    }
  `]
})
export class LegalModalComponent {
  @Input() type: 'terms' | 'privacy' | null = null;
  @Output() close = new EventEmitter<void>();
}
