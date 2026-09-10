import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createApiResponse } from 'src/common/constants/create-api.response';
import { DATA_FOUND, FAILED_RESPONSE, NO_DATA_FOUND, SUBSCRIPTION_PLAN_ALREADY_EXISTS, SUBSCRIPTION_PLAN_CREATED_SUCCESSFULLY, SUBSCRIPTION_PLAN_UPDATED_SUCCESSFULLY, SUCCESS_RESPONSE } from 'src/common/constants/message.response';
import { CreateSubscriptionPlanDto } from '../dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from '../dto/update-subscription-plan.dto';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';

@Injectable()
export class SubscriptionPlanService {

  constructor(
    @InjectModel(SubscriptionPlan.name) private readonly subscriptionPlanModel: Model<SubscriptionPlan>,
  ) { }

  async create(createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    try {
      const newSubscriptionPlan = new this.subscriptionPlanModel(createSubscriptionPlanDto);
      newSubscriptionPlan.finalPrice = Number(newSubscriptionPlan.price - (newSubscriptionPlan.price * newSubscriptionPlan.discount) / 100);
      await newSubscriptionPlan.save();
      return createApiResponse(
        HttpStatus.CREATED,
        SUCCESS_RESPONSE,
        SUBSCRIPTION_PLAN_CREATED_SUCCESSFULLY,
        newSubscriptionPlan,
      );
    } catch (error) {
      if (error.code === 11000) {
        return createApiResponse(
          HttpStatus.CONFLICT,
          FAILED_RESPONSE,
          SUBSCRIPTION_PLAN_ALREADY_EXISTS,
        );
      }
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAILED_RESPONSE,
        error.message,
      );
    }
  }


  async findAll(params: { isPublic: boolean } = { isPublic: true }) {
    try {
      let isPublic = params.isPublic;
      let query: any = isPublic ? { isPublic: true } : {};
      const subscriptionPlans = await this.subscriptionPlanModel.find(query).exec();
      if (subscriptionPlans.length > 0) {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          DATA_FOUND,
          subscriptionPlans,
        );
      } else {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          NO_DATA_FOUND,
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAILED_RESPONSE,
        error.message,
      );
    }
  }

  async findOne(id: string) {
    try {
      const subscriptionPlan = await this.subscriptionPlanModel.findById(id).exec();
      if (subscriptionPlan) {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          DATA_FOUND,
          subscriptionPlan,
        );
      } else {
        return createApiResponse(
          HttpStatus.NOT_FOUND,
          SUCCESS_RESPONSE,
          NO_DATA_FOUND,

        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAILED_RESPONSE,
        error.message,
      );
    }
  }

  async update(id: string, updateSubscriptionPlanDto: UpdateSubscriptionPlanDto) {
    try {

      if (updateSubscriptionPlanDto.price || updateSubscriptionPlanDto.discount) {
        updateSubscriptionPlanDto.finalPrice = Number(updateSubscriptionPlanDto.price - (updateSubscriptionPlanDto.price * updateSubscriptionPlanDto.discount) / 100);
      }

      const updatedSubscriptionPlan = await this.subscriptionPlanModel.findByIdAndUpdate(id, updateSubscriptionPlanDto, { new: true }).exec();
      if (updatedSubscriptionPlan) {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          SUBSCRIPTION_PLAN_UPDATED_SUCCESSFULLY,
          updatedSubscriptionPlan,
        );
      } else {
        return createApiResponse(
          HttpStatus.NOT_FOUND,
          NO_DATA_FOUND,
          'Subscription plan not found',
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAILED_RESPONSE,
        error.message,
      );
    }
  }

  async remove(id: string) {
    try {
      const deletedSubscriptionPlan = await this.subscriptionPlanModel.findByIdAndDelete(id).exec();
      if (deletedSubscriptionPlan) {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          'Subscription plan deleted successfully',
          deletedSubscriptionPlan,
        );
      } else {
        return createApiResponse(
          HttpStatus.NOT_FOUND,
          NO_DATA_FOUND,
          'Subscription plan not found',
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAILED_RESPONSE,
        error.message,
      );
    }
  }
}
