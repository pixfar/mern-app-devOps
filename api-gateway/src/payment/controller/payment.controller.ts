import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';
import { GetSessionUser } from 'src/common/decorators/session-user.decorator';
import { UserRole } from 'src/common/enum';
import { AuthGuard, RolesGuard } from 'src/common/guard/';
import { SubscriptionGuard } from 'src/common/guard/subscription.guard';
import { SubscriptionPlanIdValidationPipe } from 'src/common/pipe/subscription-plan-id-validation.pipe';
import { PurchaseCreditPaymentDto } from '../dto/purchase-credit-payment.dto';
import { PaymentService } from '../service/payment.service';

@Controller('payment')
@ApiTags("Payment")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('purchase-credit/create-payment-intent')
  @UseGuards(SubscriptionGuard)
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  async createPurchaseCredit(
    @Body() purchaseCreditPaymentDto: PurchaseCreditPaymentDto,
    @GetSessionUser() user: any) {
    return await this.paymentService.createPurchaseCredit(purchaseCreditPaymentDto, user);
  }

  @Post(':subscriptionPlanId/create-payment-intent')
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  async createPaymentIntent(@Param('subscriptionPlanId', SubscriptionPlanIdValidationPipe) subscriptionPlanId: string, @GetSessionUser() user: any,) {
    return await this.paymentService.createPaymentIntent(subscriptionPlanId, user);
  }

}
