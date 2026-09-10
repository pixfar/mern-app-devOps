import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Currency } from 'src/common/enum/enum-currency';

@Schema({ timestamps: true, versionKey: false, autoIndex: false })
export class SubscriptionPlan extends Document {
    @Prop({ required: true, type: String, unique: true })
    name: String;

    @Prop({ required: true, type: Object })
    description: any;

    @Prop({ required: true, type: Number })
    price: number;

    @Prop({ required: true, type: String, enum: Currency })
    currency: string;

    @Prop({ required: true, type: Number })
    discount: number;

    @Prop({ required: true, type: Number })
    finalPrice: number;

    @Prop({ required: true, type: Number })
    duration_days: number;

    @Prop({ required: true, type: Number })
    credit: number;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ default: false })
    isPublic: boolean; // for some trail subscription
}

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);
