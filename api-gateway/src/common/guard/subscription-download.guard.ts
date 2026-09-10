import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SubscriptionService } from 'src/subscription/service/subscription.service';

@Injectable()
export class SubscriptionDownloadGuard implements CanActivate {
    constructor(
        private readonly subscriptionService: SubscriptionService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const user = request.user as any;

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

        if (subscriptionPlan.remainingDownloadAttempt <= 0) {
            throw new BadRequestException('Download limit reached!');
        }

        return true;
    }
}
