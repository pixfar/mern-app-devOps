import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true, versionKey: false })
export class Setting extends Document {
  @Prop({ required: true, type: Number })
  creditPrice: number

  @Prop({ type: String })
  logo: string

  @Prop({ type: String })
  appName: string

  @Prop({ type: String })
  primaryColor: string

  @Prop({ type: String })
  secondaryColor: string

  @Prop({ type: Boolean, default: false })
  maintenanceMode: boolean

  @Prop({ type: String })
  privacyPolicy: string

  @Prop({ type: String })
  termsOfService: string

  @Prop({ type: Number, default: 0 })
  maxUploadSize: number

  @Prop({ type: Number, default: 0 })
  purchaseTaxPercentage: number
}

export const SettingSchema = SchemaFactory.createForClass(Setting)
