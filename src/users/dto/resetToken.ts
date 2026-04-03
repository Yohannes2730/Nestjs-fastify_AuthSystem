// reset-token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResetTokenDocument = ResetToken & Document;

@Schema({ timestamps: true })
export class ResetToken {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  type: string; 
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);