import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SubscriptionService } from 'src/subscription/service/subscription.service';
import { UserRole } from '../enum';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(
        private readonly subscriptionService: SubscriptionService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const user = request.user as any;

        const userRole = user.role;

        if (
            userRole == UserRole.ADMINISTRATOR ||
            userRole == UserRole.SYSTEM_ADMINISTRATOR
        ) {
            return true;
        }

        if (!user || !user.sub) {
            throw new BadRequestException('Invalid user');
        }
        // First Trail subscription
        await this.subscriptionService.addTrailSubscription(user);
        // Find the subscription plan based on user ID
        const subscriptionPlan = await this.subscriptionService.findSubscriptionByUser(user.sub);
        if (!subscriptionPlan) {
            throw new BadRequestException('Subscription not found');
        }

        if (!subscriptionPlan || !this.isSubscriptionValid(subscriptionPlan)) {
            throw new BadRequestException('Invalid or expired subscription');
        }

        return true;
    }

    private isSubscriptionValid(subscriptionPlan: Subscription): boolean {
        return subscriptionPlan.currentPlan.endDate > new Date();
    }
}
