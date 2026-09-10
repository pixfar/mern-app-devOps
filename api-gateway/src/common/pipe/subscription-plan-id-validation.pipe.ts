import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionPlan } from 'src/subscription-plan/entities/subscription-plan.entity';

@Injectable()
export class SubscriptionPlanIdValidationPipe implements PipeTransform {
  constructor(
    @InjectModel(SubscriptionPlan.name) private subscriptionPlanModel: Model<SubscriptionPlan>,
  ) {}

  async transform(value: any) {
    const subscriptionPlan = await this.subscriptionPlanModel.findById(value).exec();
    if (!subscriptionPlan) {
      throw new NotFoundException(`Subscription plan with ID ${value} not found`);
    }
    return value;
  }
}
