import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

/**
 * Verifica el token de Firebase App Check (cabecera X-Firebase-AppCheck) que el frontend
 * adjunta tras resolver el widget invisible de Cloudflare Turnstile. Es una capa aparte de
 * FirebaseAuthGuard: Auth confirma QUIÉN es el usuario, App Check confirma que la petición
 * viene de tu app real y no de un bot/script hablándole directo a la API. Se pueden usar
 * juntos en el mismo endpoint sin conflicto.
 */
@Injectable()
export class AppCheckGuard implements CanActivate {
  private readonly logger = new Logger(AppCheckGuard.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const appCheckToken = request.headers['x-firebase-appcheck'];

    if (!appCheckToken) {
      throw new UnauthorizedException('Missing App Check token');
    }

    try {
      await this.firebaseService.appCheck.verifyToken(appCheckToken);
      return true;
    } catch (error) {
      this.logger.warn(`App Check verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid App Check token');
    }
  }
}
