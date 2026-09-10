// log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Log extends Document {
    @Prop({ required: true, index: true })
    level: string;

    @Prop({ required: true })
    message: string;

    @Prop({ type: Object })
    meta: Record<string, any>;

    @Prop({ type: Date, default: Date.now, index: true })
    timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
