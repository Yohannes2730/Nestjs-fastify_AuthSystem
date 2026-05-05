import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailOtpDocument = EmailOtp & Document;

@Schema({ timestamps: true })
export class EmailOtp {
  @Prop({ required: true, index: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: 0 })
  resendCount: number;

  @Prop({ default: 0 })
  attemptCount: number;

  @Prop()
  lastResendAt: Date;
}

export const EmailOtpSchema = SchemaFactory.createForClass(EmailOtp);

EmailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });