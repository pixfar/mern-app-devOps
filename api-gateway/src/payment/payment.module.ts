import { Module } from '@nestjs/common';
import { SubscriptionPlanModule } from 'src/subscription-plan/subscription-plan.module';
import { PaymentController } from './controller/payment.controller';
import { PaymentService } from './service/payment.service';


@Module({
  imports: [SubscriptionPlanModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule { }
