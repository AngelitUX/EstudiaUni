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
  app.enableCors({
    origin: [
      configService.get<string>('FRONTEND_APP_URL', 'http://localhost:4200'),
      configService.get<string>('FRONTEND_LANDING_URL', 'http://localhost:3001'),
    ],
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

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`🚀 EstudiaUni API running on http://localhost:${port}/api`);
}
bootstrap();
