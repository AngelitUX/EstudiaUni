import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY', '')
      .replace(/\\n/g, '\n');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

    if (!projectId || !clientEmail) {
      this.logger.warn(
        'Firebase credentials not fully configured. Some features will not work.',
      );
      return;
    }

    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });

    this.logger.log(`Firebase initialized for project: ${projectId}`);
  }

  get auth(): admin.auth.Auth {
    return this.app.auth();
  }

  get firestore(): admin.firestore.Firestore {
    return this.app.firestore();
  }

  get storage(): admin.storage.Storage {
    return this.app.storage();
  }
}
