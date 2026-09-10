import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LawDocument = Law & Document;

@Schema({ timestamps: true })
export class Law extends Document {
  @Prop({ trim: true, index: true })
  documentTitle: string;

  @Prop({ required: true, trim: true, index: true })
  sectionTitle: string;

  @Prop({ required: true, trim: true, index: true })
  law: string;

  @Prop({ required: true, trim: true, index: true })
  pdfName: string;

  @Prop([{
    str: String,
    dir: String,
    width: Number,
    height: Number,
    transform: [Number],
    fontName: String,
    hasEOL: Boolean
  }])
  contents: Array<{
    str: string;
    dir: string;
    width: number;
    height: number;
    transform: number[];
    fontName: string;
    hasEOL: boolean;
  }>;
}

export const LawSchema = SchemaFactory.createForClass(Law);
