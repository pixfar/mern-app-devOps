import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Initialization extends Document {
    @Prop({ required: true, unique: true })
    initialized: boolean;
}

export const InitializationSchema = SchemaFactory.createForClass(Initialization);
