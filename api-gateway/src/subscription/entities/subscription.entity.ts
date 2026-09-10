import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { SubscribedPlanStatus } from 'src/common/enum/enum-subscription-plan-status';
import { Payment, PaymentSchema } from 'src/payment/entities/payment.entity';
import { SubscriptionPlan, SubscriptionPlanSchema } from 'src/subscription-plan/entities/subscription-plan.entity';

// Define the nested schema for subscription details
const SubscriptionDetailSchema = new MongooseSchema({
    subscriptionPlan: { type: SubscriptionPlanSchema.clone().clearIndexes(), required: true },
    payment: { type: PaymentSchema.clone().clearIndexes(), required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
},);

@Schema({ timestamps: true, versionKey: false })
export class Subscription extends Document {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true, enum: SubscribedPlanStatus })
    subscribedPlanStatus: string;

    @Prop({ required: true, type: [SubscriptionDetailSchema] })
    subscriptionDetails: Array<{
        subscriptionPlan: SubscriptionPlan;
        payment: Partial<Payment>;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
    }>;


    @Prop({ required: false, type: Array<Payment>, default: [] })
    creditPaymentDetails: Array<Partial<Payment>>;

    @Prop({ required: true, type: SubscriptionDetailSchema })
    currentPlan: {
        subscriptionPlan: SubscriptionPlan;
        payment: Partial<Payment>;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
    };

    @Prop({ type: Number, default: 0 })
    promptCount: number;

    @Prop({ type: Number, default: 0 })
    remainingDownloadAttempt: number;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

// Add a pre-find middleware to check and update subscribedPlanStatus
SubscriptionSchema.pre('find', async function (next) {
    const now = new Date();
    await this.model.updateMany(
        { 'currentPlan.endDate': { $lt: now }, subscribedPlanStatus: SubscribedPlanStatus.ACTIVE },
        { $set: { subscribedPlanStatus: SubscribedPlanStatus.EXPIRED } }
    ).lean();
    next();
});

// Add a pre-findOne middleware to check and update subscribedPlanStatus
SubscriptionSchema.pre('findOne', async function (next) {
    const now = new Date();
    await this.model.updateMany(
        { 'currentPlan.endDate': { $lt: now }, subscribedPlanStatus: SubscribedPlanStatus.ACTIVE },
        { $set: { subscribedPlanStatus: SubscribedPlanStatus.EXPIRED } }
    ).lean();
    next();
});
