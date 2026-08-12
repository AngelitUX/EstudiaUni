/**
 * One-off script: creates the two Flow subscription plans (Pro Mensual /
 * Pro Anual) via the Flow API and prints the resulting planId's.
 *
 * Run once per Flow account/environment (sandbox and, later, production each
 * need their own plans):
 *   npm run setup:flow-plans
 *
 * Requires FLOW_API_KEY, FLOW_SECRET_KEY, FLOW_ENVIRONMENT and
 * BACKEND_PUBLIC_URL to already be set in backend/.env. Copy the printed
 * FLOW_PLAN_ID_MONTHLY / FLOW_PLAN_ID_YEARLY values into that same .env file
 * afterwards — the app reads the plan IDs from there, it never creates plans
 * on its own at request time.
 */
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config();

const isProduction = process.env.FLOW_ENVIRONMENT === 'production';
const baseUrl = process.env.FLOW_BASE_URL
  || (isProduction ? 'https://www.flow.cl/api' : 'https://sandbox.flow.cl/api');
const apiKey = process.env.FLOW_API_KEY || '';
const secretKey = process.env.FLOW_SECRET_KEY || '';
const backendPublicUrl = process.env.BACKEND_PUBLIC_URL || '';

function sign(params: Record<string, string>): string {
  const keys = Object.keys(params).filter((k) => k !== 's').sort();
  const toSign = keys.map((k) => `${k}${params[k]}`).join('');
  return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

async function createPlan(planId: string, name: string, amount: number, interval: number) {
  const params: Record<string, string> = {
    apiKey,
    planId,
    name,
    currency: 'CLP',
    amount: String(amount),
    interval: String(interval), // Flow: 1=daily, 2=weekly, 3=monthly, 4=yearly
    interval_count: '1',
    urlCallback: `${backendPublicUrl}/api/subscriptions/flow/webhook`,
  };
  params.s = sign(params);

  const response = await fetch(`${baseUrl}/plans/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });

  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`Flow error creating plan "${planId}": ${text}`);
  }

  return data;
}

async function main() {
  if (!apiKey || !secretKey) {
    console.error('❌ Faltan FLOW_API_KEY / FLOW_SECRET_KEY en backend/.env');
    process.exit(1);
  }
  if (!backendPublicUrl) {
    console.error('❌ Falta BACKEND_PUBLIC_URL en backend/.env (URL pública HTTPS del backend, usada como urlCallback del webhook).');
    process.exit(1);
  }

  console.log(`🌊 Creando planes en Flow (${isProduction ? 'PRODUCCIÓN' : 'SANDBOX'}) contra ${baseUrl} ...`);

  const monthly = await createPlan('pro-mensual', 'Plan Pro Mensual', 9990, 3);
  console.log('✅ Plan mensual creado:', monthly);

  const yearly = await createPlan('pro-anual', 'Plan Pro Anual', 69990, 4);
  console.log('✅ Plan anual creado:', yearly);

  console.log('\nCopia estos valores a backend/.env:\n');
  console.log(`FLOW_PLAN_ID_MONTHLY=${monthly.planId || 'pro-mensual'}`);
  console.log(`FLOW_PLAN_ID_YEARLY=${yearly.planId || 'pro-anual'}`);
}

main().catch((error) => {
  console.error('❌ setup-flow-plans falló:', error.message);
  process.exit(1);
});
