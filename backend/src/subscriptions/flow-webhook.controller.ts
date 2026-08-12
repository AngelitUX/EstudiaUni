import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { FlowService } from './flow.service';

// Intentionally NOT behind FirebaseAuthGuard: Flow's servers call this
// endpoint directly (server-to-server) and cannot send a Firebase auth token.
// The body shape is defined by Flow, not us, so it's read as a plain object
// instead of a validated DTO — NestJS's global ValidationPipe only inspects
// parameters typed with a decorated class, so this bypasses it safely.
@Controller('subscriptions/flow')
export class FlowWebhookController {
  constructor(private readonly flowService: FlowService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() body: Record<string, any>) {
    await this.flowService.handleRecurringWebhook(body || {});
    // Flow expects a fast 200 to consider the webhook delivered; anything else
    // triggers retries. Errors are already logged inside handleRecurringWebhook.
    return { ok: true };
  }
}
