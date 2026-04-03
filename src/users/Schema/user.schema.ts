import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Users extends Document {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ default: false })
  isVerified: boolean;
  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const userSchema = SchemaFactory.createForClass(Users);
