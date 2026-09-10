import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateSubscriptionDto } from 'src/subscription/dto/create-subscription.dto';
import Stripe from 'stripe';
import { CoreConfigService, STRIPE_SECRET_KEY } from '../config/core';
import { SubscriptionService } from 'src/subscription/service/subscription.service';

@Injectable()
export class SubscriptionPaymentValidationPipe implements PipeTransform {
  private stripe: Stripe;

  constructor(
    private readonly config: CoreConfigService,
    private readonly subscriptionService : SubscriptionService
  ) {
    this.stripe = new Stripe(this.config.get(STRIPE_SECRET_KEY), {});
  }

  async transform(value: CreateSubscriptionDto, metadata: ArgumentMetadata) {
    const { id, amount, client_secret, created, currency, payment_method, payment_method_types } = value;
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Payment ID is required and must be a string');
    }
    try {
      // check the payment in database
      let isExist = await this.subscriptionService.findSubscriptionByPaymentId(id);
      if(isExist){
        throw new BadRequestException('This payment has already been processed');
      }

      const paymentIntent = await this.stripe.paymentIntents.retrieve(id);

      console.log("Payment Intent retrieved:", paymentIntent);

      if (paymentIntent.status !== 'succeeded') {
        throw new BadRequestException('Payment verification failed');
      }

      if (paymentIntent.amount !== amount) {
        throw new BadRequestException('Amount mismatch');
      }

      if (paymentIntent.client_secret !== client_secret) {
        throw new BadRequestException('Client secret mismatch');
      }

      if (paymentIntent.created !== created) {
        throw new BadRequestException('Created timestamp mismatch');
      }

      if (paymentIntent.currency !== currency) {
        throw new BadRequestException('Currency mismatch');
      }

      if (paymentIntent.payment_method !== payment_method) {
        throw new BadRequestException('Payment method mismatch');
      }

      if (!paymentIntent.payment_method_types.includes('card')) {
        throw new BadRequestException('Payment method type mismatch');
      }

      return value;
    } catch (error) {
      throw new BadRequestException(`Unable to verify payment: ${error.message}`);
    }
  }
}
