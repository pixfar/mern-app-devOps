import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { UserSigningBy } from '../../common/enum/enum-signing-by-social-id';
import { UserRole } from '../../common/enum/enum-user-role';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  dateOfBirth: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  zipCode: string;

  @Prop()
  address: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ required: true })
  termsAndCondition: boolean;

  @Prop({ type: String, enum: UserRole, required: true })
  role: string;

  // @Prop({
  //   type: {
  //     planName: { type: String, enum: SubscribedPlan, required: true, default: SubscribedPlan.TRIAL_PLAN },
  //     createdAt: { type: Date, required: true },
  //     updatedAt: { type: Date, required: true },
  //     expiryTime: { type: Date, required: true },
  //     totalUsedPrompt: { type: Number, default: 0 }
  //   },
  //   _id: false
  // })
  // subscribedPlan: {
  //   planName: string;
  //   createdAt: Date;
  //   updatedAt: Date;
  //   expiryDate: Date;
  //   totalUsedPrompt: number;
  // };

  @Prop({ type: Array, enum: UserSigningBy, required: true })
  signingBy: UserSigningBy;

  @Prop({ type: String })
  profileImage: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: String, default: null, select: false })
  currentToken: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.fullName = this.firstName + " " + this.lastName;
  next();
});