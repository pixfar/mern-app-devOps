import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false, autoIndex: false })
export class Payment extends Document {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    object: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, type: Object })
    amount_details: Record<string, any>;

    @Prop()
    automatic_payment_methods: string | null;

    @Prop()
    canceled_at: number | null;

    @Prop()
    cancellation_reason: string | null;

    @Prop({ required: true })
    capture_method: string;

    @Prop({ required: true })
    client_secret: string;

    @Prop({ required: true })
    confirmation_method: string;

    @Prop({ required: true })
    created: number;

    @Prop({ required: true })
    currency: string;

    @Prop()
    description: string | null;

    @Prop()
    last_payment_error: string | null;

    @Prop({ required: true })
    livemode: boolean;

    @Prop()
    next_action: string | null;

    @Prop({ required: true })
    payment_method: string;

    @Prop()
    payment_method_configuration_details: string | null;

    @Prop({ required: true, type: [String] })
    payment_method_types: string[];

    @Prop()
    processing: string | null;

    @Prop()
    receipt_email: string | null;

    @Prop()
    setup_future_usage: string | null;

    @Prop()
    shipping: string | null;

    @Prop()
    source: string | null;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    taxAmount: number;

    @Prop({ required: true })
    taxPercentage: number;

    @Prop({ required: true })
    finalAmount: number;

    @Prop({ required: true })
    baseAmount: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
