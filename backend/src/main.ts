import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  // bodyParser disabled here on purpose so the two lines below can raise the
  // limit — Express's default is 100kb, too small for the base64 receipt
  // image the manual-transfer form sends as `receiptUrl` (a compressed
  // screenshot easily clears that even at low quality).
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  const configService = app.get(ConfigService);

  // Confiar en la cabecera X-Forwarded-For del proxy.
  //
  // IMPRESCINDIBLE al desplegar detrás de Cloud Run / Render / Railway / un
  // balanceador: sin esto Express ve la IP del proxy en TODAS las peticiones, y
  // como ThrottlerGuard limita por IP, los usuarios comparten un unico cupo de
  // 60 req/min. Con tráfico real eso significa que unos pocos alumnos dejan al
  // resto con 429.
  //
  // El valor 1 confía en un solo salto de proxy (el escenario habitual). Si se
  // añade otro proxy delante (por ejemplo Cloudflare + Cloud Run), hay que
  // subirlo, porque confiar de más permite falsificar la IP y saltarse el límite.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  //
  // FRONTEND_APP_URL acepta VARIOS origenes separados por coma, por ejemplo:
  //   FRONTEND_APP_URL=https://estudiauni.cl,https://estudiauni.web.app
  // Hacia falta porque el sitio se sirve desde mas de un dominio (el propio y
  // el .web.app que da Firebase Hosting) y antes solo cabia uno.
  //
  // Nota: si el frontend llama al backend a traves del rewrite /api/** de
  // Firebase Hosting, la peticion es del MISMO origen y CORS ni siquiera entra
  // en juego. Esto importa cuando se llama a la URL de Cloud Run directamente
  // (por ejemplo al probar antes de montar el rewrite).
  const origenes = (configService.get<string>('FRONTEND_APP_URL') ?? 'http://localhost:4200')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origenes,
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Cloud Run (y cualquier contenedor) inyecta PORT — normalmente 8080. En
  // local no existe esa variable y se cae al 3000 de siempre.
  const port = configService.get<number>('PORT', 3000);

  // Escuchar en 0.0.0.0 explicitamente, no en la interfaz por defecto: dentro
  // de un contenedor, un proceso atado solo a localhost no es alcanzable desde
  // fuera, y Cloud Run lo dara por caido aunque el proceso este vivo.
  await app.listen(port, '0.0.0.0');

  console.log(`EstudiaUni API escuchando en el puerto ${port} (prefijo /api)`);
}
bootstrap();
