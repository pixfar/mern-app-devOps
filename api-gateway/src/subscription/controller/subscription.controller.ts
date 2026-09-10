import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CoreConfigService } from 'src/common/config/core';
import { Roles } from 'src/common/decorators';
import { GetSessionUser } from 'src/common/decorators/session-user.decorator';
import { UserRole } from 'src/common/enum';
import { AuthGuard, RolesGuard } from 'src/common/guard';
import { SubscriptionGuard } from 'src/common/guard/subscription.guard';
import { SubscriptionPaymentValidationPipe } from 'src/common/pipe/subscription-payment-validation.pipe';
import { CreatePurchaseCreditDto } from '../dto/create-purchased-credit.dto';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SubscriptionService } from '../service/subscription.service';

@Controller('subscription')
@ApiTags('Subscription')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private config: CoreConfigService,
  ) {

  }

  @Post('purchased-credit/payment-details')
  @UseGuards(SubscriptionGuard)
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  createPurchasedCredit(
    @Body(SubscriptionPaymentValidationPipe) createPurchaseCreditDto: CreatePurchaseCreditDto,
    @GetSessionUser() user: any) {
    return this.subscriptionService.createPurchasedCredit(createPurchaseCreditDto, user);
  }
  
  @Get('/invoice/:paymentId')
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @ApiParam({ name: 'paymentId', required: true, description: 'ID of Payment' })
  getInvoice(
    @Param('paymentId') paymentId: string,
    @GetSessionUser() user: any,
    @Res() res: Response
  ) {
    return this.subscriptionService.getInvoice(paymentId, user, res);
  }

  @Post(':subscriptionPlanId/payment-details')
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @ApiParam({ name: 'subscriptionPlanId', required: true, description: 'ID of the subscription plan' })
  create(
    @Param('subscriptionPlanId') subscriptionPlanId,
    @Body(SubscriptionPaymentValidationPipe) createSubscriptionDto: CreateSubscriptionDto,
    @GetSessionUser() user: any) {
    return this.subscriptionService.createSubscription(subscriptionPlanId, user, createSubscriptionDto);
  }



  @Get('list')
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  findAllSubscription(@GetSessionUser() user: any) {
    console.log(user)
    return this.subscriptionService.findAllSubscription();
  }

  @Get()
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  findSubscriptionByUser(@GetSessionUser() user: any) {
    return this.subscriptionService.findSubscriptionByUser(user.sub);
  }

}
