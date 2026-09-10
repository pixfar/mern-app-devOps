import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Currency } from 'src/common/enum/enum-currency';
export class CreateSubscriptionDto {

  @ApiProperty({ description: 'The unique identifier for the subscription', example: 'pi_3PhWPSAUKFnyNYU60KuvqqY9' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'The object type', example: 'payment_intent', default: 'payment_intent' })
  @IsString()
  @IsNotEmpty()
  object: string;

  @ApiProperty({ description: 'The amount in cents', example: 1470, minimum: 0 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Additional details about the amount', example: { tip: {} } })
  @IsObject()
  amount_details: Record<string, any>;

  @ApiProperty({ required: false, nullable: true, description: 'Automatic payment methods', example: null })
  @IsOptional()
  @IsString()
  automatic_payment_methods: string | null;

  @ApiProperty({ required: false, nullable: true, description: 'Timestamp of cancellation', example: null })
  @IsOptional()
  @IsNumber()
  canceled_at: number | null;

  @ApiProperty({ required: false, nullable: true, description: 'Reason for cancellation', example: null })
  @IsOptional()
  @IsString()
  cancellation_reason: string | null;

  @ApiProperty({ description: 'The capture method', example: 'automatic_async', default: 'automatic_async' })
  @IsString()
  @IsNotEmpty()
  capture_method: string;

  @ApiProperty({ description: 'The client secret', example: 'pi_3PhWPSAUKFnyNYU60KuvqqY9_secret_EpqMKtI4TUE63z8Zb7uMOwe1L' })
  @IsString()
  @IsNotEmpty()
  client_secret: string;

  @ApiProperty({ description: 'The confirmation method', example: 'automatic', default: 'automatic' })
  @IsString()
  @IsNotEmpty()
  confirmation_method: string;

  @ApiProperty({ description: 'Timestamp of creation', example: 1722170470 })
  @IsNumber()
  @IsNotEmpty()
  created: number;

  @ApiProperty({ description: 'The currency code', example: Currency.EUR, default: Currency.EUR })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ required: false, nullable: true, description: 'Description of the subscription', example: null })
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty({ required: false, nullable: true, description: 'Last payment error', example: null })
  @IsOptional()
  @IsString()
  last_payment_error: string | null;

  @ApiProperty({ description: 'Whether the subscription is in live mode', example: false, default: false })
  @IsBoolean()
  @IsNotEmpty()
  livemode: boolean;

  @ApiProperty({ required: false, nullable: true, description: 'Next action required', example: null })
  @IsOptional()
  @IsString()
  next_action: string | null;

  @ApiProperty({ description: 'The payment method ID', example: 'pm_1PhWPjAUKFnyNYU6EZf09cXM' })
  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @ApiProperty({ required: false, nullable: true, description: 'Payment method configuration details', example: null })
  @IsOptional()
  @IsString()
  payment_method_configuration_details: string | null;

  @ApiProperty({ description: 'Allowed payment method types', example: ['card'], default: ['card'] })
  @IsArray()
  @IsNotEmpty()
  payment_method_types: string[];

  @ApiProperty({ required: false, nullable: true, description: 'Processing details', example: null })
  @IsOptional()
  @IsString()
  processing: string | null;

  @ApiProperty({ required: false, nullable: true, description: 'Receipt email', example: null })
  @IsOptional()
  @IsString()
  receipt_email: string | null;

  @ApiProperty({ required: false, nullable: true, description: 'Setup for future usage', example: null })
  @IsOptional()
  @IsString()
  setup_future_usage: string | null;

  @ApiProperty({ required: false, nullable: true, description: 'Shipping details', example: null })
  @IsOptional()
  @IsString()
  shipping: string | null;

  @ApiProperty({ required: false, nullable: true, description: 'Source of the payment', example: null })
  @IsOptional()
  @IsString()
  source: string | null;

  @ApiProperty({ description: 'The status of the subscription', example: 'succeeded', default: 'succeeded' })
  @IsString()
  @IsNotEmpty()
  status: string;

  taxAmount: number;
  taxPercentage: number;
  finalAmount: number;
  baseAmount: number;
}

// {
//   "id": "pi_3PhWPSAUKFnyNYU60KuvqqY9",
//   "object": "payment_intent",
//   "amount": 1470,
//   "amount_details": {
//     "tip": {}
//   },
//   "automatic_payment_methods": null,
//   "canceled_at": null,
//   "cancellation_reason": null,
//   "capture_method": "automatic_async",
//   "client_secret": "pi_3PhWPSAUKFnyNYU60KuvqqY9_secret_EpqMKtI4TUE63z8Zb7uMOwe1L",
//   "confirmation_method": "automatic",
//   "created": 1722170470,
//   "currency": "usd",
//   "description": null,
//   "last_payment_error": null,
//   "livemode": false,
//   "next_action": null,
//   "payment_method": "pm_1PhWPjAUKFnyNYU6EZf09cXM",
//   "payment_method_configuration_details": null,
//   "payment_method_types": [
//     "card"
//   ],
//   "processing": null,
//   "receipt_email": null,
//   "setup_future_usage": null,
//   "shipping": null,
//   "source": null,
//   "status": "succeeded"
// }