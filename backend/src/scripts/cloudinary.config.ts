import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Configures the Cloudinary SDK from environment variables.
 *
 * These credentials used to be hardcoded as fallbacks in every upload script,
 * which meant the API secret was committed to the repository. They now come
 * exclusively from `backend/.env` and the script fails loudly if they are
 * missing, so a leaked secret can never silently keep working.
 *
 * NOTA: el secreto anterior quedo en el historial de git, asi que ademas de
 * este cambio hay que ROTARLO en el dashboard de Cloudinary
 * (Settings -> Access Keys -> generar nueva) y pegar el nuevo valor en .env.
 */
export function configureCloudinary(): void {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const missing = [
    !cloudName && 'CLOUDINARY_CLOUD_NAME',
    !apiKey && 'CLOUDINARY_API_KEY',
    !apiSecret && 'CLOUDINARY_API_SECRET',
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `[Cloudinary] Faltan variables de entorno en backend/.env: ${missing.join(', ')}.\n` +
        `Consiguelas en https://console.cloudinary.com/ (Settings -> API Keys) y agregalas ` +
        `al archivo backend/.env antes de correr este script.`,
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}
