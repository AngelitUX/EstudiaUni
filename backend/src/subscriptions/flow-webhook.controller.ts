import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { FlowService } from './flow.service';

// Intentionally NOT behind FirebaseAuthGuard: Flow's servers call this
// endpoint directly (server-to-server) and cannot send a Firebase auth token.
// The body shape is defined by Flow, not us, so it's read as a plain object
// instead of a validated DTO — NestJS's global ValidationPipe only inspects
// parameters typed with a decorated class, so this bypasses it safely.
@Controller('subscriptions/flow')
export class FlowWebhookController {
  constructor(
    private readonly flowService: FlowService,
    private readonly configService: ConfigService,
  ) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() body: Record<string, any>) {
    await this.flowService.handlePaymentWebhook(body || {});
    // Flow expects a fast 200 to consider the webhook delivered; anything else
    // triggers retries. Errors are already logged inside handlePaymentWebhook.
    return { ok: true };
  }

  /**
   * Bridge for the `urlReturn` Flow uses after a payment. Per Flow's own
   * docs, this is ALWAYS a POST with `token` in the body — never a GET with
   * a query string, no matter how many of their examples suggest otherwise.
   * A static Angular route can't read a POST body once the browser has
   * navigated there (confirmed in practice: Angular's dev server and any
   * plain static host both have nothing to hand the SPA), so Flow can't
   * point straight at `/pago-resultado`. This reads the token server-side
   * instead and 302s the browser to the SPA with it as a query param, which
   * `pago-resultado.component.ts` already knows how to read.
   */
  @Post('return')
  returnFromPayment(@Body('token') token: string, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_APP_URL', 'http://localhost:4200');
    res.redirect(302, `${frontendUrl}/pago-resultado?token=${encodeURIComponent(token || '')}`);
  }
}
