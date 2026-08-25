import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const DEFAULT_TTL_MILLIS = 60 * 60 * 1000; // 1 hora — mismo valor que se iba a usar en la extensión

/**
 * Reemplaza a la extensión oficial "Cloudflare Turnstile App Check Provider": esa extensión
 * despliega su propia Cloud Function, pero la versión publicada en el Extensions Hub todavía
 * declara el runtime nodejs18 (dado de baja por Google Cloud para despliegues nuevos), así
 * que su instalación falla con RESOURCE_ERROR / DEPLOYS_NOT_ALLOWED — no es un error de
 * configuración nuestro, es la extensión desactualizada.
 *
 * En vez de depender de esa Cloud Function, este servicio hace exactamente lo mismo
 * (verificar el token de Turnstile contra Cloudflare, y si es válido, emitir un token de
 * Firebase App Check) desde el propio backend NestJS, que ya tiene firebase-admin
 * inicializado. El formato de respuesta { token, expireTimeMillis } es el que
 * CloudflareProviderOptions (paquete @cloudflare/turnstile-firebase-app-check, ya instalado
 * en el frontend) espera recibir — no es arbitrario, hay que mantenerlo así.
 */
@Injectable()
export class AppCheckService {
  private readonly logger = new Logger(AppCheckService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async exchangeTurnstileToken(turnstileToken: string): Promise<{ token: string; expireTimeMillis: number }> {
    const verified = await this.verifyTurnstileToken(turnstileToken);
    if (!verified) {
      // Mismo contrato de fallo que esperaba el cliente de la extensión de Cloudflare:
      // un token vacío, no un error HTTP — así CloudflareProviderOptions.getToken() lo detecta
      // (revisa `appCheckToken.token === ''`).
      return { token: '', expireTimeMillis: 0 };
    }

    const appId = this.configService.get<string>(
      'FIREBASE_APP_ID',
      '1:976475724065:web:586b9c2609d84674158660',
    );

    const { token, ttlMillis } = await this.firebaseService.appCheck.createToken(appId, {
      ttlMillis: DEFAULT_TTL_MILLIS,
    });

    return { token, expireTimeMillis: Date.now() + ttlMillis };
  }

  private async verifyTurnstileToken(turnstileToken: string): Promise<boolean> {
    const secret = this.configService.get<string>('TURNSTILE_SECRET_KEY');
    if (!secret) {
      this.logger.error('TURNSTILE_SECRET_KEY no está configurada — rechazando por defecto.');
      return false;
    }

    try {
      const response = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, response: turnstileToken }),
      });
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      this.logger.warn(`Verificación de Turnstile falló: ${error.message}`);
      return false;
    }
  }
}
