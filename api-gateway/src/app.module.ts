import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleAuthModule } from './auth/google/googleAuth.module';
import { AuthModule } from './auth/mail-connection/auth.module';
import { CoreConfigModule } from './common/config/core/core.module';
import { getDefaultMailConnectionConfig } from './common/constants/mail.connection';
import { getDefaultDbConnectionString } from './common/constants/mongoose.connection';
import { getThroTTLconfig } from './common/constants/throttle.config';
import { GetUploadFilesModule } from './common/controller/get-upload-files/get-upload-files.module';
import { RequestEventEmitterModule } from './common/event-emitter/event-emitter.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { TokenValidationMiddleware } from './common/middleware/token-validation.middleware';
import { httpConfig } from './common/module/http/http-config';
import { ContactModule } from './contact/contact.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LogModule } from './log/log.module';
import { PaymentModule } from './payment/payment.module';
import { PromptModule } from './prompt/prompt.module';
import { SettingsModule } from './settings/settings.module';
import { SubscriptionPlanModule } from './subscription-plan/subscription-plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TerminusModule,
    HttpModule.register(httpConfig),
    MongooseModule.forRoot(getDefaultDbConnectionString()),
    MailerModule.forRoot(getDefaultMailConnectionConfig()),
    ThrottlerModule.forRoot(getThroTTLconfig()),
    ScheduleModule.forRoot(),
    CoreConfigModule,
    LogModule,
    AuthModule,
    GoogleAuthModule,
    UserModule,
    JwtModule,
    GetUploadFilesModule,
    SubscriptionPlanModule,
    SubscriptionModule,
    PaymentModule,
    PromptModule,
    RequestEventEmitterModule,
    DashboardModule,
    SettingsModule,
    ContactModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenValidationMiddleware)
      .exclude(
        { path: 'health-check', method: RequestMethod.POST },
        { path: 'auth/verify-registration-mail/:token', method: RequestMethod.POST },
        { path: 'auth/registration', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/forgot-password', method: RequestMethod.POST },
        { path: 'auth/reset-password', method: RequestMethod.POST },
        { path: 'subscription-plan', method: RequestMethod.GET },
        { path: 'subscription-plan/:id', method: RequestMethod.GET },
        { path: 'settings', method: RequestMethod.GET },
        { path: 'uploads/user-profile-image/:filename', method: RequestMethod.GET },
        { path: 'uploads/settings/:filename', method: RequestMethod.GET },
      )
      .forRoutes(
        { path: '*', method: RequestMethod.ALL } // Apply to all other routes
      );
  }
}