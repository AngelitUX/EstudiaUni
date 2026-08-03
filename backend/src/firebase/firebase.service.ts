import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    if (admin.apps.length > 0) {
      this.app = admin.apps[0]!;
      this.logger.log(`Using existing Firebase app for project: ${this.app.options.projectId || 'estudiauni'}`);
      return;
    }

    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID') || 'estudiauni';
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY', '')
      .replace(/\\n/g, '\n');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

    if (clientEmail && privateKey) {
      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
      });
      this.logger.log(`Firebase initialized with cert credentials for project: ${projectId}`);
    } else {
      this.app = admin.initializeApp({ projectId });
      this.logger.log(`Firebase initialized in default mode for project: ${projectId}`);
    }
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
