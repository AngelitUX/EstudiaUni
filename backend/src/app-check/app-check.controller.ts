import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AppCheckService } from './app-check.service';
import { ExchangeTokenDto } from './dto/exchange-token.dto';

// Sin ningún guard a propósito: este endpoint ES el mecanismo de verificación en sí mismo —
// todavía no existe ningún token de App Check que exigir para llegar hasta acá. Lo que lo
// protege es la verificación del token de Turnstile contra los servidores de Cloudflare
// dentro de AppCheckService, no un guard de NestJS.
@Controller('app-check')
export class AppCheckController {
  constructor(private readonly appCheckService: AppCheckService) {}

  @Post('exchange')
  @HttpCode(200)
  async exchange(@Body() dto: ExchangeTokenDto) {
    return this.appCheckService.exchangeTurnstileToken(dto.turnstileToken);
  }
}
