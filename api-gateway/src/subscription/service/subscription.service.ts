import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Response } from 'express';
import { Model, Types } from 'mongoose';
import { FAILED_TO_OPERATE_SUBSCRIPTION, SUBSCRIPTION_NOT_FOUND_FOR_USER } from 'src/common/constants';
import { SubscribedPlan } from 'src/common/enum/enum-subscription-plan';
import { SubscribedPlanStatus } from 'src/common/enum/enum-subscription-plan-status';
import { LogService } from 'src/log/service/log.service';
import { SettingsService } from 'src/settings/services/settings.service';
import { SubscriptionPlan } from 'src/subscription-plan/entities/subscription-plan.entity';
import { UserService } from 'src/user/service/user.service';
import { CreatePurchaseCreditDto } from '../dto/create-purchased-credit.dto';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { Subscription } from '../entities/subscription.entity';
import { InvoiceService } from './invoice.service';

@Injectable()
export class SubscriptionService {

  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    @InjectModel(SubscriptionPlan.name) private subscriptionPlanModel: Model<SubscriptionPlan>,
    private readonly settingsService: SettingsService,
    private readonly invoiceService: InvoiceService,
    private readonly logger: LogService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,) { }

  async createSubscription(subscriptionPlanId: string, user: any, createSubscriptionDto: CreateSubscriptionDto): Promise<any> {
    const subscriptionPlan = await this.subscriptionPlanModel.findById(subscriptionPlanId).exec();

    // Calculate the end date by adding the duration_days to the current date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + subscriptionPlan.duration_days);

    const settings = await this.settingsService.getSettings();
    const taxPercentage = settings.purchaseTaxPercentage;
    // const taxAmount = (subscriptionPlan.finalPrice * taxPercentage) / 100;
    const finalAmount = createSubscriptionDto.amount;
    const taxAmount = ((finalAmount * taxPercentage) / (100 + taxPercentage)); // in cent
    const baseAmount = finalAmount - taxAmount;


    createSubscriptionDto.taxAmount = +taxAmount.toFixed(2);
    createSubscriptionDto.finalAmount = finalAmount;
    createSubscriptionDto.taxPercentage = taxPercentage;
    createSubscriptionDto.baseAmount = baseAmount;

    const newSubscriptionDetail = {
      _id: new Types.ObjectId(),
      subscriptionPlan,
      payment: createSubscriptionDto,
      startDate,
      endDate,
    };

    const subscription = await this.subscriptionModel.findOneAndUpdate(
      { userId: user.sub },
      {
        $push: { subscriptionDetails: newSubscriptionDetail },
        $set: { currentPlan: newSubscriptionDetail, subscribedPlanStatus: SubscribedPlanStatus.ACTIVE },
        $inc: { remainingDownloadAttempt: Number(subscriptionPlan.credit) }
      },
      { new: true, upsert: true }
    ).exec();

    return subscription;
  }

  async createPurchasedCredit(createPurchaseCreditDto: CreatePurchaseCreditDto, user: any) {
    const existingSubscription = this.subscriptionModel.findOne({ userId: new Types.ObjectId(user.sub) }).exec();
    if (!existingSubscription) {
      throw new NotFoundException(SUBSCRIPTION_NOT_FOUND_FOR_USER);
    }

    const settings = await this.settingsService.getSettings();


    const estimateNumberOfCredit = Math.abs(Math.ceil((createPurchaseCreditDto.amount / 100) / settings.creditPrice));
    const taxPercentage = settings.purchaseTaxPercentage;
    const finalAmount = createPurchaseCreditDto.amount;
    // const taxAmount = ((estimateNumberOfCredit * settings.creditPrice * taxPercentage) / 100) * 100; // convert to cent
    const taxAmount = ((finalAmount * taxPercentage) / (100 + taxPercentage)); // in cent
    const baseAmount = finalAmount - taxAmount;

    createPurchaseCreditDto.taxAmount = +taxAmount.toFixed(3);
    createPurchaseCreditDto.taxPercentage = taxPercentage;
    createPurchaseCreditDto.finalAmount = finalAmount;
    createPurchaseCreditDto.baseAmount = baseAmount;

    const updatedSubscription = await this.subscriptionModel.findOneAndUpdate(
      { userId: user.sub },
      {
        $push: { creditPaymentDetails: createPurchaseCreditDto },
        $inc: { remainingDownloadAttempt: Number(estimateNumberOfCredit) }
      },
      { new: true, upsert: true }
    ).exec();

    return updatedSubscription;
  }

  async getInvoice(paymentId: string, user: any, res: Response) {

    const userId = user.sub;
    const userInfo = await this.userService.findById(userId);
    const subscription = await this.subscriptionModel.findOne({ userId }).exec();

    if (!subscription) {
      throw new NotFoundException(SUBSCRIPTION_NOT_FOUND_FOR_USER);
    }
    const invoice = subscription.subscriptionDetails.find((detail) => detail.payment.id === paymentId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const invoiceBuffer = await this.invoiceService.generateInvoice(subscription, paymentId, userInfo)

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${new Date(invoice.payment.created).toISOString()}.pdf`);
    res.send(invoiceBuffer);

  }

  async addTrailSubscription(user: any): Promise<any> {
    try {
      let userId = user._id || user.sub;
      userId = userId.toString();
      const userSubscription = await this.subscriptionModel.findOne({ userId }).exec();

      if (userSubscription && userSubscription.subscriptionDetails.length > 0 && !!userSubscription.currentPlan) {
        return userSubscription;
      }

      const subscriptionPlan = await this.subscriptionPlanModel.findOne({ name: SubscribedPlan.TRIAL_PLAN }).exec();
      if (!subscriptionPlan) {
        return false;
      }

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + subscriptionPlan.duration_days);

      const newSubscriptionDetail = {
        subscriptionPlan: {
          name: subscriptionPlan.name,
          description: subscriptionPlan.description,
          price: subscriptionPlan.price,
          currency: subscriptionPlan.currency,
          discount: subscriptionPlan.discount,
          finalPrice: subscriptionPlan.finalPrice,
          duration_days: subscriptionPlan.duration_days,
          credit: 0,

        },
        payment: {
          amount: 0,
          currency: subscriptionPlan.currency,
          status: 'COMPLETED',
          paymentMethod: 'TRIAL',
          payment_method: 'TRIAL',
          livemode: false,
          created: new Date().getTime(),
          confirmation_method: 'automatic',
          client_secret: 'trial_client_secret',
          capture_method: 'automatic',
          amount_details: { tip: { amount: 0 } },
          object: 'payment_intent',
          id: 'trial_' + Date.now(),
          userId
        },
        startDate,
        endDate,

      };

      const subscription = new this.subscriptionModel({
        userId,
        subscribedPlanStatus: SubscribedPlanStatus.ACTIVE,
        currentPlan: newSubscriptionDetail,
        subscriptionDetails: [newSubscriptionDetail]
      });

      return subscription.save();
    } catch (error) {
      console.log(error);
    }
  }

  async findAllSubscription(): Promise<Subscription[]> {
    return this.subscriptionModel.find().populate('userId').populate('subscriptionDetails.subscriptionPlan').populate('subscriptionDetails.payment').exec();
  }

  // async findSubscriptionByUser(userId: string): Promise<Subscription> {
  async findSubscriptionByUser(userId: string): Promise<any> {
    let subscriptionOfTheUser = await this.subscriptionModel.findOne({ userId }).populate('userId').populate('subscriptionDetails.subscriptionPlan').populate('subscriptionDetails.payment').exec();

    return subscriptionOfTheUser;
  }


  async incrementPromptCount(userId: string): Promise<Subscription> {
    try {
      const updatedSubscription = await this.subscriptionModel.findOneAndUpdate(
        { userId },
        { $inc: { promptCount: 1 } },
        { new: true }
      ).exec();

      if (!updatedSubscription) {
        throw new NotFoundException(SUBSCRIPTION_NOT_FOUND_FOR_USER);
      }

      return updatedSubscription;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_OPERATE_SUBSCRIPTION);
    }
  }

  async decrementDownloadCount(userId: string): Promise<Subscription> {
    try {
      const updatedSubscription = await this.subscriptionModel.findOneAndUpdate(
        { userId },
        { $inc: { remainingDownloadAttempt: -1 } },
        { new: true }
      ).exec();
      if (!updatedSubscription) {
        throw new NotFoundException(SUBSCRIPTION_NOT_FOUND_FOR_USER);
      }
      return updatedSubscription;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_OPERATE_SUBSCRIPTION);
    }
  }

  async incrementDownloadCount(userId: string, count: number): Promise<Subscription> {
    try {
      const updatedSubscription = await this.subscriptionModel.findOneAndUpdate(
        { userId },
        { $inc: { remainingDownloadAttempt: count } },
        { new: true }
      ).exec();
      if (!updatedSubscription) {
        throw new NotFoundException(SUBSCRIPTION_NOT_FOUND_FOR_USER);
      }
      return updatedSubscription;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_OPERATE_SUBSCRIPTION);
    }
  }

  // Find by payment ID
  async findSubscriptionByPaymentId(paymentId: string): Promise<Subscription | null> {
    const result = await this.subscriptionModel.findOne({
      $or: [
        {
          "creditPaymentDetails.id": paymentId
        },
        {
          "subscriptionDetails.payment.id": paymentId
        }
      ]
    }).exec()
    return result
  }


  @Cron('0 0 * * *')
  async updateExpiredSubscriptions(): Promise<void> {
    try {
      this.logger.info('Updating expired subscriptions...');
      const now = new Date();
      await this.subscriptionModel.updateMany(
        { 'currentPlan.endDate': { $lt: now }, subscribedPlanStatus: SubscribedPlanStatus.ACTIVE },
        { $set: { subscribedPlanStatus: SubscribedPlanStatus.EXPIRED } }
      ).exec();
      this.logger.info(`Expired subscriptions updated successfully. in ${((new Date().getTime() - now.getTime()) / 60000).toFixed(2)} minutes`);
    } catch (error) {
      this.logger.error('Error updating expired subscriptions', error);
    }
  }


}
