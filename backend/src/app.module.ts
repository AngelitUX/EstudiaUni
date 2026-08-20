import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ModulesContentModule } from './modules-content/modules-content.module';
import { QuestionsModule } from './questions/questions.module';
import { SimulationsModule } from './simulations/simulations.module';
import { QuizModule } from './quiz/quiz.module';
import { LearningPathModule } from './learning-path/learning-path.module';
import { AiFeedbackModule } from './ai-feedback/ai-feedback.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 60,  // 60 requests per minute default
      },
    ]),

    // Core modules
    FirebaseModule,
    AuthModule,
    UsersModule,
    SubscriptionsModule,

    // Content modules
    ModulesContentModule,
    QuestionsModule,
    SimulationsModule,
    QuizModule,

    // AI & Learning
    LearningPathModule,
    AiFeedbackModule,

    // Admin
    AdminModule,
  ],
  providers: [
    // ThrottlerModule.forRoot() only registers the rate-limit config; it
    // does not enforce it anywhere on its own. Registering ThrottlerGuard
    // as an APP_GUARD is what actually applies it to every request.
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
