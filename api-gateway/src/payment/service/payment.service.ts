import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoreConfigService, STRIPE_SECRET_KEY } from 'src/common/config/core';
import { createApiResponse, PAYMENT_INTENT_CREATED_SUCCESSFULLY, SUBSCRIPTION_PLAN_NOT_FOUND, SUCCESS_RESPONSE } from 'src/common/constants';
import { Currency } from 'src/common/enum/enum-currency';
import { SettingsService } from 'src/settings/services/settings.service';
import { SubscriptionPlan } from 'src/subscription-plan/entities/subscription-plan.entity';
import Stripe from 'stripe';
import { PurchaseCreditPaymentDto } from '../dto/purchase-credit-payment.dto';


@Injectable()
export class PaymentService {


  private stripe: Stripe;
  constructor(
    @InjectModel(SubscriptionPlan.name) private readonly subscriptionPlanModel: Model<SubscriptionPlan>,
    private readonly config: CoreConfigService,
    private readonly settingsService: SettingsService
  ) {
    this.stripe = new Stripe(this.config.get(STRIPE_SECRET_KEY));
  }

  async createPaymentIntent(subscriptionPlanId: string, user: any) {
    try {
      const subscriptionPlan = await this.subscriptionPlanModel.findById(subscriptionPlanId).exec();
      if (!subscriptionPlan) {
        throw new HttpException(SUBSCRIPTION_PLAN_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      const customer = await this.stripe.customers.create({
        email: user?.email
      });

      const settings = await this.settingsService.getSettings();

      const taxPercentage = settings.purchaseTaxPercentage;
      const finalAmount = subscriptionPlan.finalPrice;
      const taxAmount = ((finalAmount * taxPercentage) / (100 + taxPercentage)) * 100; // convert to cent
      // const baseAmount = finalAmount - taxAmount;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(finalAmount * 100), // have to convert in to cent
        currency: subscriptionPlan.currency,
        customer: customer.id,
        payment_method_types: ['card'],
      });
      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        PAYMENT_INTENT_CREATED_SUCCESSFULLY,
        {
          clientSecret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          taxPercentage: taxPercentage,
          tax: taxAmount,
          currency: subscriptionPlan.currency,
        });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async createPurchaseCredit(purchaseCreditPaymentDto: PurchaseCreditPaymentDto, user: any) {
    try {

      const customer = await this.stripe.customers.create({
        email: user?.email
      });
      const settings = await this.settingsService.getSettings();

      const taxPercentage = settings.purchaseTaxPercentage;
      const finalAmount = (purchaseCreditPaymentDto.numberOfCredit * settings.creditPrice);

      const taxAmount = ((finalAmount * taxPercentage) / (100 + taxPercentage)) * 100; // convert to cents

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(finalAmount * 100), // have to convert in to const
        currency: Currency.EUR,
        customer: customer.id,
        payment_method_types: ['card'],
      });
      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        PAYMENT_INTENT_CREATED_SUCCESSFULLY,
        {
          clientSecret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          taxPercentage: taxPercentage,
          tax: taxAmount,
          currency: paymentIntent.currency,
          credit: purchaseCreditPaymentDto.numberOfCredit
        });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
