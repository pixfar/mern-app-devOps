/**
 * Service responsible for handling dashboard analytics and statistics
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionPlan } from '../../subscription-plan/entities/subscription-plan.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    @InjectModel(SubscriptionPlan.name) private subscriptionPlanModel: Model<SubscriptionPlan>,
  ) { }

  /**
   * Retrieves comprehensive dashboard analytics including user counts and subscription statistics
   * @returns Object containing total users, subscription stats, and plan stats
   */
  async getDashboardAnalytics() {
    const [totalUsers, subscriptionStats, planStats] = await Promise.all([
      this.getTotalUsers(),
      this.getSubscriptionStats(),
      this.getPlanStats()
    ]);

    return {
      totalUsers,
      subscriptionStats,
      planStats,
    };
  }

  /**
   * Gets the total count of users in the system
   * @returns Total number of users
   */
  private async getTotalUsers(): Promise<number> {
    return this.userModel.countDocuments();
  }

  /**
   * Retrieves subscription statistics for various time periods
   * @returns Object containing subscription stats for different time ranges
   */
  private async getSubscriptionStats() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    const [thisWeek, thisMonth, sixMonths, oneYear, lifetime] = await Promise.all([
      this.getSubscriptionStatsForPeriod(oneWeekAgo, now),
      this.getSubscriptionStatsForPeriod(oneMonthAgo, now),
      this.getSubscriptionStatsForPeriod(sixMonthsAgo, now),
      this.getSubscriptionStatsForPeriod(oneYearAgo, now),
      this.getSubscriptionStatsForPeriod(new Date(0), now),
    ]);

    return { thisWeek, thisMonth, sixMonths, oneYear, lifetime };
  }

  /**
   * Calculates subscription statistics for a specific time period
   * @param startDate Beginning of the period
   * @param endDate End of the period
   * @returns Object containing total sales and amount for the period
   */
  private async getSubscriptionStatsForPeriod(startDate: Date, endDate: Date) {
    const aggregationResult = await this.subscriptionModel.aggregate([
      {
        $match: {
          'subscriptionDetails.startDate': { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalAmount: { $sum: '$subscriptionDetails.payment.amount' },
        },
      },
    ]);

    const result = aggregationResult[0] || { totalSales: 0, totalAmount: 0 };

    if (result.totalAmount) {
      result.totalAmount = result.totalAmount / 100;
    }

    return result;
  }

  /**
   * Retrieves subscription plan statistics for different time periods
   * @returns Object containing plan stats for different time ranges
   */
  private async getPlanStats() {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    const [thisMonth, sixMonths, oneYear] = await Promise.all([
      this.getPlanStatsForPeriod(oneMonthAgo, now),
      this.getPlanStatsForPeriod(sixMonthsAgo, now),
      this.getPlanStatsForPeriod(oneYearAgo, now),
    ]);

    return { thisMonth, sixMonths, oneYear };
  }

  /**
   * Calculates plan-specific statistics for a given time period
   * @param startDate Beginning of the period
   * @param endDate End of the period
   * @returns Array of objects containing stats for each plan
   */
  private async getPlanStatsForPeriod(startDate: Date, endDate: Date) {
    const result = await this.subscriptionModel.aggregate([
      {
        $match: {
          'subscriptionDetails.startDate': { $gte: startDate, $lte: endDate },
        },
      },
      {
        $unwind: '$subscriptionDetails',
      },
      {
        $group: {
          _id: '$subscriptionDetails.subscriptionPlan.name',
          totalSales: { $sum: 1 },
          totalAmount: { $sum: '$subscriptionDetails.payment.amount' },
        },
      },
    ]);

    const formattedResult = result.map((item) => ({
      name: item._id,
      totalSales: item.totalSales,
      totalAmount: item.totalAmount / 100,
    }));
    return formattedResult;
  }
}