import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true,select: false })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop({ type: Date, default: null })
  blockedUntil: Date | null;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const userSchema = SchemaFactory.createForClass(Users);