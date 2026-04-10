import { Schema } from '@nestjs/mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class EmailOtp {
  @Prop({ required: true })
  email?: string;
  @Prop({ required: true })
  otp?: string;
  @Prop({ required: true })
  expiresAt?: Date;
  @Prop({ default: false })
  verified?: boolean;

  @Prop({ default: 0 })
  resendCount?: number;

  @Prop({ default: 0 })
  attemptCount?: number;

  @Prop()
  lastResendAt?: Date;
}
export const EmailOtpSchema = SchemaFactory.createForClass(EmailOtp);
