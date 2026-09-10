import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreConfigService } from 'src/common/config/core';
import { SubscriptionPaymentValidationPipe } from 'src/common/pipe/subscription-payment-validation.pipe';
import { SubscriptionPlanModule } from 'src/subscription-plan/subscription-plan.module';
import { UserModule } from 'src/user/user.module';
import { SubscriptionController } from './controller/subscription.controller';
import { SubscriptionSchema } from './entities/subscription.entity';
import { InvoiceService } from './service/invoice.service';
import { SubscriptionService } from './service/subscription.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Subscription", schema: SubscriptionSchema }]),
    SubscriptionPlanModule,
    forwardRef(() => UserModule)
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, InvoiceService, CoreConfigService, SubscriptionPaymentValidationPipe],
  exports: [SubscriptionService]
})
export class SubscriptionModule { }
