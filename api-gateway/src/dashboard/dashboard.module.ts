import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionPlan, SubscriptionPlanSchema } from 'src/subscription-plan/entities/subscription-plan.entity';
import { Subscription, SubscriptionSchema } from 'src/subscription/entities/subscription.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';

import { DashboardController } from './controller/dashboard.controller';
import { DashboardService } from './service/dashboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema }
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
