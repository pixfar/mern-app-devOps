import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionPlanController } from './controller/subscription-plan.controller';
import { SubscriptionPlanSchema } from './entities/subscription-plan.entity';
import { SubscriptionPlanService } from './service/subscription-plan.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: "SubscriptionPlan", schema: SubscriptionPlanSchema }])
  ],
  controllers: [SubscriptionPlanController],
  providers: [SubscriptionPlanService],
  exports: [SubscriptionPlanService, MongooseModule]
})
export class SubscriptionPlanModule { }
